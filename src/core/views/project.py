from src.core.config.main import *

def set_file(request, id):
    dir = "task"
    file_num = request.POST.get("file_num") or 0
    deleted_files = request.POST.get("deleted_files") or "[]"
    for ch in range(int(file_num)):
        type = request.POST.get(f"file_{ch}_type")
        if type == "iframe":
            file_ = request.POST.get(f"file_{ch}")
            file(task_id=id, type="iframe", link=file_, date=get_date()).save()
            continue
        file_ = request.FILES.get(f"file_{ch}")
        ext = request.POST.get(f"file_{ch}_ext")
        name = request.POST.get(f"file_{ch}_name")
        size = request.POST.get(f"file_{ch}_size")
        link = upload_file(dir=dir, file=file_, ext=ext)
        file(task_id=id, name=name, type=type, size=size, link=link, date=get_date()).save()
    for ch in json.loads(deleted_files):
        if file.objects.filter(id=ch).exists():
            config = file.objects.get(id=ch)
            remove_file(f"{dir}/{config.link}")
            config.delete()

def tasks(project_id):
    items = task.objects.filter(project_id=project_id).order_by('-id')
    data = []
    for ch in items:
        data.append({
            'id': ch.id, 'name': ch.name, 'user_id': ch.user_id,
            'status': ch.finished, 'date': ch.date.split(' ')[0]
        })
    return data

def files(project_id):
    items = task.objects.filter(project_id=project_id).order_by('-id')
    data = []
    for ch in items:
        for f in file.objects.filter(task_id=ch.id).order_by('-id'):
            data.append({
                'id': f.id, 'name': f.name, 'size': f.size, 'link': f.link,
                'type': f.type, 'date': f.date.split(' ')[0]
            })
    return data

@authentication
def index(request):
    data = start_data(request)
    if not data['user'].super: return redirect('/')
    data['projects'] = project.objects.all().order_by('-id')
    if request.method == "POST":
        ids = json.loads(request.POST.get("ids"))
        for id in ids:
            project.objects.filter(id=int(id)).delete()
            for ch in task.objects.filter(project_id=int(id)):
                ch.project_id = 0
                ch.save()
        return JsonResponse({"status": True})
    return render(request, 'project/list.html', data)

@authentication
def add(request):
    data = start_data(request)
    if not data['user'].super: return redirect('/')
    if request.method == "POST":
        name = request.POST.get("name")
        description = request.POST.get("description")
        days = int(request.POST.get("days"))
        active = bool(request.POST.get("active"))
        finished = bool(request.POST.get("finished"))
        project(
            name=name, description=description, date=get_date(),
            finished=finished, active=active, days=days
        ).save()
        return JsonResponse({"status": True})
    return render(request, 'project/add.html', data)

@authentication
def edit(request, id):
    data = start_data(request)
    if not data['user'].super: return redirect('/')
    data['project'] = project.objects.filter(id=id).first()
    if not data['project']: return redirect("/projects")
    data['tasks'] = tasks(id)
    data['files'] = files(id)
    if request.method == "POST":
        config = project.objects.get(id=id)
        config.name = request.POST.get("name")
        config.description = request.POST.get("description")
        config.days = int(request.POST.get("days"))
        config.finished = bool(request.POST.get("finished"))
        config.active = bool(request.POST.get("active"))
        config.save()
        deleted_tasks = request.POST.get('del_tasks') or '[]'
        deleted_files = request.POST.get('del_files') or '[]'
        for ch in json.loads(deleted_tasks):
            task.objects.filter(id=int(ch)).delete()
            for f in file.objects.filter(task_id=int(id)):
                remove_file(f'task/{f.link}')
                f.delete()
        for ch in json.loads(deleted_files):
            f = file.objects.filter(id=int(ch)).first()
            if not f: continue
            remove_file(f'task/{f.link}')
            f.delete()
        return JsonResponse({"status": True})
    return render(request, 'project/edit.html', data)
