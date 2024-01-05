from app.models import *

def set_session(request, id):
    request.session['user'] = id
    request.session['active_user'] = True

def del_session(request):
    try: del request.session['user']
    except: ...
    try: del request.session['active_user']
    except: ...

def del_active(request):
    try: del request.session['active_user']
    except: ...

def session(request):
    id = request.session.get("user")
    if user.objects.filter(id=id, active=True).exists():
        return int(id)
    del_session(request)
    return 0

def active(request):
    return request.session.get("active_user")

def authentication(func):
    @csrf_exempt
    def wrapper(request, *args, **kwargs):
        if not session(request): return redirect('/login')
        if not active(request): return redirect('/lock-screen')
        return func(request, *args, **kwargs)
    return wrapper

def start_data(request):
    logged_user = user.objects.get(id=session(request))
    data = {'user': logged_user}
    return data

def default():
    try:
        if user.objects.filter(super=True).exists(): return
        user(
            name="Super Admin", email="super@gmail.com", password="super123",
            super=True, date=get_date(),
        ).save()
        setting(name="Website").save()
    except: ...

default()
