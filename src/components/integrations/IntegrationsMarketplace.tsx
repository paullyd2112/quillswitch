
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConnectorCategory, Connector } from "@/types/connectors";
import ConnectorCard from "./ConnectorCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface IntegrationsMarketplaceProps {
  connectors: Connector[];
  categories: ConnectorCategory[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: ConnectorCategory | "all";
  setSelectedCategory: (category: ConnectorCategory | "all") => void;
  showPopularOnly: boolean;
  setShowPopularOnly: (value: boolean) => void;
  user: any;
}

const IntegrationsMarketplace: React.FC<IntegrationsMarketplaceProps> = ({
  connectors,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  showPopularOnly,
  setShowPopularOnly,
  user
}) => {
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Integration Marketplace</h1>
          {user && (
            <Button variant="outline" className="gap-2">
              <span>My Integrations</span>
              <Badge>{0}</Badge>
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Discover and connect with a variety of services to enhance your CRM migration experience
        </p>
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            size="sm"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
          <Button
            variant={showPopularOnly ? "default" : "outline"}
            onClick={() => setShowPopularOnly(!showPopularOnly)}
            size="sm"
          >
            Popular
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {connectors.length} integration{connectors.length !== 1 ? "s" : ""}
        </p>
        <Separator className="mt-2" />
      </div>

      {/* Connectors grid */}
      {connectors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectors.map((connector) => (
            <ConnectorCard key={connector.id} connector={connector} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg font-medium">No integrations found</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default IntegrationsMarketplace;
