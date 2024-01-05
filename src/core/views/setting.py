from src.core.config.main import *

@authentication
def index(request):
    data = start_data(request)
    if not data['user'].super: return redirect('/')
    data['setting'] = setting.objects.get(id=1)
    if request.method == "POST":
        if request.headers['request'] == "save_data":
            config = setting.objects.get(id=1)
            config.name = request.POST.get("name") or ""
            config.phone = request.POST.get("phone") or ""
            config.email = request.POST.get("email") or ""
            config.city = request.POST.get("city") or ""
            config.url = request.POST.get("url") or ""
            config.language = request.POST.get("language") or "en"
            config.facebook = request.POST.get("facebook") or ""
            config.whatsapp = request.POST.get("whatsapp") or ""
            config.youtube = request.POST.get("youtube") or ""
            config.instagram = request.POST.get("instagram") or ""
            config.telegram = request.POST.get("telegram") or ""
            config.twetter = request.POST.get("twetter") or ""
            config.linkedin = request.POST.get("linkedin") or ""
            config.save()
        if request.headers['request'] == "save_options":
            config = setting.objects.get(id=1)
            config.theme = request.POST.get("theme")
            config.enable_registerations = bool(request.POST.get("enable_registerations"))
            config.enable_bookings = bool(request.POST.get("enable_bookings"))
            config.enable_notifications = bool(request.POST.get("enable_notifications"))
            config.deactive = bool(request.POST.get("deactive"))
            config.save()
        if request.headers['request'] == "deletes":
            btn = request.POST.get("btn")
            if btn == "lecturers":
                user.objects.filter(role=1).exclude(super=True).delete()
            if btn == "mails":
                mail.objects.all().delete()
                file.objects.all().exclude(mail_id=0).delete()
                remove_file("mail")
            if btn == "categories":
                config = category.objects.all()
                for ch in config:
                    remove_file(f"category/{config.image}")
                    ch.delete()
            if btn == "courses":
                course.objects.all().delete()
                files = file.objects.all().exclude(course_id=0)
                for ch in files:
                    remove_file(f"course/{ch.link}")
                    ch.delete()
        return JsonResponse({"status": True})
    return render(request, 'setting.html', data)
