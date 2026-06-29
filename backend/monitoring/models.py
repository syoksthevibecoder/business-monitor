from django.db import models


class Business(models.Model):
    """One monitored business. The monitoring system authenticates with `api_key`."""

    BUSINESS_TYPES = [
        ("barber", "Barbershop"),
        ("salon", "Salon"),
        ("carwash", "Car wash"),
        ("parking", "Parking"),
    ]

    business_id = models.CharField(max_length=64, unique=True)   # external id, e.g. "barber_001"
    name = models.CharField(max_length=200)
    business_type = models.CharField(max_length=20, choices=BUSINESS_TYPES)
    api_key = models.CharField(max_length=64, unique=True)        # monitoring system sends this in a header
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.business_type})"


class Station(models.Model):
    """A chair / bay / spot / room. Created automatically the first time it is seen."""

    business = models.ForeignKey(Business, related_name="stations", on_delete=models.CASCADE)
    station_id = models.CharField(max_length=64)                 # external id, e.g. "chair_3"
    name = models.CharField(max_length=200, blank=True)

    class Meta:
        unique_together = ("business", "station_id")

    def __str__(self):
        return f"{self.station_id} @ {self.business.business_id}"


class Event(models.Model):
    """Append-only log of every event received from the monitoring system.

    Nothing here is ever overwritten. This is the raw source of truth; the Visit
    table is derived from it, so dashboard logic can change without losing data.
    """

    business = models.ForeignKey(Business, related_name="events", on_delete=models.CASCADE)
    event_type = models.CharField(max_length=40)
    timestamp = models.DateTimeField()                           # when it happened (from the monitor)
    subject_id = models.CharField(max_length=64)                 # ephemeral session id for one visit
    station = models.ForeignKey(Station, null=True, blank=True, on_delete=models.SET_NULL)
    is_client = models.BooleanField(null=True)
    metadata = models.JSONField(default=dict, blank=True)
    received_at = models.DateTimeField(auto_now_add=True)        # when our server got it

    class Meta:
        indexes = [
            models.Index(fields=["business", "timestamp"]),
            models.Index(fields=["subject_id"]),
        ]

    def __str__(self):
        return f"{self.event_type} {self.subject_id} @ {self.timestamp:%Y-%m-%d %H:%M}"


class Visit(models.Model):
    """A derived record of one service session: a start matched to its end.

    Populated by the ingest endpoint when it sees start/end events. This is what
    the dashboard graphs read from (counts, durations, busiest station).
    """

    business = models.ForeignKey(Business, related_name="visits", on_delete=models.CASCADE)
    subject_id = models.CharField(max_length=64)
    station = models.ForeignKey(Station, null=True, blank=True, on_delete=models.SET_NULL)
    service = models.CharField(max_length=80, blank=True)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)

    class Meta:
        indexes = [models.Index(fields=["business", "started_at"])]

    @property
    def is_open(self):
        return self.ended_at is None

    def __str__(self):
        state = "open" if self.is_open else f"{self.duration_seconds}s"
        return f"Visit {self.subject_id} ({state})"
