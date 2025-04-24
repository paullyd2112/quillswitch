
import React, { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CredentialTag from "./CredentialTag";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, suggestions = [] }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
    } else if (e.key === "," && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
    }
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase();
    if (!tags.includes(normalizedTag)) {
      onChange([...tags, normalizedTag]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(
    suggestion => suggestion.toLowerCase().includes(input.toLowerCase()) && !tags.includes(suggestion)
  );

  return (
    <div>
      <div className="flex flex-wrap mb-2">
        {tags.map(tag => (
          <CredentialTag 
            key={tag} 
            tag={tag} 
            onRemove={() => removeTag(tag)} 
            isEditable={true} 
          />
        ))}
      </div>
      
      <div className="flex gap-2 relative">
        <Input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Add tag and press Enter or comma"
          className="flex-grow"
          onFocus={() => input && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <Button 
          type="button"
          variant="outline"
          onClick={() => {
            if (input.trim()) addTag(input.trim());
          }}
          disabled={!input.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 bg-white border rounded-md shadow-md mt-1">
            {filteredSuggestions.slice(0, 5).map(suggestion => (
              <div
                key={suggestion}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;
