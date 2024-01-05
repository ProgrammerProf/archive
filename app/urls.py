from django.urls import path
from src.core.views import home, mail, auth, profile, setting
from src.core.views import project, task, my_project, my_task, user

urlpatterns = [
    path('', home.index),
    path('mail', mail.index),
    path('login', auth.login),
    path('lock-screen', auth.lockscreen),
    path('logout', auth.logout),
    path('lockout', auth.lockout),
    path('profile', profile.index),
    path('settings', setting.index),
    path('projects', project.index),
    path('add-project', project.add),
    path('edit-project/<id>', project.edit),
    path('users', user.index),
    path('add-user', user.add),
    path('edit-user/<id>', user.edit),
    path('tasks', task.index),
    path('add-task', task.add),
    path('edit-task/<id>', task.edit),
    path('my-tasks', my_task.index),
    path('add-single-task', my_task.add),
    path('edit-single-task/<id>', my_task.edit),
    path('my-projects', my_project.index),
]
