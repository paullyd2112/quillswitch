import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Zap, Shield } from "lucide-react";

interface DemoModeSelectorProps {
  onSelectMode: (mode: 'sample' | 'real') => void;
}

const DemoModeSelector: React.FC<DemoModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Choose Your Demo Experience</h3>
        <p className="text-muted-foreground">
          Select how you'd like to experience the QuillSwitch migration process
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer" 
              onClick={() => onSelectMode('sample')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Sample Data Demo
            </CardTitle>
            <CardDescription>
              Quick demonstration with realistic sample CRM data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Instant setup - no connections needed</li>
              <li>• Realistic sample contacts, accounts, and deals</li>
              <li>• Complete migration workflow</li>
              <li>• Perfect for first-time exploration</li>
            </ul>
            <Button className="w-full" onClick={() => onSelectMode('sample')}>
              Start Sample Demo
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer border-primary/20"
              onClick={() => onSelectMode('real')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Real Data Demo
              <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">NEW</span>
            </CardTitle>
            <CardDescription>
              Use your actual CRM data for a complete migration experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li>• Connect your real CRM systems</li>
              <li>• Extract up to 100 real records</li>
              <li>• Experience true migration complexity</li>
              <li>• <Shield className="inline h-3 w-3" /> Secure & auto-deleted</li>
            </ul>
            <Button className="w-full" variant="default" onClick={() => onSelectMode('real')}>
              Use My Real Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoModeSelector;