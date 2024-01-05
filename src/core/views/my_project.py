from src.core.config.main import *

@authentication
def index(request):
    data = start_data(request)
    if data['user'].super: return redirect('/')
    data['projects'] = project.objects.filter(active=True).order_by('-id')
    return render(request, 'projects.html', data)
