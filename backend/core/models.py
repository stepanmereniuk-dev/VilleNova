from django.db import models

class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  
    class Meta:
        db_table = "users"


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) 
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = "admins"


class Event(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    image_url = models.CharField(max_length=500, null=True, blank=True)
    date_range = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    long_description = models.TextField(null=True, blank=True)
    conditions = models.TextField(null=True, blank=True)
    tags = models.JSONField(null=True, blank=True)
    location_name = models.CharField(max_length=255, null=True, blank=True)
    location_address = models.CharField(max_length=500, null=True, blank=True)
    location_postal_code = models.CharField(max_length=20, null=True, blank=True)
    location_city = models.CharField(max_length=255, null=True, blank=True)
    registration_url = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        db_table = "events"
