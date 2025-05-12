
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, BookOpen, FileText, CheckCircle, ChevronRight, ChevronDown, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating: number; // 1-5
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface QA {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const articles: KnowledgeArticle[] = [
  {
    id: "salesforce-to-hubspot",
    title: "Salesforce to HubSpot Migration Guide",
    description: "Complete walkthrough of migrating from Salesforce to HubSpot, including field mapping recommendations and best practices.",
    category: "migration-guides",
    tags: ["salesforce", "hubspot", "migration", "popular"],
    rating: 5,
    difficulty: "intermediate"
  },
  {
    id: "data-cleaning",
    title: "Pre-Migration Data Cleaning Checklist",
    description: "Essential steps to clean and prepare your CRM data before migration to ensure the highest quality results.",
    category: "best-practices",
    tags: ["data-quality", "preparation", "cleaning"],
    rating: 5,
    difficulty: "beginner"
  },
  {
    id: "custom-fields",
    title: "Handling Custom Fields During Migration",
    description: "Strategies for successfully mapping and migrating custom fields between different CRM systems.",
    category: "technical-guides",
    tags: ["custom-fields", "mapping", "advanced"],
    rating: 4,
    difficulty: "advanced"
  },
  {
    id: "activities-migration",
    title: "Migrating CRM Activities and History",
    description: "How to preserve your valuable activity history, notes, and timeline data during CRM migration.",
    category: "technical-guides",
    tags: ["activities", "history", "notes"],
    rating: 4,
    difficulty: "intermediate"
  },
  {
    id: "migration-timing",
    title: "Choosing the Right Time for CRM Migration",
    description: "Strategic considerations for timing your migration to minimize business disruption.",
    category: "best-practices",
    tags: ["planning", "timing", "strategy"],
    rating: 5,
    difficulty: "beginner"
  },
  {
    id: "pipedrive-to-salesforce",
    title: "Pipedrive to Salesforce Migration Guide",
    description: "Step-by-step process for migrating from Pipedrive to Salesforce CRM with field mapping templates.",
    category: "migration-guides",
    tags: ["pipedrive", "salesforce", "migration"],
    rating: 4,
    difficulty: "intermediate"
  },
];

const faqs: QA[] = [
  {
    id: "timeline",
    question: "How long does a typical CRM migration take?",
    answer: "With QuillSwitch, most migrations can be completed in hours or days, rather than the weeks or months required by traditional methods. The exact timeline depends on factors like data volume, complexity of customizations, and the number of integrated systems. A typical small to mid-sized business migration using QuillSwitch can be completed in 1-3 days.",
    category: "general"
  },
  {
    id: "data-loss",
    question: "Will I lose any data during migration?",
    answer: "QuillSwitch is designed to prevent data loss. Our system validates all data before migration, identifies potential issues, and provides tools to ensure complete data transfer. The pre-migration validation process catches mapping problems, and our automated quality checks ensure data integrity throughout the process. Additionally, we never delete your source data, so you can always access the original information if needed.",
    category: "security"
  },
  {
    id: "custom-fields",
    question: "How are custom fields handled during migration?",
    answer: "QuillSwitch automatically detects custom fields in your source CRM and suggests appropriate mappings in your destination CRM. For fields that don't have a direct match, our system helps you create corresponding custom fields in the target system. Our AI mapping technology is particularly effective at identifying logical pairings between differently-named custom fields based on data patterns and field usage.",
    category: "technical"
  },
  {
    id: "downtime",
    question: "Will my team experience downtime during migration?",
    answer: "QuillSwitch is designed to minimize or eliminate downtime. We use an incremental migration approach where historical data is migrated first while your team continues to work in the source system. Then, during the final cutover, only recent changes need to be migrated, which typically takes just hours rather than days. For many customers, the final cutover can be scheduled overnight or during a weekend to avoid any business disruption.",
    category: "operations"
  },
  {
    id: "security",
    question: "How secure is the migration process?",
    answer: "Security is a core principle of QuillSwitch. We use OAuth 2.0 for secure API authentication, end-to-end encryption for all data in transit and at rest, and maintain SOC 2 Type II compliance. We implement Zero Data Retention, meaning your CRM data is automatically purged from our systems once migration is complete. All migrations run in isolated environments with comprehensive audit logging.",
    category: "security"
  },
  {
    id: "integrations",
    question: "What happens to my CRM integrations after migration?",
    answer: "QuillSwitch helps you identify and reconnect your CRM integrations after migration. Our system creates a map of your existing integrations and provides guided workflows for reconnecting each one with your new CRM system. We provide pre-built connectors for popular tools and detailed instructions for custom integrations. This approach dramatically reduces the time and complexity typically involved in re-establishing your CRM ecosystem.",
    category: "technical"
  },
];

const ExpertKnowledgeBase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Filter articles based on search term and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      activeCategory === "all" || article.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="h-6 w-1 bg-gradient-to-b from-pink-500 to-violet-500 rounded-full"></div>
          CRM Migration Knowledge Base
        </CardTitle>
        <CardDescription>
          Expert guides, best practices, and answers to common questions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10"
              placeholder="Search guides, articles, and FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="guides">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="guides">
                <BookOpen className="h-4 w-4 mr-2" /> Guides & Articles
              </TabsTrigger>
              <TabsTrigger value="faqs">
                <FileText className="h-4 w-4 mr-2" /> FAQs
              </TabsTrigger>
              <TabsTrigger value="videos">
                <BookOpen className="h-4 w-4 mr-2" /> Video Resources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="guides" className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeCategory === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveCategory("all")}
                >
                  All
                </Button>
                <Button 
                  variant={activeCategory === "migration-guides" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveCategory("migration-guides")}
                >
                  Migration Guides
                </Button>
                <Button 
                  variant={activeCategory === "best-practices" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveCategory("best-practices")}
                >
                  Best Practices
                </Button>
                <Button 
                  variant={activeCategory === "technical-guides" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveCategory("technical-guides")}
                >
                  Technical Guides
                </Button>
              </div>
              
              <div className="space-y-4">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map(article => (
                    <div 
                      key={article.id}
                      className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                      <div 
                        className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{article.title}</h3>
                          {expandedArticle === article.id ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        
                        <div className="flex items-center mt-1 text-muted-foreground text-sm">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < article.rating ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="mx-2">•</span>
                          <Badge 
                            variant="outline"
                            className={`
                              ${article.difficulty === "beginner" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                                article.difficulty === "intermediate" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" :
                                "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"}
                            `}
                          >
                            {article.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      {expandedArticle === article.id && (
                        <div className="px-4 pb-4">
                          <Separator className="my-2" />
                          <p className="text-muted-foreground text-sm mb-3">
                            {article.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {article.tags.map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className={tag === "popular" ? "bg-primary/10 text-primary" : ""}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-end">
                            <Button size="sm" className="gap-1">
                              Read Full Article <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No articles match your search criteria. Try adjusting your search.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="faqs" className="space-y-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="hover:no-underline px-4 py-3">
                        <div className="font-medium text-left">{faq.question}</div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="text-muted-foreground">
                          {faq.answer}
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <Badge variant="outline" className="capitalize">
                            {faq.category}
                          </Badge>
                          <Button variant="link" size="sm" className="text-primary p-0 h-auto gap-1">
                            Learn more <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No FAQs match your search criteria. Try adjusting your search.
                  </div>
                )}
              </Accordion>
            </TabsContent>
            
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                  <div className="bg-slate-200 dark:bg-slate-700 aspect-video flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Video thumbnail</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Complete CRM Migration Walkthrough</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Step-by-step guide to migrating from Salesforce to HubSpot
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">15:32</Badge>
                      <Button variant="link" className="p-0 h-auto">Watch now</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                  <div className="bg-slate-200 dark:bg-slate-700 aspect-video flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Video thumbnail</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">Field Mapping Best Practices</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Expert tips for mapping complex CRM fields between systems
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">10:47</Badge>
                      <Button variant="link" className="p-0 h-auto">Watch now</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-lg">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-primary/10 mr-4">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Need Personalized Migration Advice?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Our CRM migration experts are available to answer your specific questions and 
                  provide tailored guidance for your unique situation.
                </p>
                <Button>Book a Free Migration Consultation</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertKnowledgeBase;
