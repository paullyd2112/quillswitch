import React, { useState } from "react";
import ContentSection from "@/components/layout/ContentSection";
import BaseLayout from "@/components/layout/BaseLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";
import KnowledgeBaseCategory from "@/components/resources/KnowledgeBaseCategory";
import { knowledgeBaseData } from "@/components/resources/knowledgeBaseData";
import { Link } from "react-router-dom";

const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredData = searchQuery
    ? knowledgeBaseData.flatMap(category => 
        category.subcategories
          .filter(sub => 
            sub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            sub.articles.some(article => 
              article.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
          .map(sub => ({ ...sub, categoryId: category.id }))
      )
    : [];

  return (
    <BaseLayout>
      <div className="pt-8">
        <ContentSection 
          title="Knowledge Base"
          description="Access our comprehensive collection of articles, guides, and documentation to better understand migration concepts and platform features."
          centered
        >
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search the knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {searchQuery ? (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Search Results for "{searchQuery}"</h2>
                {filteredData.length === 0 ? (
                  <p className="text-muted-foreground">No results found. Try another search term.</p>
                ) : (
                  <div className="space-y-4">
                    {filteredData.map((sub, idx) => (
                      <div key={idx} className="border-b pb-4 last:border-0 last:pb-0">
                        <h3 className="font-medium">{sub.title}</h3>
                        <ul className="mt-2 space-y-1">
                          {sub.articles
                            .filter(article => 
                              article.title.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((article, i) => (
                              <li key={i}>
                                <Link 
                                  to={`/knowledge-base/${sub.categoryId}/${sub.id}/${article.id}`}
                                  className="text-brand-500 hover:underline flex items-center"
                                >
                                  <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                                  {article.title}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 flex justify-center">
                <TabsTrigger value="all">All Categories</TabsTrigger>
                {knowledgeBaseData.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid gap-8">
                  {knowledgeBaseData.map(category => (
                    <KnowledgeBaseCategory 
                      key={category.id} 
                      category={category} 
                    />
                  ))}
                </div>
              </TabsContent>

              {knowledgeBaseData.map(category => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <KnowledgeBaseCategory 
                    key={category.id} 
                    category={category} 
                    showTitle={false}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </ContentSection>
      </div>
    </BaseLayout>
  );
};

export default KnowledgeBase;
