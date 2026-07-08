"""
Run with:
    python manage.py shell < seed_test_data.py

Creates a test business "barber_005" with two stations and a handful of
visits spread across today, so the dashboard has real data to render.
"""
import random
from datetime import timedelta
from django.utils import timezone
from monitoring.models import Business, Station, Visit

business, _ = Business.objects.update_or_create(
    business_id="barber_005",
    defaults={
        "name": "Test Barbershop",
        "business_type": "barber",
        "api_key": "test-api-key-barber-005",
    },
)

station_a, _ = Station.objects.get_or_create(business=business, station_id="chair_1", defaults={"name": "Chair 1"})
station_b, _ = Station.objects.get_or_create(business=business, station_id="chair_2", defaults={"name": "Chair 2"})

now = timezone.now()
stations = [station_a, station_b]

for i in range(12):
    started = now - timedelta(hours=random.randint(0, 8), minutes=random.randint(0, 59))
    duration = random.randint(600, 2100)  # 10–35 min
    Visit.objects.create(
        business=business,
        subject_id=f"test-subject-{i}",
        station=random.choice(stations),
        service="Haircut",
        started_at=started,
        ended_at=started + timedelta(seconds=duration),
        duration_seconds=duration,
    )

# One visit still "in progress" (no ended_at) to test that state too
Visit.objects.create(
    business=business,
    subject_id="test-subject-open",
    station=station_a,
    service="Haircut",
    started_at=now - timedelta(minutes=10),
)

print(f"Done. Business: {business.business_id}, visits: {business.visits.count()}")
