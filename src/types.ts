export interface LeadFormData {
  name: string;
  phone: string;
  revenue: string;
  material: string;
  region: string;
  marketing?: string;
  employees?: string;
}

export interface MetricCard {
  value: string;
  description: string;
}

export interface ProblemCard {
  text: string;
  iconName: string;
}

export interface StepCard {
  number: string;
  title: string;
  description: string;
}

export interface Diferencial {
  title: string;
  description: string;
  iconName: string;
}
