from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.db import models
from django.db.models import Q
from secrets import token_hex
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from project.settings import BASE_DIR
from datetime import datetime
import socket, random, os, json, datetime as dt
import shutil, base64, mimetypes, calendar, threading

def client(request, query=""):
    PRIVATE_IPS_PREFIX = ('10.', '172.', '192.',)
    remote_address = request.META.get('REMOTE_ADDR')
    ip = remote_address
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        proxies = x_forwarded_for.split(',')
        while (len(proxies) > 0 and proxies[0].startswith(PRIVATE_IPS_PREFIX)): proxies.pop(0)
        if len(proxies) > 0: ip = proxies[0]
    if query == "ip": return ip
    if query == "host": return socket.gethostname()
    return ''

def bool(word):
    agree = ["true", "t", "y", "yes", "1", "done", "always", "yep", "ya", "on"]
    if str(word).lower() in agree: return True
    return False

def random_string(length=1):
    string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"
    randome_id = ""
    for ch in range(length):
        char = random.choice([ch for ch in string])
        while char in randome_id: char = random.choice([ch for ch in string])
        randome_id += char
    return randome_id

def list_dir(path):
    try: os.mkdir(path)
    except: ...
    if os.path.exists(path):
        return os.listdir(path)
    return []

def write(path, file):
    try:
        data = file.read()
        File = open(path, "wb+")
        File.write(data)
        File.close()
    except: return False
    return True

def mk_dir(dir, date=False):
    if date: dir += f"/{get_date('year')}/{get_date('month')}/{get_date('day')}"
    dirs = dir.replace("\\", "/").replace("//", "/").split("/")
    dir = ""
    for ch in range(len(dirs)):
        if not dirs[ch]: continue
        dir += dirs[ch] if ch == 0 else f"/{dirs[ch]}"
        if not os.path.exists(dir):
            try: os.mkdir(dir)
            except: ...
    return dir

def image_ext(ext):
    list_ = [
        "png", "jpg", "jpeg", "gif", "svg", "apng",
        "avif", "jfif", "pjpeg", "pjp", "webp", "bmp", "eps"
    ]
    return ext if ext in list_ else "png"

def new_file(dir):
    List = [int(ch.split(".")[0]) for ch in list_dir(dir) if str(ch.split(".")[0]).isdigit()]
    if not List: return 1
    return max(List) + 1

def upload_file(**keys):
    file = keys.get("file")
    if not file: return
    dir = f"{BASE_DIR}/src/static/media/{keys.get('dir')}"
    dir = mk_dir(dir, True)
    path = f"{dir}/{new_file(dir)}.{keys.get('ext') or 'png'}"
    write(path, file)
    file = path.split(f"{keys.get('dir')}/")[-1]
    return file

def remove_file(file, rm_dir=False):
    if "default" in file: return False
    file = f"{BASE_DIR}/src/static/media/{file}"
    try: os.remove(file)
    except: ...
    try:
        if rm_dir: shutil.rmtree(file)
        else:
            for ch in os.listdir(file):
                try: os.remove(f"{file}/{ch}")
                except: ...
                try: shutil.rmtree(f"{file}/{ch}")
                except: ...
    except: ...
    return True

def get_date(query="", sep="-"):
    query = query.lower()
    Months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"]
    Days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    if query == "year": return datetime.now().year
    if query == "month": return datetime.now().month
    if query == "day": return datetime.now().day
    if query == "hour": return datetime.now().hour
    if query == "minute": return datetime.now().minute
    if query == "second": return datetime.now().second
    if query == "p": return datetime.now().strftime("%p")
    if query == "week_day": return datetime.today().weekday()
    if query == "day_name": return Days[datetime.today().weekday()]
    if query == "month_name": return Months[datetime.now().month - 1]
    if query == "day_list": return Days
    if query == "days_number": return [0, 1, 2, 3, 4, 5, 6]
    if query == "day_number": return datetime.now().weekday()
    if query == "month_list": return Months
    if query == "month_days": return calendar.monthrange(datetime.now().year, datetime.now().month)[1]
    if query == "date": return datetime.now().strftime(f"%Y{sep}%m{sep}%d")
    if query == "time": return datetime.now().strftime(f"%H:%M:%S")
    return datetime.now().strftime(f"%Y{sep}%m{sep}%d %H:%M:%S")

