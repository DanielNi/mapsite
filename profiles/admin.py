from django.contrib import admin
from profiles.models import UserProfile, Location, VisitType

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Location)
admin.site.register(VisitType)