
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Database, Shield, Zap, GitMerge, Terminal, BarChart2, ListChecks, FileBarChart2, BellRing, Calendar, Wand2, UserCheck, Lock, UploadCloud } from "lucide-react";

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900/50">
      <Navbar />
      
      <section className="pt-32 pb-10 px-4 md:px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Features & Tools</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive solutions for your CRM migration needs with powerful features designed for enterprise-grade migrations.
            </p>
          </div>
        </div>
      </section>
      
      {/* Feature Categories Section */}
      <section className="py-16 px-4 md:px-6 bg-slate-50 dark:bg-slate-900/30">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Category 1: Core Migration Features */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4 text-brand-500">
                <Database size={42} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Core Migration</h3>
              <p className="text-muted-foreground mb-4">Essential tools for seamless data transfer between CRM systems.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automated field mapping with AI</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Delta syncs for ongoing updates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Custom objects migration</span>
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/migrations/setup">Start Migration <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>
            
            {/* Category 2: Data Quality & Validation */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4 text-brand-500">
                <ListChecks size={42} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Quality</h3>
              <p className="text-muted-foreground mb-4">Tools to validate and improve data quality during migration.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Pre-migration data validation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Customizable validation rules</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Data cleansing workflows</span>
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/migrations/setup">Validate Data <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>
            
            {/* Category 3: Security & Compliance */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4 text-brand-500">
                <Shield size={42} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Security & Compliance</h3>
              <p className="text-muted-foreground mb-4">Enterprise-grade security for sensitive customer data.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>GDPR & CCPA compliance controls</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Role-based access controls</span>
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/enterprise-test">Test Security <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>
            
            {/* Category 4: Integration & API */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4 text-brand-500">
                <Terminal size={42} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Integration & APIs</h3>
              <p className="text-muted-foreground mb-4">Powerful APIs and integration tools for developers.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Comprehensive REST API</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Webhook notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>SDK for major programming languages</span>
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/api-docs">API Documentation <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>
            
            {/* Category 5: Reporting & Analytics */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4 text-brand-500">
                <FileBarChart2 size={42} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reporting & Analytics</h3>
              <p className="text-muted-foreground mb-4">Insightful reports and analytics on your migration process.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Migration performance metrics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Data quality dashboards</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Custom report generation</span>
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/reports">View Reports <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>
            
            {/* Category 6: Notifications & Monitoring */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4 text-brand-500">
                <BellRing size={42} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Notifications & Monitoring</h3>
              <p className="text-muted-foreground mb-4">Stay informed about migration events and processes.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Real-time migration alerts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Email and webhook notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Migration progress tracking</span>
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/settings">Configure Notifications <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>
            
            {/* NEW: Category 7: Scheduling & Automation */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4 text-brand-500">
                <Calendar size={42} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Scheduling & Automation</h3>
              <p className="text-muted-foreground mb-4">Automate your migration processes with advanced scheduling.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Off-hours migration scheduling</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Recurring synchronization tasks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Event-triggered migrations</span>
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/migrations/setup">Schedule Migration <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>
            
            {/* NEW: Category 8: User Management */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4 text-brand-500">
                <UserCheck size={42} />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-muted-foreground mb-4">Comprehensive user controls and permission management.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Role-based access control</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Team collaboration features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Audit logs for user actions</span>
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/settings">Manage Users <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>
            
            {/* NEW: Category 9: Cloud Integration */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
              <div className="mb-4 text-brand-500">
                <UploadCloud size={42} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cloud Integration</h3>
              <p className="text-muted-foreground mb-4">Seamless integration with all major cloud providers and services.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Direct cloud storage connection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Secure data transfer protocols</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Multi-cloud environment support</span>
                </li>
              </ul>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/migrations/setup">Configure Cloud <ArrowRight size={16} className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* In-depth Features Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Feature Deep Dive</h2>
          
          {/* Feature 1 */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full">
                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                  <Wand2 size={32} className="text-brand-500 mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">Intelligent Field Mapping</h3>
                  <p className="text-muted-foreground mb-4">
                    Our AI-powered field mapping technology intelligently maps fields between different CRM systems, saving hours of manual configuration.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Automatically detects standard field mappings across platforms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Suggests mappings for custom fields based on data patterns</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Learns from previous migrations to improve accuracy</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="w-full">
                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                  <GitMerge size={32} className="text-brand-500 mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">Delta Synchronization</h3>
                  <p className="text-muted-foreground mb-4">
                    Keep your CRM systems in sync with intelligent delta synchronization that only transfers what's changed.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Scheduled synchronization on custom intervals</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Change detection across contacts, accounts, and opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Conflict resolution with customizable rules</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full">
                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                  <ListChecks size={32} className="text-brand-500 mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">Data Validation & Quality</h3>
                  <p className="text-muted-foreground mb-4">
                    Ensure data quality with robust validation tools that catch issues before they impact your business.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Customizable validation rules for different data types</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Pre-migration data quality assessments</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Issue correction workflows</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="w-full">
                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                  <BellRing size={32} className="text-brand-500 mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">Real-time Notifications</h3>
                  <p className="text-muted-foreground mb-4">
                    Stay informed about migration progress with real-time notifications through multiple channels.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Email, SMS, and in-app notifications</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Webhooks for integration with other systems</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Customizable notification thresholds and events</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 5 */}
          <div>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full">
                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                  <FileBarChart2 size={32} className="text-brand-500 mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Gain insights into your migration performance with detailed analytics and customizable dashboards.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Migration speed and performance metrics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Data volume and transformation analytics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Custom report generation and scheduling</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-brand-50 dark:bg-brand-900/20">
        <div className="container max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your CRM migration?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Start your migration today and experience the difference with QuillSwitch's powerful features.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/migrations/setup">Start Migration <ArrowRight size={16} /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;

