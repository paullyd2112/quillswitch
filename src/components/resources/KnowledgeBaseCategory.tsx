
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { CategoryType } from "./knowledgeBaseData";
import { Link } from "react-router-dom";

interface KnowledgeBaseCategoryProps {
  category: CategoryType;
  showTitle?: boolean;
}

const KnowledgeBaseCategory: React.FC<KnowledgeBaseCategoryProps> = ({ 
  category, 
  showTitle = true 
}) => {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        {showTitle && (
          <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          {category.subcategories.map((subcategory, index) => (
            <div key={index}>
              <h3 className="text-lg font-medium mb-2">{subcategory.title}</h3>
              <ul className="space-y-1.5">
                {subcategory.articles.map((article, i) => (
                  <li key={i}>
                    <Link 
                      to={`/knowledge-base/${category.id}/${subcategory.id}/${article.id}`}
                      className="text-muted-foreground hover:text-foreground flex items-center group"
                    >
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand-500 transition-colors mr-1 flex-shrink-0" />
                      <span className="group-hover:text-brand-500 transition-colors">{article.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseCategory;