def day_number(day):
    days = [sw.lower() for sw in get_date("day_list")]
    number = -1
    for index, ch in enumerate(days):
        if ch.find(day[:3].lower()) != -1: number = index
    return number

def fix_date(date="", sep="-"):
    if not date: return get_date()
    date_time, time = date.split(" "), ""
    if len(date_time) > 1: date, time = date_time[0], date_time[1]
    if not date: date = datetime.now().strftime(f"%Y{sep}%m{sep}%d")
    date = date.split(sep)
    if len(date) == 1: date = datetime.now().strftime(f"{date[0]}{sep}%m{sep}%d")
    elif len(date) == 2: date = datetime.now().strftime(f"{date[0]}{sep}{date[1]}{sep}%d")
    else: date = sep.join(date)
    if not time: time = datetime.now().strftime(f"%H:%M:%S")
    time = time.split(":")
    if len(time) == 1: time = datetime.now().strftime(f"{time[0]}:%M:%S")
    elif len(time) == 2: time = datetime.now().strftime(f"{time[0]}:{time[1]}:%S")
    else: time = ":".join(time)
    return f"{date} {time}"

def diff_date(start="", end="", sep="-"):
    start = fix_date(start, sep)
    end = fix_date(end, sep)
    start = datetime.now().strptime(start, f"%Y{sep}%m{sep}%d %H:%M:%S")
    end = datetime.now().strptime(end, f"%Y{sep}%m{sep}%d %H:%M:%S")
    days = (end - start).days
    seconds = (end - start).seconds
    diff = days * 24 * 60 * 60 + seconds
    return diff

def add_more_date(date="", seconds=0):
    if not seconds: return date
    date = str(date)
    if not date: date = get_date()
    if len(date.split(" ")) < 2: date = f"{get_date('date')} {date}"
    start_date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
    start_date += dt.timedelta(seconds=seconds)
    return str(start_date)

def encode(text):
    r_str1, r_str2 = "", ""
    for ch in range(10): r_str1 += str(random.randint(0, 9))
    for ch in range(10): r_str2 += str(random.randint(0, 9))
    text = f"BIOHERB{r_str1}{text}{r_str2}ACCESSTOKEN".encode()
    return base64.b64encode(text).decode()

def decode(text):
    text = base64.b64decode(text.encode()).decode()
    text = text.replace("BIOHERB", "").replace("ACCESSTOKEN", "")
    return int(text[10:len(text)-20+10])

def remove_chars(text, *chars):
    text = str(text)
    for ch in chars:
        text = text.replace(ch, "")
    return text

def allow_edit(file):
    os.chmod(file, 0o777)
    return True

def not_allow_edit(file):
    os.chmod(file, 0o444)
    return True

def file_info(file, query=""):
    if not os.path.exists(file): return False
    if not os.path.isfile(file): return False
    query = query.lower().strip()
    size = os.path.getsize(file)
    edit_date = os.path.getmtime(file)
    edit_date = str(datetime.fromtimestamp(edit_date)).split(".")[0]
    if query == "size": return size
    if query == "edit_date": return edit_date
    if query == "dir": return os.path.dirname(file)
    if query == "type":
        if mimetypes.guess_type(file)[0]:
            return mimetypes.guess_type(file)[0].split("/")[0]
        else: return None
    return False

def fix_phone(phone):
    value = phone.replace("+", "").replace("⁦", "")
    if not value: return ""
    data = f"+{value[:3]} {value[3:5]}-{value[5:8]}-{value[8:12]}"
    if value[:2] == "20":
        if value[2] == "0": value = value.replace("200", "20")
        data = f"+{value[:2]} {value[2:5]} {value[5:8]} {value[8:12]}"
    return data

def big_number(number):
    number = list(reversed([ch for ch in str(number)]))
    new_number = ""
    for ch in range(len(number)):
        if ch % 3 == 0 and ch != 0:
            new_number += ","
        new_number += number[ch]
    new_number = "".join(reversed([ch for ch in new_number]))
    return new_number

def integer(number):
    try: return int(number)
    except: ...
    return 0

def parse(data):
    try: return json.loads(data)
    except: ...
    return ''
