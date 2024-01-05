from django import template
from app.models import *
register = template.Library()

@register.filter()
def parse(value):
    try: return json.loads(value)
    except: ...
    return ""

@register.filter()
def slice(value, length):
    value = str(value or '').replace('\r', ' ').replace('\n', '')
    if len(value) > length: return f"{value[:length]}..."
    return value[:length]

@register.filter()
def split(value, key):
    try: return value.split(key)
    except: ...
    return ''

@register.filter()
def index(value, key):
    try: return value[key]
    except: ...
    return value

@register.filter()
def date(value):
    try: return value.split(" ")[0]
    except: ...
    return value or ''

@register.filter()
def value(value):
    return value if value else ''

@register.filter()
def get_project(value):
    try: return project.objects.get(id=value).name
    except: ...
    return ''

@register.filter()
def get_task(value):
    try: return task.objects.get(id=value).name
    except: ...
    return ''

@register.filter()
def get_user(value):
    try: return user.objects.get(id=value).name
    except: ...
    return ''

@register.filter()
def task_image(value):
    try:
        files = file.objects.filter(task_id=value, type='image')
        return files[0].link if files else 'default.png'
    except: ...
    return 'default.png'

@register.filter()
def project_tasks(value):
    try: return task.objects.filter(project_id=value).count()
    except: ...
    return 0

@register.filter()
def project_files(value):
    count = 0
    try:
        for ch in task.objects.filter(project_id=value):
            count += file.objects.filter(task_id=ch.id).count()
    except: ...
    return count

@register.filter()
def count_tasks(value):
    try: return task.objects.filter(user_id=value).count()
    except: ...
    return 0

@register.filter()
def count_files(value):
    try: return file.objects.filter(task_id=value).count()
    except: ...
    return 0

@register.filter()
def user_image(value):
    try: return user.objects.get(id=value).image
    except: ...
    return 'default.png'
