from django.shortcuts import render
from django.http import HttpResponseRedirect

def profile(request):
	profile = request.user.get_profile()
	return render(request, 'profile.html')
