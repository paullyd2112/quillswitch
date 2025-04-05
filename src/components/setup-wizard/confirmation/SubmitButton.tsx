
import React from "react";
import { Check, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  handleSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, handleSubmit }) => {
  return (
    <div className="mt-8 text-center">
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="px-6 py-3 rounded-md bg-brand-600 text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center gap-2 mx-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Creating Migration Project...
          </>
        ) : (
          <>
            <Check size={16} />
            Create Migration Project
          </>
        )}
      </button>
      
      <p className="text-sm text-muted-foreground mt-4">
        By proceeding, you'll create a migration project that will guide you through the CRM migration process.
      </p>
    </div>
  );
};

export default SubmitButton;
