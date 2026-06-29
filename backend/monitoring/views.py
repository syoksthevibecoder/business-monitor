from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg, Count

from .models import Business, Station, Event, Visit
from .serializers import IncomingEventSerializer, VisitSerializer


# Event types that open and close a Visit, across all business types.
STARTED_TYPES = {"service_started", "bay_occupied", "spot_occupied"}
ENDED_TYPES = {"service_ended", "wash_ended", "spot_vacated"}


def _authenticate(request):
    """Return the Business matching the X-API-Key header, or None."""
    api_key = request.headers.get("X-API-Key")
    if not api_key:
        return None
    return Business.objects.filter(api_key=api_key).first()


@api_view(["POST"])
def ingest_event(request):
    """POST /api/v1/events — the single endpoint the monitoring system calls."""
    business = _authenticate(request)
    if business is None:
        return Response(
            {"detail": "Invalid or missing API key."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    serializer = IncomingEventSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    # Resolve the station, creating it the first time we ever see it.
    station = None
    if data["station_id"]:
        station, _ = Station.objects.get_or_create(
            business=business, station_id=data["station_id"]
        )

    # 1. Always record the raw event (append-only log).
    event = Event.objects.create(
        business=business,
        event_type=data["event_type"],
        timestamp=data["timestamp"],
        subject_id=data["subject_id"],
        station=station,
        is_client=data["is_client"],
        metadata=data["metadata"],
    )

    # 2. Maintain the derived Visit record for start/end events.
    _update_visit(business, station, data)

    return Response(
        {"status": "accepted", "event_id": event.id},
        status=status.HTTP_201_CREATED,
    )


def _update_visit(business, station, data):
    """Open a Visit on a start event; close it (with duration) on an end event."""
    event_type = data["event_type"]

    if event_type in STARTED_TYPES:
        Visit.objects.create(
            business=business,
            subject_id=data["subject_id"],
            station=station,
            service=data["metadata"].get("service", ""),
            started_at=data["timestamp"],
        )

    elif event_type in ENDED_TYPES:
        visit = (
            Visit.objects.filter(
                business=business,
                subject_id=data["subject_id"],
                ended_at__isnull=True,
            )
            .order_by("-started_at")
            .first()
        )
        if visit:
            visit.ended_at = data["timestamp"]
            duration = data["metadata"].get("duration_seconds")
            if duration is None:  # fall back to computing it ourselves
                duration = int((visit.ended_at - visit.started_at).total_seconds())
            visit.duration_seconds = duration
            visit.save()


@api_view(["GET"])
def business_summary(request, business_id):
    """GET /api/v1/businesses/<business_id>/summary/ — headline numbers for the dashboard."""
    business = Business.objects.filter(business_id=business_id).first()
    if business is None:
        return Response({"detail": "Business not found."}, status=status.HTTP_404_NOT_FOUND)

    visits = Visit.objects.filter(business=business)
    completed = visits.filter(duration_seconds__isnull=False)

    summary = {
        "business_id": business.business_id,
        "business_type": business.business_type,
        "total_visits": visits.count(),
        "completed_visits": completed.count(),
        "in_progress": visits.filter(ended_at__isnull=True).count(),
        "avg_duration_seconds": completed.aggregate(v=Avg("duration_seconds"))["v"],
        "busiest_station": (
            completed.values("station__station_id")
            .annotate(n=Count("id"))
            .order_by("-n")
            .first()
        ),
    }
    return Response(summary)


@api_view(["GET"])
def business_visits(request, business_id):
    """GET /api/v1/businesses/<business_id>/visits/ — recent visits for tables and graphs."""
    business = Business.objects.filter(business_id=business_id).first()
    if business is None:
        return Response({"detail": "Business not found."}, status=status.HTTP_404_NOT_FOUND)

    visits = Visit.objects.filter(business=business).order_by("-started_at")[:200]
    return Response(VisitSerializer(visits, many=True).data)
