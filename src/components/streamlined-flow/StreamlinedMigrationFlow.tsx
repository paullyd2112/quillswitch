
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Database, 
  CheckCircle, 
  Globe,
  Zap,
  Clock,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  estimatedTime: string;
}

const flowSteps: FlowStep[] = [
  {
    id: "connect-source",
    title: "Connect Your Current CRM",
    description: "Quick OAuth connection to your existing system",
    icon: <Database className="h-5 w-5" />,
    estimatedTime: "30 seconds"
  },
  {
    id: "connect-destination", 
    title: "Connect Your New CRM",
    description: "Connect to where you want your data to go",
    icon: <Database className="h-5 w-5" />,
    estimatedTime: "30 seconds"
  },
  {
    id: "scan-ecosystem",
    title: "Discover Connected Tools",
    description: "We'll automatically find your integrations",
    icon: <Globe className="h-5 w-5" />,
    estimatedTime: "1 minute"
  },
  {
    id: "configure-migration",
    title: "Configure Your Migration", 
    description: "Smart defaults with option to customize",
    icon: <Shield className="h-5 w-5" />,
    estimatedTime: "2 minutes"
  },
  {
    id: "migrate",
    title: "Migrate Your Data",
    description: "Sit back while we handle everything",
    icon: <Zap className="h-5 w-5" />,
    estimatedTime: "5-15 minutes"
  }
];

const StreamlinedMigrationFlow: React.FC = () => {
  const navigate = useNavigate();
  const { user, signUp, signIn } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const totalSteps = flowSteps.length + 1; // +1 for auth step
  const progress = ((currentStep + (isAuthenticated ? 1 : 0)) / totalSteps) * 100;

  const handleAuthentication = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success("Account created! Let's start your migration.");
      } else {
        await signIn(email, password);
        toast.success("Welcome back! Let's continue your migration.");
      }
      setIsAuthenticated(true);
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartMigration = () => {
    toast.success("Starting your streamlined migration process...");
    navigate("/app/setup");
  };

  const handleStepComplete = () => {
    if (currentStep < flowSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast.success(`${flowSteps[currentStep].title} completed!`);
    } else {
      handleStartMigration();
    }
  };

  const EstimatedTime = () => {
    const totalMinutes = flowSteps.reduce((acc, step) => {
      const time = step.estimatedTime;
      if (time.includes("minute")) {
        const minutes = parseInt(time.split("-")[1] || time.split(" ")[0]);
        return acc + minutes;
      }
      return acc + 0.5; // 30 seconds = 0.5 minutes
    }, 0);

    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Total time: ~{Math.ceil(totalMinutes)} minutes</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Complete CRM Migration in 5 Simple Steps</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We'll guide you through the entire process. No technical expertise required.
          </p>
          <EstimatedTime />
        </div>

        {/* Progress Overview */}
        <Card className="border-2 border-brand-200 dark:border-brand-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Migration Progress</CardTitle>
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Step {isAuthenticated ? currentStep + 2 : 1} of {totalSteps}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {flowSteps.slice(0, 3).map((step, index) => (
                <div 
                  key={step.id}
                  className={`p-3 rounded-lg border ${
                    index <= currentStep && isAuthenticated
                      ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
                      : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <span className="font-medium text-sm">{step.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Authentication Step */}
        {!isAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                  <span className="text-sm font-bold">1</span>
                </div>
                Get Started - Create Your Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button 
                  onClick={handleAuthentication}
                  disabled={isLoading}
                  className="w-full sm:w-auto gap-2"
                >
                  {isLoading ? "Setting up..." : isSignUp ? "Create Account & Start Migration" : "Sign In & Continue"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Migration Steps */}
        {isAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                  <span className="text-sm font-bold">{currentStep + 2}</span>
                </div>
                {flowSteps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                {flowSteps[currentStep].icon}
                <div>
                  <p className="font-medium">{flowSteps[currentStep].description}</p>
                  <p className="text-sm text-muted-foreground">
                    Estimated time: {flowSteps[currentStep].estimatedTime}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleStepComplete}
                className="w-full gap-2"
                size="lg"
              >
                {currentStep === flowSteps.length - 1 ? "Start Migration" : "Complete This Step"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* What Happens Next */}
        <Card className="bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-950/30 dark:to-blue-950/30">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">What happens after you start?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Real-time migration monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Automatic data validation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Connected tools auto-reconnection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Complete success report</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StreamlinedMigrationFlow;
