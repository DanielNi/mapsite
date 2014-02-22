from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'mapsite.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'myapp.views.index', name="homepage"),
    url(r'^home/$', 'myapp.views.index', name="home"),

 #    url(r'^login/$', 'django.contrib.auth.views.login', {
 #    	'template_name': 'login.html'}, name="login"),
	# url(r'^logout/$', 'django.contrib.auth.views.logout_then_login',
 #    	name="logout"),

    url(r'^', include('registration.backends.simple.urls')),
    url(r'^', include('registration.auth_urls')),

    url(r'^users/profile', 'registration.views.profile'),
)
