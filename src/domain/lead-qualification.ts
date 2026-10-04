type QualificationInput = {
  employees: number;
  annualRevenue: number;
  estimatedBudget: number;
  need: string;
};

export function calculateLeadQualification({
  employees,
  annualRevenue,
  estimatedBudget,
  need,
}: QualificationInput) {
  let score = 0;
  const reasons: string[] = [];

  if (employees >= 100) {
    score += 25;
    reasons.push('Company has at least 100 employees');
  }

  if (annualRevenue >= 10_000_000) {
    score += 25;
    reasons.push('Company has at least $10M annual revenue');
  }

  if (estimatedBudget >= 10_000) {
    score += 25;
    reasons.push('Estimated automation budget is at least $10k');
  }

  if (need.toLowerCase().includes('automat')) {
    score += 25;
    reasons.push('Lead has an explicit automation need');
  }

  return {
    score,
    priority:
      score >= 75
        ? ('high' as const)
        : score >= 50
          ? ('medium' as const)
          : ('low' as const),
    qualified: score >= 50,
    reasons,
  };
}
