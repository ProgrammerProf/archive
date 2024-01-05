from src.core.config.main import *

def set_file(request, old_file=''):
    dir = "user"
    new_file = request.FILES.get('file_0')
    ext = request.POST.get('file_0_ext')
    if new_file:
        if old_file: remove_file(f"{dir}/{old_file}")
        return upload_file(dir=dir, file=new_file, ext=ext)
    return old_file or "default.png"

@authentication
def index(request):
    data = start_data(request)
    id = session(request)
    if request.method == "POST":
        config = user.objects.get(id=id)
        config.name = request.POST.get("name")
        config.email = request.POST.get("email")
        config.phone = request.POST.get("phone")
        config.password = request.POST.get("password")
        config.city = request.POST.get("city")
        config.age = float(request.POST.get("age"))
        if config.super: config.salary = float(request.POST.get("salary"))
        config.image = set_file(request, config.image)
        config.save()
        return JsonResponse({"status": True})
    return render(request, 'profile.html', data)
