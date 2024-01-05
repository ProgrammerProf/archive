from src.core.config.main import *

def set_file(request, old_file=''):
    dir = "user"
    new_file = request.FILES.get('file_0')
    ext = request.POST.get('file_0_ext')
    if new_file:
        if old_file: remove_file(f"{dir}/{old_file}")
        return upload_file(dir=dir, file=new_file, ext=ext)
    return old_file or "default.png"

def data_table(user_id):
    items = task.objects.filter(user_id=user_id).order_by('-id')
    titles = ['name', 'date', 'status']
    data = [[ch.id, ch.name, ch.date.split(' ')[0], f"{ch.finished}"] for ch in items]
    return {'titles': titles, 'data': data}

@authentication
def index(request):
    data = start_data(request)
    if not data['user'].super: return redirect('/')
    data['users'] = user.objects.filter(role=1, super=False).order_by('-id')
    if request.method == "POST":
        ids = json.loads(request.POST.get("ids"))
        for id in ids:
            config = user.objects.filter(id=int(id)).first()
            if not config: continue
            remove_file(f"user/{config.image}")
            config.delete()
            for ch in task.objects.filter(user_id=int(id)):
                ch.user_id = 0
                ch.save()
        return JsonResponse({"status": True})
    return render(request, 'user/list.html', data)

@authentication
def add(request):
    data = start_data(request)
    if not data['user'].super: return redirect('/')
    if request.method == "POST":
        email = request.POST.get("email")
        if user.objects.filter(email=email).exists():
            return JsonResponse({"status": "email"})
        name = request.POST.get("name")
        phone = request.POST.get("phone")
        city = request.POST.get("city")
        password = request.POST.get("password")
        notes = request.POST.get("notes")
        age = float(request.POST.get("age"))
        salary = float(request.POST.get("salary"))
        mail = bool(request.POST.get("mail"))
        tasks = bool(request.POST.get("tasks"))
        active = bool(request.POST.get("active"))
        image = set_file(request)
        user(
            name=name, email=email, phone=phone, city=city, password=password,
            image=image, age=age, date=get_date(), notes=notes, salary=salary,
            ip=client(request, 'ip'), host=client(request, 'host'),
            mail=mail, tasks=tasks,  active=active,
        ).save()
        return JsonResponse({"status": True})
    return render(request, 'user/add.html', data)

@authentication
def edit(request, id):
    data = start_data(request)
    if not data['user'].super: return redirect('/')
    data['item'] = user.objects.filter(id=id, role=1, super=False).first()
    if not data['item']: return redirect("/users")
    data['tasks'] = task.objects.all()
    data['relations'] = data_table(id)
    if request.method == "POST":
        config = user.objects.get(id=id)
        email = request.POST.get("email")
        if user.objects.filter(email=email).exists() and config.email != email:
            return JsonResponse({"status": "email"})
        config.name = request.POST.get("name")
        config.email = request.POST.get("email")
        config.phone = request.POST.get("phone")
        config.city = request.POST.get("city")
        config.password = request.POST.get("password")
        config.notes = request.POST.get("notes")
        config.age = float(request.POST.get("age"))
        config.salary = float(request.POST.get("salary"))
        config.mail = bool(request.POST.get("mail"))
        config.tasks = bool(request.POST.get("tasks"))
        config.active = bool(request.POST.get("active"))
        config.image = set_file(request, config.image)
        config.save()
        tasks = json.loads(request.POST.get("relations") or "[]")
        for ch in task.objects.filter(user_id=id):
            if ch.id not in tasks:
                ch.user_id = 0
                ch.save()
        for ch in tasks:
            tsk = task.objects.filter(id=ch).first()
            if not tsk: continue
            tsk.user_id = id
            tsk.save()
        return JsonResponse({"status": True})
    return render(request, 'user/edit.html', data)
