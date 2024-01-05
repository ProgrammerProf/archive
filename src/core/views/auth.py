from src.core.config.main import *

@csrf_exempt
def login(request):
    if session(request): return redirect("/")
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        if not user.objects.filter(email=email).exists():
            return JsonResponse({"status": "email"})
        if not user.objects.filter(email=email, password=password).exists():
            return JsonResponse({"status": "password"})
        if not user.objects.filter(email=email, password=password, active=True).exists():
            return JsonResponse({"status": "active"})
        id = user.objects.get(email=email, password=password).id
        set_session(request, id)
        return JsonResponse({"status": True})
    return render(request, 'login.html', {})

@csrf_exempt
def lockscreen(request):
    if not session(request): return redirect("/login")
    if active(request): return redirect("/")
    id = session(request)
    data = {"user": user.objects.get(id=id)}
    if request.method == "POST":
        password = request.POST.get("password")
        if not user.objects.filter(id=id, password=password).exists():
            return JsonResponse({"status": "password"})
        set_session(request, id)
        return JsonResponse({"status": True})
    return render(request, 'lock.html', data)

@csrf_exempt
def logout(request):
    if request.method == "POST":
        del_session(request)
        return JsonResponse({"status": True})
    return redirect("/")

@csrf_exempt
def lockout(request):
    if request.method == "POST":
        del_active(request)
        return JsonResponse({"status": True})
    return redirect("/")
