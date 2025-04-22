import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ContentSection from "@/components/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { knowledgeBaseData } from "@/components/resources/knowledgeBaseData";

const KnowledgeArticle = () => {
  const { categoryId, subcategoryId, articleId } = useParams<{
    categoryId: string;
    subcategoryId: string;
    articleId: string;
  }>();
  
  const [article, setArticle] = useState<{
    title: string;
    content: string;
    categoryName: string;
    subcategoryName: string;
    relatedArticles: {id: string; title: string}[];
  } | null>(null);
  
  useEffect(() => {
    // Find the requested article
    const category = knowledgeBaseData.find(c => c.id === categoryId);
    if (!category) return;
    
    const subcategory = category.subcategories.find(s => s.id === subcategoryId);
    if (!subcategory) return;
    
    const foundArticle = subcategory.articles.find(a => a.id === articleId);
    if (!foundArticle) return;
    
    // Find some related articles from the same subcategory
    const relatedArticles = subcategory.articles
      .filter(a => a.id !== articleId)
      .slice(0, 3);
    
    setArticle({
      title: foundArticle.title,
      content: foundArticle.content || `<p>Content for "${foundArticle.title}" is not available yet.</p>`,
      categoryName: category.title,
      subcategoryName: subcategory.title,
      relatedArticles
    });
    
  }, [categoryId, subcategoryId, articleId]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-8">
          <ContentSection centered>
            <Card>
              <CardContent className="p-6">
                <p>Article not found.</p>
                <Button asChild className="mt-4">
                  <Link to="/knowledge-base">Back to Knowledge Base</Link>
                </Button>
              </CardContent>
            </Card>
          </ContentSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <ContentSection>
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm mb-6 flex-wrap">
              <Link to="/knowledge-base" className="text-muted-foreground hover:text-foreground">
                Knowledge Base
              </Link>
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              <Link to={`/knowledge-base`} className="text-muted-foreground hover:text-foreground">
                {article.categoryName}
              </Link>
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              <Link to={`/knowledge-base`} className="text-muted-foreground hover:text-foreground">
                {article.subcategoryName}
              </Link>
              <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
              <span className="text-foreground">{article.title}</span>
            </div>
            
            {/* Back button */}
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="mb-6"
            >
              <Link to="/knowledge-base">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Knowledge Base
              </Link>
            </Button>
            
            {/* Main article */}
            <Card className="mb-8">
              <CardContent className="p-6 prose max-w-none dark:prose-invert prose-headings:scroll-mt-20">
                <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
                <div 
                  className="prose-p:my-4 prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic" 
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
              </CardContent>
            </Card>
            
            {/* Related articles */}
            {article.relatedArticles.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Related Articles</h3>
                  <ul className="space-y-2">
                    {article.relatedArticles.map((related, idx) => (
                      <li key={idx}>
                        <Link 
                          to={`/knowledge-base/${categoryId}/${subcategoryId}/${related.id}`}
                          className="flex items-center text-brand-500 hover:underline"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          {related.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default KnowledgeArticle;
