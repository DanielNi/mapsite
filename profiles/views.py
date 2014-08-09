from django.shortcuts import render
from django.core import serializers
from profiles.models import Location, VisitType

def profile(request):
	profile = request.user.get_profile()
	locations = Location.objects.filter(userprofile=profile)
	ser_locations = serializers.serialize('json', locations)
	visits = profile.visittype_set.all()
	ser_visits = serializers.serialize('json', profile.visittype_set.all())
	return render(request, 'profile.html', {'profile': profile, 'locations': ser_locations, 'visits': ser_visits})
