from rest_framework import serializers
from .models import SanctionDecision

class SanctionDecisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SanctionDecision
        fields = [
            'entity_id', 'source', 'source_id', 'target_type', 'matched_name',
            'risk_score', 'risk_level', 'listed_on', 'created_at'
        ]