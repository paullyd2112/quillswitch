
export interface ComparisonFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  quillswitch: boolean | string;
  manual: boolean | string;
  consultants: boolean | string;
}

export type FeatureCategory = "experience" | "security" | "technical" | "cost";
