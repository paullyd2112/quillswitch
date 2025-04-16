
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Alert, 
  AlertDescription 
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";

interface FormStatusAlertProps {
  status: "idle" | "success" | "error";
  errorMessage: string;
}

export const FormStatusAlert: React.FC<FormStatusAlertProps> = ({ status, errorMessage }) => {
  if (status === "idle") return null;
  
  if (status === "success") {
    return (
      <Alert className="mb-4 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <AlertDescription>
          Account created successfully! Check your email for confirmation.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (status === "error") {
    return (
      <Alert className="mb-4 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400">
        <AlertDescription>
          {errorMessage || "Error creating account. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

interface NameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NameInput: React.FC<NameInputProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="full-name">Full Name</Label>
    <Input 
      id="full-name" 
      type="text" 
      placeholder="John Doe" 
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmailInput: React.FC<EmailInputProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="signup-email">Email</Label>
    <Input 
      id="signup-email" 
      type="email" 
      placeholder="example@email.com" 
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="signup-password">Password</Label>
    <Input 
      id="signup-password" 
      type="password" 
      placeholder="••••••••" 
      value={value}
      onChange={onChange}
      required
    />
    <p className="text-xs text-muted-foreground">
      Password must be at least 6 characters long
    </p>
  </div>
);

interface TermsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onCheckedChange }) => (
  <div className="flex items-center space-x-2 pt-2">
    <Checkbox 
      id="terms" 
      checked={checked}
      onCheckedChange={(checked) => onCheckedChange(checked === true)}
    />
    <Label htmlFor="terms" className="text-sm">
      I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
    </Label>
  </div>
);

interface SocialSignInProps {
  onClick: () => void;
  isLoading: boolean;
}

export const GoogleSignInButton: React.FC<SocialSignInProps> = ({ onClick, isLoading }) => (
  <Button
    variant="outline"
    type="button"
    onClick={onClick}
    disabled={isLoading}
    className="w-full"
  >
    <Mail className="h-4 w-4 mr-2" />
    Sign up with Google
  </Button>
);

interface ActionButtonProps {
  isLoading: boolean;
}

export const SubmitButton: React.FC<ActionButtonProps> = ({ isLoading }) => (
  <Button type="submit" className="w-full" disabled={isLoading}>
    {isLoading ? "Creating account..." : "Create Account"}
  </Button>
);
