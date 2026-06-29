from django.urls import path

from . import views

# These are mounted under "api/v1/" by the project urls.py, so the full paths are:
#   POST /api/v1/events
#   GET  /api/v1/businesses/<business_id>/summary/
#   GET  /api/v1/businesses/<business_id>/visits/
urlpatterns = [
    path("events", views.ingest_event),
    path("businesses/<str:business_id>/summary/", views.business_summary),
    path("businesses/<str:business_id>/visits/", views.business_visits),
]
