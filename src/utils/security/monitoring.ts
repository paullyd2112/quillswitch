/**
 * Enhanced security monitoring functions
 */
export function detectAnomalousActivity(activities: any[]): boolean {
  if (activities.length < 5) return false;

  // Check for rapid successive actions
  const recent = activities.slice(0, 5);
  const timeDiffs = recent.slice(1).map((activity, i) => 
    new Date(recent[i].created_at).getTime() - new Date(activity.created_at).getTime()
  );

  // Flag if all actions happened within 1 second
  return timeDiffs.every(diff => diff < 1000);
}

/**
 * Security event correlation
 */
export function correlateSecurityEvents(events: any[]): {
  suspicious: boolean;
  riskScore: number;
  reasons: string[];
} {
  let riskScore = 0;
  const reasons: string[] = [];

  // Check for multiple failed authentication attempts
  const authFailures = events.filter(e => e.event_type === 'auth_failure').length;
  if (authFailures > 3) {
    riskScore += 30;
    reasons.push(`${authFailures} authentication failures`);
  }

  // Check for rapid requests from same IP
  const ipCounts = events.reduce((acc, event) => {
    acc[event.ip_address] = (acc[event.ip_address] || 0) + 1;
    return acc;
  }, {});

  const maxFromSingleIP = Math.max(...Object.values(ipCounts) as number[]);
  if (maxFromSingleIP > 50) {
    riskScore += 25;
    reasons.push('High request volume from single IP');
  }

  // Check for suspicious user agents
  const suspiciousUAs = events.filter(e => 
    e.user_agent && (e.user_agent.includes('bot') || e.user_agent.includes('scanner'))
  ).length;
  
  if (suspiciousUAs > 0) {
    riskScore += 15;
    reasons.push('Suspicious user agents detected');
  }

  return {
    suspicious: riskScore > 30,
    riskScore: Math.min(100, riskScore),
    reasons
  };
}