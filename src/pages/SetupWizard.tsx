
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle,
  ChevronRight, 
  ArrowRight, 
  ArrowLeft,
  Settings,
  FileCode,
  Users,
  Zap,
  Database,
  Puzzle,
  Key
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import FadeIn from "@/components/animations/FadeIn";
import SlideUp from "@/components/animations/SlideUp";
import GlassPanel from "@/components/ui-elements/GlassPanel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SetupWizard = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: "",
    productName: "",
    productType: "saas",
    apiKey: "",
    userRoles: "",
    welcomeMessage: "",
    integration: "api",
    customizations: [] as string[],
  });
  
  const steps: WizardStep[] = [
    {
      id: "basics",
      title: "Basic Information",
      description: "Let's get to know your product",
      icon: <Settings size={24} />
    },
    {
      id: "integration",
      title: "Integration Method",
      description: "How you'll connect with our platform",
      icon: <FileCode size={24} />
    },
    {
      id: "roles",
      title: "User Roles",
      description: "Define different user types",
      icon: <Users size={24} />
    },
    {
      id: "content",
      title: "Content Setup",
      description: "Customize your onboarding content",
      icon: <Puzzle size={24} />
    },
    {
      id: "complete",
      title: "Complete",
      description: "Ready to launch",
      icon: <CheckCircle size={24} />
    }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRadioChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleCheckboxChange = (value: string) => {
    const updatedCustomizations = formData.customizations.includes(value)
      ? formData.customizations.filter(item => item !== value)
      : [...formData.customizations, value];
      
    setFormData({
      ...formData,
      customizations: updatedCustomizations
    });
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = () => {
    // In a real app, this would submit the setup information to the backend
    console.log("Setup complete:", formData);
    toast({
      title: "Setup Complete!",
      description: "Your onboarding platform is now configured and ready to use.",
    });
  };
  
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return formData.companyName.trim() !== "" && formData.productName.trim() !== "";
      case 1: // Integration Method
        if (formData.integration === "api") {
          return formData.apiKey.trim() !== "";
        }
        return true;
      case 2: // User Roles
        return formData.userRoles.trim() !== "";
      case 3: // Content Setup
        return formData.welcomeMessage.trim() !== "";
      default:
        return true;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50 hero-gradient">
      <Navbar />
      
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <Badge className="mb-4 bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/40">
                Platform Setup
              </Badge>
            </FadeIn>
            <FadeIn delay="100">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Setup Wizard
              </h1>
            </FadeIn>
            <FadeIn delay="200">
              <p className="text-xl text-muted-foreground mb-8">
                Configure your onboarding platform in just a few steps to get started quickly
              </p>
            </FadeIn>
          </div>
        </div>
      </section>
      
      <ContentSection className="py-12 pb-32">
        <GlassPanel className="max-w-4xl mx-auto">
          <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Setup Your Onboarding Platform</h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 dark:bg-brand-400 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
                
                <div className="relative flex justify-between">
                  {steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      className="flex flex-col items-center"
                      onClick={() => index < currentStep && setCurrentStep(index)} // Allow going back to previous steps
                    >
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                          index < currentStep
                            ? "bg-brand-500 text-white cursor-pointer"
                            : index === currentStep
                            ? "bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-900/50"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {index < currentStep ? (
                          <CheckCircle size={20} />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="mt-2 hidden md:block">
                        <p className={`text-sm font-medium ${
                          index <= currentStep
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-muted-foreground hidden lg:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <FadeIn>
              {currentStep === 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Basic Information</h3>
                  <p className="text-muted-foreground mb-6">
                    Tell us about your company and product to help us customize your onboarding platform.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName"
                        name="companyName"
                        placeholder="Acme Inc."
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input 
                        id="productName"
                        name="productName"
                        placeholder="Acme Dashboard"
                        value={formData.productName}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Product Type</Label>
                      <RadioGroup 
                        value={formData.productType} 
                        onValueChange={(value) => handleRadioChange(value, "productType")}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="saas" id="saas" />
                          <Label htmlFor="saas">SaaS Platform</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mobile" id="mobile" />
                          <Label htmlFor="mobile">Mobile App</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="enterprise" id="enterprise" />
                          <Label htmlFor="enterprise">Enterprise Software</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 1 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Integration Method</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose how you want to integrate our onboarding platform with your product.
                  </p>
                  
                  <div className="space-y-6">
                    <Tabs 
                      defaultValue="api" 
                      value={formData.integration}
                      onValueChange={(value) => handleRadioChange(value, "integration")}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="api" className="flex items-center justify-center">
                          <Key size={16} className="mr-2" />
                          API
                        </TabsTrigger>
                        <TabsTrigger value="embed" className="flex items-center justify-center">
                          <FileCode size={16} className="mr-2" />
                          Embed
                        </TabsTrigger>
                        <TabsTrigger value="redirect" className="flex items-center justify-center">
                          <ArrowRight size={16} className="mr-2" />
                          Redirect
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="api" className="p-4 mt-6 border rounded-md">
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="mr-4 bg-brand-50 text-brand-500 dark:bg-brand-900/20 dark:text-brand-400 p-2 rounded-full">
                              <Zap size={20} />
                            </div>
                            <div>
                              <h4 className="font-medium">API Integration</h4>
                              <p className="text-sm text-muted-foreground">
                                Use our API to create a seamless onboarding experience within your application.
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mt-4">
                            <Label htmlFor="apiKey">API Key (optional)</Label>
                            <Input 
                              id="apiKey"
                              name="apiKey"
                              placeholder="Enter your API key"
                              value={formData.apiKey}
                              onChange={handleChange}
                            />
                            <p className="text-xs text-muted-foreground">
                              You can generate an API key in your dashboard later.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="embed" className="p-4 mt-6 border rounded-md">
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="mr-4 bg-brand-50 text-brand-500 dark:bg-brand-900/20 dark:text-brand-400 p-2 rounded-full">
                              <FileCode size={20} />
                            </div>
                            <div>
                              <h4 className="font-medium">Embed Integration</h4>
                              <p className="text-sm text-muted-foreground">
                                Embed our onboarding flows directly into your application using our JavaScript SDK.
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md font-mono text-sm">
                            <code>{`<script src="https://onboardify.com/embed.js"></script>
<script>
  Onboardify.init({ productId: "YOUR_PRODUCT_ID" });
</script>`}</code>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="redirect" className="p-4 mt-6 border rounded-md">
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="mr-4 bg-brand-50 text-brand-500 dark:bg-brand-900/20 dark:text-brand-400 p-2 rounded-full">
                              <ArrowRight size={20} />
                            </div>
                            <div>
                              <h4 className="font-medium">Redirect Integration</h4>
                              <p className="text-sm text-muted-foreground">
                                Redirect users to our hosted onboarding platform and then back to your application.
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
                            <p className="text-sm">Redirect URL Format:</p>
                            <p className="font-mono text-sm mt-1">https://onboardify.com/flow/:flowId?user=:userId&return=:returnUrl</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">User Roles</h3>
                  <p className="text-muted-foreground mb-6">
                    Define the different types of users that will be onboarded to your product.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="userRoles">User Roles (one per line)</Label>
                      <Textarea 
                        id="userRoles"
                        name="userRoles"
                        placeholder="Administrator&#10;Standard User&#10;Read-only User"
                        value={formData.userRoles}
                        onChange={handleChange}
                        className="min-h-32"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter each user role on a new line. For each role, we'll create a customized onboarding flow.
                      </p>
                    </div>
                    
                    <GlassPanel className="p-4">
                      <h4 className="font-medium mb-3">Common Role Examples</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="justify-start" 
                          onClick={() => setFormData({...formData, userRoles: "Administrator\nStandard User\nGuest"})}
                        >
                          Permission-based Roles
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start"
                          onClick={() => setFormData({...formData, userRoles: "Owner\nManager\nTeam Member\nClient"})}
                        >
                          Team Hierarchy
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start"
                          onClick={() => setFormData({...formData, userRoles: "Developer\nDesigner\nProject Manager\nStakeholder"})}
                        >
                          Project Roles
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start"
                          onClick={() => setFormData({...formData, userRoles: "Teacher\nStudent\nAdministrator"})}
                        >
                          Educational Roles
                        </Button>
                      </div>
                    </GlassPanel>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Content Setup</h3>
                  <p className="text-muted-foreground mb-6">
                    Customize the content and features of your onboarding experience.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Welcome Message</Label>
                      <Textarea 
                        id="welcomeMessage"
                        name="welcomeMessage"
                        placeholder="Welcome to [Product Name]! We're excited to help you get started..."
                        value={formData.welcomeMessage}
                        onChange={handleChange}
                        className="min-h-24"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Onboarding Features</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="feature-interactive" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.customizations.includes("interactive")}
                            onChange={() => handleCheckboxChange("interactive")}
                          />
                          <div>
                            <Label htmlFor="feature-interactive" className="font-medium">Interactive Tutorials</Label>
                            <p className="text-xs text-muted-foreground">Step-by-step interactive guides</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="feature-video" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.customizations.includes("video")}
                            onChange={() => handleCheckboxChange("video")}
                          />
                          <div>
                            <Label htmlFor="feature-video" className="font-medium">Video Tutorials</Label>
                            <p className="text-xs text-muted-foreground">Engaging video walkthroughs</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="feature-quiz" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.customizations.includes("quiz")}
                            onChange={() => handleCheckboxChange("quiz")}
                          />
                          <div>
                            <Label htmlFor="feature-quiz" className="font-medium">Knowledge Quizzes</Label>
                            <p className="text-xs text-muted-foreground">Test user comprehension</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="feature-progress" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.customizations.includes("progress")}
                            onChange={() => handleCheckboxChange("progress")}
                          />
                          <div>
                            <Label htmlFor="feature-progress" className="font-medium">Progress Tracking</Label>
                            <p className="text-xs text-muted-foreground">Monitor user completion</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="feature-certificate" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.customizations.includes("certificate")}
                            onChange={() => handleCheckboxChange("certificate")}
                          />
                          <div>
                            <Label htmlFor="feature-certificate" className="font-medium">Completion Certificates</Label>
                            <p className="text-xs text-muted-foreground">Reward users for finishing</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <input 
                            type="checkbox" 
                            id="feature-feedback" 
                            className="rounded border-gray-300 text-brand-500 mt-1"
                            checked={formData.customizations.includes("feedback")}
                            onChange={() => handleCheckboxChange("feedback")}
                          />
                          <div>
                            <Label htmlFor="feature-feedback" className="font-medium">Feedback Collection</Label>
                            <p className="text-xs text-muted-foreground">Gather user opinions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-medium mb-2">Setup Complete!</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Your onboarding platform is now configured and ready to use. You can make additional changes in your dashboard.
                  </p>
                  
                  <SlideUp>
                    <GlassPanel className="p-6 max-w-md mx-auto">
                      <h4 className="font-medium mb-4">Configuration Summary</h4>
                      <ul className="space-y-2 text-left">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Company:</span>
                          <span className="font-medium">{formData.companyName}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Product:</span>
                          <span className="font-medium">{formData.productName}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Product Type:</span>
                          <span className="font-medium">{formData.productType === "saas" ? "SaaS Platform" : formData.productType === "mobile" ? "Mobile App" : "Enterprise Software"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Integration:</span>
                          <span className="font-medium">{formData.integration === "api" ? "API" : formData.integration === "embed" ? "Embed" : "Redirect"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">User Roles:</span>
                          <span className="font-medium">{formData.userRoles.split("\n").length}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Features:</span>
                          <span className="font-medium">{formData.customizations.length}</span>
                        </li>
                      </ul>
                    </GlassPanel>
                  </SlideUp>
                  
                  <div className="mt-8">
                    <Button className="gap-2">
                      Go to Dashboard <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </FadeIn>
          </div>
          
          <div className="p-6 md:p-8 border-t border-gray-100 dark:border-gray-800 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft size={16} /> Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="gap-2"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next <ArrowRight size={16} />
                </>
              ) : (
                <>
                  Finish Setup <CheckCircle size={16} />
                </>
              )}
            </Button>
          </div>
        </GlassPanel>
      </ContentSection>
    </div>
  );
};

export default SetupWizard;
