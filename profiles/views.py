from django.shortcuts import render
from django.core import serializers
from profiles.models import Location, VisitType
from django.http import HttpResponse
import json

def profile(request):
	profile = request.user.get_profile()

	if request.is_ajax():
		location = request.POST['location']
		lived = (request.POST['lived'] == 'true')
		date_visited = request.POST['date_visited']
		update_type = request.POST['update_type']
		loc, loc_created = Location.objects.get_or_create(name=location)

		if update_type == 'change':
			rows = VisitType.objects.filter(user_profile=profile, location=loc).update(lived=lived)
			success = rows > 0
		elif update_type == 'date' and date_visited:
			rows = VisitType.objects.filter(user_profile=profile, location=loc).update(date_visited=date_visited)
			success = rows > 0
		elif update_type == 'new':
			new_vis = VisitType.objects.create(user_profile=profile, location=loc, lived=lived)
			success = True
		elif update_type == 'cancel':
			rows = VisitType.objects.get(user_profile=profile, location=loc).delete()
			success = True

		response = {'success': success, 'message': 'Something went wrong when updating.'}
		return HttpResponse(json.dumps(response), content_type="application/json")

	else:
		locations = Location.objects.filter(userprofile=profile)
		ser_locations = serializers.serialize('json', locations)
		visits = profile.visittype_set.all()
		ser_visits = serializers.serialize('json', profile.visittype_set.all())
		return render(request, 'profile.html', {'profile': profile, 'locations': ser_locations, 'visits': ser_visits})
	