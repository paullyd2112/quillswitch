
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ChevronRight, 
  Sparkles, 
  Users, 
  LineChart, 
  Layers, 
  Link as LinkIcon, 
  CheckCircle,
  Filter,
  ArrowRight,
  Zap,
  BarChart2,
  Puzzle,
  FileText,
  Search
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import DashboardStats from "@/components/dashboard/DashboardStats";
import OnboardingFlowCard from "@/components/dashboard/OnboardingFlowCard";
import OnboardingTemplate from "@/components/templates/OnboardingTemplate";
import FeatureCard from "@/components/ui-elements/FeatureCard";
import { onboardingFlows, onboardingTemplates, featureHighlights } from "@/assets/mockData";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Map string icons from mockData to actual components
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles size={24} />,
    Users: <Users size={24} />,
    LineChart: <LineChart size={24} />,
    Layers: <Layers size={24} />,
    Link: <LinkIcon size={24} />,
    CheckCircle: <CheckCircle size={24} />,
  };
  
  return iconMap[iconName] || <Sparkles size={24} />;
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter flows based on search query
  const filteredFlows = onboardingFlows.filter(flow => 
    flow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
                Customer Onboarding Platform
              </Badge>
            </FadeIn>
            <FadeIn delay="100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Create exceptional 
                <span className="text-brand-500 dark:text-brand-400"> onboarding experiences</span>
              </h1>
            </FadeIn>
            <FadeIn delay="200">
              <p className="text-xl text-muted-foreground mb-8">
                Build beautiful, interactive onboarding flows that guide users, increase adoption, and reduce churn across any SaaS platform.
              </p>
            </FadeIn>
            <FadeIn delay="300">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="w-full sm:w-auto gap-2" size="lg">
                  Get Started <ChevronRight size={16} />
                </Button>
                <Button variant="outline" className="w-full sm:w-auto gap-2" size="lg">
                  View Demo <ArrowRight size={16} />
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Stats Bar */}
      <ContentSection fullWidth className="py-8 overflow-hidden">
        <div className="container px-4">
          <DashboardStats />
        </div>
      </ContentSection>
      
      {/* Dashboard Section */}
      <ContentSection
        title="Your Onboarding Flows"
        description="Build and manage customized onboarding experiences for your SaaS products"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:w-64 lg:w-80">
            <Input
              placeholder="Search flows..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-1">
              <Filter size={16} /> Filter
            </Button>
            <Button className="gap-1">
              <Plus size={16} /> Create Flow
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Flows</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredFlows.length === 0 ? (
              <GlassPanel className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No flows match your search criteria.</p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </GlassPanel>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFlows.map((flow, index) => (
                  <OnboardingFlowCard 
                    key={flow.id} 
                    flow={{
                      ...flow,
                      status: flow.status as "active" | "draft" | "archived"
                    }} 
                    delay={index < 5 ? `${(index + 1) * 100}` as "100" | "200" | "300" | "400" | "500" : "none"}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onboardingFlows
                .filter(flow => flow.status === "active")
                .map((flow, index) => (
                  <OnboardingFlowCard 
                    key={flow.id} 
                    flow={{
                      ...flow,
                      status: flow.status as "active" | "draft" | "archived"
                    }}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="draft">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onboardingFlows
                .filter(flow => flow.status === "draft")
                .map((flow, index) => (
                  <OnboardingFlowCard 
                    key={flow.id} 
                    flow={{
                      ...flow,
                      status: flow.status as "active" | "draft" | "archived"
                    }}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="archived">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onboardingFlows
                .filter(flow => flow.status === "archived")
                .map((flow, index) => (
                  <OnboardingFlowCard 
                    key={flow.id} 
                    flow={{
                      ...flow,
                      status: flow.status as "active" | "draft" | "archived"
                    }}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </ContentSection>
      
      {/* Templates Section */}
      <ContentSection
        id="templates"
        title="Ready-to-use Templates"
        description="Start with pre-built templates for common onboarding scenarios across any SaaS platform"
        className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-background"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {onboardingTemplates.map((template, index) => (
            <OnboardingTemplate 
              key={template.id} 
              template={template} 
              delay={index < 5 ? `${(index + 1) * 100}` as "100" | "200" | "300" | "400" | "500" : "none"}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" className="gap-1">
            View All Templates <ChevronRight size={16} />
          </Button>
        </div>
      </ContentSection>
      
      {/* Features Section */}
      <ContentSection
        id="features"
        title="Adaptable to Any SaaS Product"
        description="Our platform is designed to work seamlessly with any software application, regardless of industry or complexity"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {featureHighlights.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={
                (() => {
                  const Icon = ({
                    "Sparkles": Sparkles,
                    "Users": Users,
                    "LineChart": LineChart,
                    "Layers": Layers,
                    "Link": LinkIcon,
                    "CheckCircle": CheckCircle
                  } as any)[feature.icon] || Sparkles;
                  
                  return Icon;
                })()
              }
            />
          ))}
        </div>
        
        <FadeIn delay="300">
          <GlassPanel className="p-8 md:p-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
                  Framework-Based
                </Badge>
                <h3 className="text-2xl font-semibold mb-4">Universal Onboarding Framework</h3>
                <p className="text-muted-foreground mb-6">
                  Our platform is built on a flexible framework that adapts to any SaaS product, focusing on the core elements that make onboarding successful.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="rounded-full p-1 bg-green-100 text-green-700 mr-3 mt-1">
                      <CheckCircle size={14} />
                    </div>
                    <span>Customizable for any user role or permission level</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full p-1 bg-green-100 text-green-700 mr-3 mt-1">
                      <CheckCircle size={14} />
                    </div>
                    <span>Progressive disclosure of features based on user needs</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full p-1 bg-green-100 text-green-700 mr-3 mt-1">
                      <CheckCircle size={14} />
                    </div>
                    <span>API-first approach for seamless integration</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full p-1 bg-green-100 text-green-700 mr-3 mt-1">
                      <CheckCircle size={14} />
                    </div>
                    <span>Quick setup with minimal configuration required</span>
                  </li>
                </ul>
                
                <Button className="mt-6 gap-1">
                  Learn More <ChevronRight size={16} />
                </Button>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <GlassPanel className="p-4 h-32 flex flex-col justify-center items-center text-center">
                        <Zap size={24} className="text-brand-500 mb-2" />
                        <p className="font-medium">Account Setup</p>
                      </GlassPanel>
                      <GlassPanel className="p-4 h-32 flex flex-col justify-center items-center text-center">
                        <BarChart2 size={24} className="text-brand-500 mb-2" />
                        <p className="font-medium">Core Functionality</p>
                      </GlassPanel>
                    </div>
                    <div className="space-y-4 mt-6">
                      <GlassPanel className="p-4 h-32 flex flex-col justify-center items-center text-center">
                        <Puzzle size={24} className="text-brand-500 mb-2" />
                        <p className="font-medium">Use Case Examples</p>
                      </GlassPanel>
                      <GlassPanel className="p-4 h-32 flex flex-col justify-center items-center text-center">
                        <FileText size={24} className="text-brand-500 mb-2" />
                        <p className="font-medium">Support Resources</p>
                      </GlassPanel>
                    </div>
                  </div>
                  
                  <div className="absolute -z-10 inset-0 bg-gradient-to-r from-brand-400/20 to-brand-600/20 rounded-xl blur-xl"></div>
                </div>
              </div>
            </div>
          </GlassPanel>
        </FadeIn>
      </ContentSection>
      
      {/* CTA Section */}
      <ContentSection centered className="relative py-20 md:py-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
              Get Started Today
            </Badge>
          </FadeIn>
          <FadeIn delay="100">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to transform your <span className="text-brand-500 dark:text-brand-400">user onboarding</span>?
            </h2>
          </FadeIn>
          <FadeIn delay="200">
            <p className="text-xl text-muted-foreground mb-8">
              Start creating effective onboarding experiences that work for any SaaS platform, regardless of complexity.
            </p>
          </FadeIn>
          <FadeIn delay="300">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="w-full sm:w-auto gap-2" size="lg">
                Start Free Trial <ChevronRight size={16} />
              </Button>
              <Button variant="outline" className="w-full sm:w-auto gap-2" size="lg">
                Schedule Demo
              </Button>
            </div>
          </FadeIn>
        </div>
        
        <div className="absolute -z-10 inset-0 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/50"></div>
      </ContentSection>
      
      {/* Footer */}
      <footer className="border-t py-8 md:py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-semibold mr-2">O</div>
              <span className="font-medium text-lg">Onboardify</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Onboardify. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
