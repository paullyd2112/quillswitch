import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, Zap, Shield, Target, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-brand-600" />
              <span className="text-2xl font-bold">QuillSwitch</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/platform" className="text-muted-foreground hover:text-foreground transition-colors">
                Platform
              </Link>
              <Link to="/connections" className="text-muted-foreground hover:text-foreground transition-colors">
                Connections
              </Link>
              <Link to="/production-migration" className="text-muted-foreground hover:text-foreground transition-colors">
                Migration
              </Link>
              <Link to="/auto-connector" className="text-muted-foreground hover:text-foreground transition-colors">
                Auto-Connector
              </Link>
              <Link to="/integrations" className="text-muted-foreground hover:text-foreground transition-colors">
                Integrations
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-brand-100 text-brand-700 border-brand-200">
            🚀 Revolutionary CRM Migration Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            CRM Migration Made Simple & Secure
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            QuillSwitch makes CRM data migration fast, secure, and hassle-free for SMBs and Mid-Market companies. 
            Migrate your data and automatically reconnect your entire business ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/connections">
              <Button size="lg" className="min-w-[200px]">
                Start Migration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/platform">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                View Platform
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Enterprise-grade Security
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              99.9% Data Accuracy
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              10x Faster than Manual
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Complete Migration & Reconnection Solution</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From secure data migration to automatic ecosystem reconnection, QuillSwitch handles every aspect of your CRM transition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Secure Migration */}
          <Card className="border-2 hover:border-brand-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-brand-600" />
              </div>
              <CardTitle>Secure Data Migration</CardTitle>
              <CardDescription>
                Enterprise-grade security with OAuth 2.0, encryption at rest, and comprehensive audit trails.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  OAuth 2.0 Authentication
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Encrypted Data at Rest
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Smart Data Validation
                </li>
              </ul>
              <Link to="/production-migration" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Learn More
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Ecosystem Auto-Connector */}
          <Card className="border-2 hover:border-purple-200 transition-colors bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="flex items-center gap-2">
                Ecosystem Auto-Connector
                <Badge className="bg-purple-500 text-white">NEW</Badge>
              </CardTitle>
              <CardDescription>
                Revolutionary AI-powered integration detection and automatic reconnection for your business tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Smart Integration Detection
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Automatic Reconnection
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  Guided Setup Assistant
                </li>
              </ul>
              <Link to="/auto-connector" className="inline-block mt-4">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Try Auto-Connector
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Production Optimization */}
          <Card className="border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Production Optimization</CardTitle>
              <CardDescription>
                Advanced optimization features for enterprise-scale migrations with real-time monitoring.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Pre-compiled Schema Cache
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  GraphQL Streaming
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Advanced Concurrency
                </li>
              </ul>
              <Link to="/production-migration" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  View Features
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-brand-600 to-brand-700 text-white border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your CRM Migration?</h2>
            <p className="text-brand-100 mb-8 text-lg max-w-2xl mx-auto">
              Join forward-thinking companies using QuillSwitch to migrate faster, more securely, 
              and with complete ecosystem reconnection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/connections">
                <Button size="lg" variant="secondary" className="min-w-[200px]">
                  Start Free Migration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auto-connector">
                <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white hover:text-brand-600">
                  Try Auto-Connector
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
