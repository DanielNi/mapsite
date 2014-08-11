from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User

class Location(models.Model):
	name = models.CharField(max_length=50)

	def __unicode__(self):
		return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User)
    locations = models.ManyToManyField(Location, through='VisitType')

    def __unicode__(self):
        return self.user.username

class VisitType(models.Model):
	user_profile = models.ForeignKey(UserProfile)
	location = models.ForeignKey(Location)
	date_visited = models.DateField(auto_now=True)
	lived = models.BooleanField(default=False)

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

post_save.connect(create_user_profile, sender=User)
