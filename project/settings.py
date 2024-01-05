from pathlib import Path
import os, pymysql

DEBUG = True
ALLOWED_HOSTS = ['archive.pythonanywhere.com']
CORS_ALLOWED_ORIGINS = []
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
DATA_UPLOAD_MAX_NUMBER_FILES = None
SESSION_COOKIE_AGE = 630720000
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
BASE_DIR = Path(__file__).resolve().parent.parent
WSGI_APPLICATION = 'project.wsgi.application'
ROOT_URLCONF = 'project.urls'
SECRET_KEY = 'at6=j20mo=ea(ji84p+9ojk!5hy52$ysin)yo7uhedpgt@1q!r'
pymysql.install_as_MySQLdb()

INSTALLED_APPS = [
    'app.apps.AppConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [os.path.join(BASE_DIR, "src/templates")],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.debug',
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
        ],
    },
}]
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': 'archive.mysql.pythonanywhere-services.com',
        'NAME': 'archive$default',
        'USER': 'archive',
        'PASSWORD': 'coderprof',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'abdulrahmanyasser12345677@gmail.com'
EMAIL_HOST_PASSWORD = 'wncethefcvwzkqnp'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

STATIC_URL = '/static/'
MEDIA_URL = '/image/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, "src/static")]
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_ROOT = os.path.join(BASE_DIR, "src/static/image")
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'