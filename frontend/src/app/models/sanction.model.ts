export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Sanction {
  entity_id: string;
  source: string;
  source_id: string;
  target_type: string;
  matched_name: string;
  risk_score: number;
  risk_level: RiskLevel;
  listed_on: string;
}
