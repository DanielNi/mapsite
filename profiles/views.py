from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect

def profile(request):
	# try:
	profile = request.user.get_profile()
	# except:
	# 	return HttpResponseRedirect('/register/')
	return profile
