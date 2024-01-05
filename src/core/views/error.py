from src.core.config.main import *

@authentication
def index(request, *_):
    data = start_data(request)
    return render(request, 'error.html', data)
