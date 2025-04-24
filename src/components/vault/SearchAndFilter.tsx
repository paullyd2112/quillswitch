
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, X, Filter } from "lucide-react";
import { CredentialFilter } from "./types";

interface SearchAndFilterProps {
  onFilterChange: (filter: CredentialFilter) => void;
  availableTags: string[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ onFilterChange, availableTags }) => {
  const [filter, setFilter] = useState<CredentialFilter>({
    searchTerm: "",
    types: [],
    environments: [],
    tags: [],
    showExpired: true
  });

  const [selectedTypes, setSelectedTypes] = useState<Record<string, boolean>>({
    api_key: false,
    oauth_token: false,
    connection_string: false,
    secret_key: false
  });

  const [selectedEnvironments, setSelectedEnvironments] = useState<Record<string, boolean>>({
    development: false,
    staging: false,
    production: false
  });

  const [selectedTags, setSelectedTags] = useState<Record<string, boolean>>(
    availableTags.reduce((acc, tag) => ({ ...acc, [tag]: false }), {})
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter, searchTerm: e.target.value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleTypeToggle = (type: string) => {
    const newSelectedTypes = { ...selectedTypes, [type]: !selectedTypes[type] };
    setSelectedTypes(newSelectedTypes);
    
    const activeTypes = Object.entries(newSelectedTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);
      
    const newFilter = { ...filter, types: activeTypes };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleEnvironmentToggle = (env: string) => {
    const newSelectedEnvs = { ...selectedEnvironments, [env]: !selectedEnvironments[env] };
    setSelectedEnvironments(newSelectedEnvs);
    
    const activeEnvironments = Object.entries(newSelectedEnvs)
      .filter(([_, isSelected]) => isSelected)
      .map(([env]) => env);
      
    const newFilter = { ...filter, environments: activeEnvironments };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = { ...selectedTags, [tag]: !selectedTags[tag] };
    setSelectedTags(newSelectedTags);
    
    const activeTags = Object.entries(newSelectedTags)
      .filter(([_, isSelected]) => isSelected)
      .map(([tag]) => tag);
      
    const newFilter = { ...filter, tags: activeTags };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleShowExpiredToggle = () => {
    const newFilter = { ...filter, showExpired: !filter.showExpired };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const clearFilters = () => {
    setSelectedTypes({
      api_key: false,
      oauth_token: false,
      connection_string: false,
      secret_key: false
    });
    
    setSelectedEnvironments({
      development: false,
      staging: false,
      production: false
    });
    
    setSelectedTags(availableTags.reduce((acc, tag) => ({ ...acc, [tag]: false }), {}));
    
    const newFilter = {
      searchTerm: "",
      types: [],
      environments: [],
      tags: [],
      showExpired: true
    };
    
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  // Count active filters
  const activeFilterCount = 
    filter.types.length + 
    filter.environments.length + 
    filter.tags.length + 
    (filter.showExpired ? 0 : 1);

  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search credentials by name or service..."
          value={filter.searchTerm}
          onChange={handleSearchChange}
          className="pl-8 pr-4"
        />
        {filter.searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => {
              setFilter({ ...filter, searchTerm: "" });
              onFilterChange({ ...filter, searchTerm: "" });
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
          <DropdownMenuCheckboxItem 
            checked={selectedTypes.api_key}
            onCheckedChange={() => handleTypeToggle('api_key')}
          >
            API Key
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={selectedTypes.oauth_token}
            onCheckedChange={() => handleTypeToggle('oauth_token')}
          >
            OAuth Token
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={selectedTypes.connection_string}
            onCheckedChange={() => handleTypeToggle('connection_string')}
          >
            Connection String
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={selectedTypes.secret_key}
            onCheckedChange={() => handleTypeToggle('secret_key')}
          >
            Secret Key
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Filter by Environment</DropdownMenuLabel>
          <DropdownMenuCheckboxItem 
            checked={selectedEnvironments.development}
            onCheckedChange={() => handleEnvironmentToggle('development')}
          >
            Development
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={selectedEnvironments.staging}
            onCheckedChange={() => handleEnvironmentToggle('staging')}
          >
            Staging
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem 
            checked={selectedEnvironments.production}
            onCheckedChange={() => handleEnvironmentToggle('production')}
          >
            Production
          </DropdownMenuCheckboxItem>
          
          {availableTags.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
              {availableTags.map(tag => (
                <DropdownMenuCheckboxItem 
                  key={tag}
                  checked={selectedTags[tag]}
                  onCheckedChange={() => handleTagToggle(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))}
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Other Filters</DropdownMenuLabel>
          <DropdownMenuCheckboxItem 
            checked={filter.showExpired}
            onCheckedChange={handleShowExpiredToggle}
          >
            Show Expired Credentials
          </DropdownMenuCheckboxItem>
          
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters} 
              className="w-full"
              disabled={activeFilterCount === 0}
            >
              Clear All Filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchAndFilter;
