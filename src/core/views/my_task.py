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

def data_table(task_id):
    items = file.objects.filter(task_id=task_id).order_by('-id')
    titles = ['name', 'size', 'date']
    data = []
    for ch in items:
        data.append({
            'id': ch.id,
            'name': ch.name,
            'link': f"/static/media/task/{ch.link}",
            'type': ch.type,
            'size': ch.size,
            'date': ch.date.split(' ')[0]
        })
    return {'titles': titles, 'data': data}

@authentication
def index(request):
    data = start_data(request)
    if data['user'].super: return redirect('/')
    data['tasks'] = task.objects.filter(user_id=session(request), active=True).order_by('-id')
    return render(request, 'my_task/list.html', data)

@authentication
def add(request):
    data = start_data(request)
    if data['user'].super: return redirect('/')
    data['projects'] = project.objects.filter(active=True)
    data['list'] = [[ch.id, ch.name] for ch in data['projects']]
    data['relations'] = data_table(0)
    if request.method == "POST":
        project_id = int(request.POST.get("project"))
        name = request.POST.get("name")
        description = request.POST.get("description")
        included = request.POST.get("included")
        days = int(request.POST.get("days"))
        task(
            name=name, description=description, included=included,
            days=days, date=get_date(), project_id=project_id,
            user_id=session(request),
        ).save()
        id = task.objects.latest("id").id
        set_file(request, id)
        return JsonResponse({"status": True})
    return render(request, 'my_task/add.html', data)

@authentication
def edit(request, id):
    data = start_data(request)
    if data['user'].super: return redirect('/')
    data['task'] = task.objects.filter(id=id, active=True).first()
    if not data['task']: return redirect("/tasks")
    data['projects'] = project.objects.filter(active=True)
    files = file.objects.filter(task_id=id)
    data['files'] = [[ch.id, ch.type, f"task/{ch.link}"] for ch in files]
    data['relations'] = data_table(id)
    if request.method == "POST":
        config = task.objects.get(id=id)
        config.project_id = int(request.POST.get("project"))
        config.name = request.POST.get("name")
        config.description = request.POST.get("description")
        config.included = request.POST.get("included")
        config.days = int(request.POST.get("days"))
        config.save()
        set_file(request, id)
        return JsonResponse({"status": True})
    return render(request, 'my_task/edit.html', data)
