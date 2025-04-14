import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from .utils import get_best_match, get_risk_level
from .serializers import SanctionDecisionSerializer
from rest_framework.pagination import PageNumberPagination
from .models import SanctionDecision
import logging

logger = logging.getLogger(__name__)

class SanctionsPagination(PageNumberPagination):
    """
    Custom pagination class to manage result set size.
    Supports configurable page size via query parameter and 
    enforces a maximum limit to maintain performance.
    """
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data, total_count=None):
        """
        Returns a standardized paginated response.
        """
        return Response({
            'count': total_count or len(data),
            'next': None,
            'previous': None,
            'results': data
        })
    
class SanctionSearchAPIView(APIView):
    """
    API endpoint to search for sanctions based on an entity name.
    - Calls an external sanctions API
    - Computes match score and risk level
    - Returns paginated results
    - Handles timeouts and logs external API failures
    """
    def get(self, request):
        query = request.query_params.get('name')
        if not query:
            return Response({"error": "Query param 'name' is required"}, status=400)

        try:
            response = requests.get(
                "https://api.sanctions.network/rpc/search_sanctions",
                params={"name": query}
            )
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            logger.error(f"Sanctions API call failed: {str(e)}")
            return Response({"error": "Failed to fetch sanctions data"}, status=500)

        results = []
        for entity in data:
            names = entity.get("names", [])
            score, matched_name = get_best_match(query, names)
            risk_level = get_risk_level(score)

            results.append({
                "entity_id": entity["id"],
                "source": entity.get("source"),
                "source_id": entity.get("source_id"),
                "target_type": entity.get("target_type"),
                "names": names,
                "matched_name": matched_name,
                "risk_score": score,
                "risk_level": risk_level,
                "remarks": entity.get("remarks"),
                "listed_on": entity.get("listed_on"),
                "created_at": entity.get("created_at"),
            })
        paginator = SanctionsPagination()
        page_size = paginator.get_page_size(request)
        page_number = int(request.query_params.get(paginator.page_query_param, 1))
        offset = (page_number - 1) * page_size
        paginated_results = results[offset:offset + page_size]

        return paginator.get_paginated_response(paginated_results, total_count=len(results))

class SaveDecisionAPIView(APIView):
    """
    API endpoint to persist a user's sanction decision.
    - Accepts POST data
    - Validates and saves using a serializer
    - Logs successful decisions
    """
    def post(self, request):
        serializer = SanctionDecisionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Saved sanction decision for entity_id={serializer.validated_data.get('entity_id')}")
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
