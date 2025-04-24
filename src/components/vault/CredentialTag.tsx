
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface CredentialTagProps {
  tag: string;
  onRemove?: () => void;
  isEditable?: boolean;
}

const CredentialTag: React.FC<CredentialTagProps> = ({ tag, onRemove, isEditable = false }) => {
  return (
    <Badge 
      variant="outline" 
      className="mr-1 mb-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
    >
      {tag}
      {isEditable && onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }} 
          className="ml-1 hover:bg-blue-200 rounded-full"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};

export default CredentialTag;
