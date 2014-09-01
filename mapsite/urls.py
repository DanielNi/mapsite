from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.auth import views
from django.contrib.auth.decorators import user_passes_test

admin.autodiscover()
login_forbidden = user_passes_test(lambda u: u.is_anonymous(), 'profile')

urlpatterns = patterns('',
    url(r'^home/$', login_forbidden(views.login), name="login"),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'myapp.views.index', name="homepage"),
    url(r'^home/$', 'myapp.views.index', name="home"),
    url(r'^login/$', views.login,
                        {'template_name': 'login.html'},
                           name="auth_login"),
    url(r'^logout/$', views.logout,
                        {'next_page': 'homepage'},
                        name="auth_logout"),

 #    url(r'^login/$', 'django.contrib.auth.views.login', {
 #    	'template_name': 'login.html'}, name="login"),
	# url(r'^logout/$', 'django.contrib.auth.views.logout_then_login',
 #    	name="logout"),
    url(r'^', include('registration.backends.simple.urls')),
    # url(r'^', include('registration.auth_urls')),

    url(r'^users/profile', 'registration.views.profile', name="profile"),
    url(r'^users/', 'profiles.views.profile'),

)
