from src.core.config.main import *

def sorting(mails):
    mails = list(reversed(mails))
    important_star = list(filter(lambda item: item['important'] and item['star'], mails))
    important = list(filter(lambda item: item['important'] and not item['star'], mails))
    star = list(filter(lambda item: not item['important'] and item['star'], mails))
    normal = list(filter(lambda item: not item['important'] and not item['star'], mails))
    mails = important_star + important + star + normal
    return mails

def get_mails(id):
    mail_send = mail.objects.filter(sender=id, remove_sender=False)
    mail_receive = mail.objects.filter(receiver=id, remove_receiver=False)
    mails = []
    for ch in mail_send:
        if not user.objects.filter(id=ch.receiver, role=1, active=True).exists(): continue
        user_details = user.objects.get(id=ch.receiver)
        files = file.objects.filter(mail_id=ch.id)
        file_list = []
        for f in files:
            file_list.append({
                "id": f.id, "name": f.name, "type": f.type,
                "size": f.size, "link": f.link, "date": f.date
            })
        mails.append({
            "id": ch.id, "title": ch.title, "description": ch.description, "date": ch.date,
            "active": True, "files": file_list, "admin_name": user_details.name,
            "admin_mail": user_details.email, "admin_image": user_details.image,
            "display_text": ch.display_text, "admin_role": user_details.super,
            "type": "send", "star": ch.star_sender, "important": ch.important_sender,
        })
    for ch in mail_receive:
        if not user.objects.filter(id=ch.sender, role=1, active=True).exists(): continue
        user_details = user.objects.get(id=ch.sender)
        if user_details.id == id: continue
        files = file.objects.filter(mail_id=ch.id)
        file_list = []
        for f in files:
            file_list.append({
                "id": f.id, "name": f.name, "type": f.type,
                "size": f.size, "link": f.link, "date": f.date
            })
        mails.append({
            "id": ch.id, "title": ch.title, "description": ch.description, "date": ch.date,
            "active": ch.see_receiver, "files": file_list, "admin_name": user_details.name,
            "admin_mail": user_details.email, "admin_image": user_details.image,
            "display_text": ch.display_text, "admin_role": user_details.super,
            "type": "inbox", "star": ch.star_receiver, "important": ch.important_receiver,
        })
    return json.dumps(sorting(mails))

@authentication
def index(request):
    data = start_data(request)
    if not data['user'].mail: return redirect('/')
    id = session(request)
    data['users'] = user.objects.filter(active=True, role=1)
    data['mails'] = get_mails(id)
    if request.method == "POST":
        if request.headers['request'] == "send_mail":
            receiver = request.POST.get("id")
            title = request.POST.get("title")
            description = request.POST.get("description")
            display_text = request.POST.get("display_text")
            mail(
                sender=id, receiver=receiver, title=title,
                description=description, date=get_date(), display_text=display_text,
            ).save()
            mail_id = mail.objects.latest("id").id
            file_num = int(request.POST.get("file_num"))
            for ch in range(file_num):
                file_ = request.FILES.get(f"file_{ch}")
                ext = request.POST.get(f"file_{ch}_ext")
                name = request.POST.get(f"file_{ch}_name")
                type = request.POST.get(f"file_{ch}_type")
                size = request.POST.get(f"file_{ch}_size")
                link = upload_file(dir="mail", file=file_, ext=ext)
                file(
                    mail_id=mail_id, name=name, type=type,
                    size=size, link=link, date=get_date()
                ).save()
        if request.headers['request'] == "set_star":
            mail_id = int(request.POST.get("mail_id"))
            is_set = bool(request.POST.get("set"))
            config = mail.objects.get(id=mail_id)
            if config.sender == id: config.star_sender = is_set
            if config.receiver == id: config.star_receiver = is_set
            config.save()
        if request.headers['request'] == "set_important":
            mail_id = int(request.POST.get("mail_id"))
            is_set = bool(request.POST.get("set"))
            config = mail.objects.get(id=mail_id)
            if config.sender == id: config.important_sender = is_set
            if config.receiver == id: config.important_receiver = is_set
            config.save()
        if request.headers['request'] == "seen":
            mail_id = int(request.POST.get("mail_id"))
            config = mail.objects.get(id=mail_id)
            if config.sender == id: config.see_sender = True
            if config.receiver == id: config.see_receiver = True
            config.save()
        if request.headers['request'] == "remove":
            ids = json.loads(request.POST.get("ids"))
            for mail_id in ids:
                config = mail.objects.get(id=int(mail_id))
                if config.sender == id:
                    config.remove_sender = True
                    config.see_sender = True
                if config.receiver == id:
                    config.remove_receiver = True
                    config.see_receiver = True
                config.save()
                if config.remove_sender and config.remove_receiver:
                    config.delete()
                    files = file.objects.filter(mail_id=int(mail_id))
                    for f in files:
                        remove_file(f"mail/{f.link}")
                        f.delete()
        if request.headers['request'] == "get_mails":
            mails = get_mails(id)
            return JsonResponse({"status": True, "mails": mails})
        if request.headers['request'] == "mail_read":
            ids = json.loads(request.POST.get("ids"))
            for mail_id in ids:
                config = mail.objects.get(id=int(mail_id))
                if config.sender == id: config.see_sender = True
                if config.receiver == id: config.see_receiver = True
                config.save()
        if request.headers['request'] == "mail_unread":
            ids = json.loads(request.POST.get("ids"))
            for mail_id in ids:
                config = mail.objects.get(id=int(mail_id))
                if config.sender == id: config.see_sender = False
                if config.receiver == id: config.see_receiver = False
                config.save()
        return JsonResponse({"status": True})
    return render(request, 'mail.html', data)
