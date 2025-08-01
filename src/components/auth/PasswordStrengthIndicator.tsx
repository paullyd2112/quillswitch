import React, { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters long',
    test: (password) => password.length >= 8
  },
  {
    label: 'Contains uppercase letter (A-Z)',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    label: 'Contains lowercase letter (a-z)',
    test: (password) => /[a-z]/.test(password)
  },
  {
    label: 'Contains number (0-9)',
    test: (password) => /[0-9]/.test(password)
  },
  {
    label: 'Contains special character (!@#$%^&*(),.?":{}|<>)',
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
];

export function PasswordStrengthIndicator({ 
  password, 
  className 
}: PasswordStrengthIndicatorProps) {
  const { score, passedRequirements } = useMemo(() => {
    const passed = requirements.map(req => req.test(password));
    return {
      score: passed.filter(Boolean).length,
      passedRequirements: passed
    };
  }, [password]);

  const getStrengthLevel = () => {
    if (score <= 2) return { level: 'Weak', color: 'text-destructive' };
    if (score <= 3) return { level: 'Fair', color: 'text-yellow-600' };
    if (score <= 4) return { level: 'Good', color: 'text-blue-600' };
    return { level: 'Strong', color: 'text-green-600' };
  };

  const strengthInfo = getStrengthLevel();
  const isComplete = score === requirements.length;

  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Strength bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-300",
              score <= 2 && "bg-destructive",
              score === 3 && "bg-yellow-500",
              score === 4 && "bg-blue-500",
              score === 5 && "bg-green-500"
            )}
            style={{ width: `${(score / requirements.length) * 100}%` }}
          />
        </div>
        <span className={cn("text-sm font-medium", strengthInfo.color)}>
          {strengthInfo.level}
        </span>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        {requirements.map((requirement, index) => (
          <div 
            key={index}
            className="flex items-center space-x-2 text-sm"
          >
            {passedRequirements[index] ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={cn(
              passedRequirements[index] 
                ? "text-green-600" 
                : "text-muted-foreground"
            )}>
              {requirement.label}
            </span>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="flex items-center space-x-2 text-green-600 text-sm font-medium">
          <Check className="h-4 w-4" />
          <span>Password meets all security requirements!</span>
        </div>
      )}
    </div>
  );
}