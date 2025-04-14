from django.urls import path
from .views import SanctionSearchAPIView, SaveDecisionAPIView

urlpatterns = [
    path('search/', SanctionSearchAPIView.as_view(), name='search-sanctions'),
    path('save-decision/', SaveDecisionAPIView.as_view(), name='save-decision'),
]
