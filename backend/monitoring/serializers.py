from rest_framework import serializers

from .models import Visit


class IncomingEventSerializer(serializers.Serializer):
    """Validates one event sent by the monitoring system.

    This is the code form of the data contract from the project documentation.
    If a field name or type changes here, the monitoring side must change too.
    """

    event_type = serializers.CharField()
    business_id = serializers.CharField()
    business_type = serializers.CharField()
    timestamp = serializers.DateTimeField()           # ISO 8601, e.g. "2026-06-17T10:30:00Z"
    subject_id = serializers.CharField()
    station_id = serializers.CharField(required=False, allow_null=True, default=None)
    is_client = serializers.BooleanField(required=False, allow_null=True, default=None)
    metadata = serializers.DictField(required=False, default=dict)


class VisitSerializer(serializers.ModelSerializer):
    """Shape of a visit as the dashboard receives it."""

    station_id = serializers.CharField(source="station.station_id", default=None)

    class Meta:
        model = Visit
        fields = [
            "id",
            "subject_id",
            "station_id",
            "service",
            "started_at",
            "ended_at",
            "duration_seconds",
        ]
