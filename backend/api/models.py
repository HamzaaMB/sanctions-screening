from django.db import models

RISK_CHOICES = [
    ('low', 'Low Risk'),
    ('medium', 'Medium Risk'),
    ('high', 'High Risk'),
]

class SanctionDecision(models.Model):
    entity_id = models.CharField(max_length=255)
    source = models.CharField(max_length=50)
    source_id = models.CharField(max_length=100, null=True, blank=True)
    target_type = models.CharField(max_length=50)
    matched_name = models.CharField(max_length=255)
    risk_score = models.IntegerField()
    risk_level = models.CharField(max_length=10, choices=RISK_CHOICES)
    listed_on = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.matched_name} - {self.risk_level}"
