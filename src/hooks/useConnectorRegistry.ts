
import { useState, useMemo } from "react";
import { connectors } from "@/data/connectorRegistry";
import { Connector, ConnectorCategory } from "@/types/connectors";

export function useConnectorRegistry() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ConnectorCategory | "all">("all");
  const [showPopularOnly, setShowPopularOnly] = useState(false);

  const filteredConnectors = useMemo(() => {
    return connectors.filter((connector) => {
      // Filter by search term
      const matchesSearch = searchTerm === "" || 
        connector.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        connector.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = selectedCategory === "all" || connector.category === selectedCategory;
      
      // Filter by popularity
      const matchesPopularity = !showPopularOnly || connector.popular;
      
      return matchesSearch && matchesCategory && matchesPopularity;
    });
  }, [searchTerm, selectedCategory, showPopularOnly]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(connectors.map(connector => connector.category));
    return Array.from(uniqueCategories);
  }, []);

  return {
    connectors: filteredConnectors,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showPopularOnly,
    setShowPopularOnly,
  };
}
