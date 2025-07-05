
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BaseLayout from "@/components/layout/BaseLayout";
import ContentSection from "@/components/layout/ContentSection";

const TermsOfServicePage: React.FC = () => {
  return (
    <BaseLayout>
      <div className="min-h-screen pt-24 pb-16 bg-background">
        <ContentSection
          title="Terms of Service"
          description="Last updated: January 5, 2025"
          centered={true}
        >
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Terms of Service</CardTitle>
              <CardDescription>
                Last updated: January 5, 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">1. Acceptance of Terms</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      By accessing or using QuillSwitch's CRM migration services ("Services"), you ("Customer" or "you") 
                      acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). 
                      If you do not agree with any part of these terms, you may not use our Services. These Terms constitute 
                      a legally binding agreement between you and QuillSwitch, Inc. ("we," "us," or "QuillSwitch").
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">2. Service Description</h3>
                    <p className="mt-2 text-sm text-muted-foreground mb-2">
                      QuillSwitch provides AI-powered CRM data migration services for Small-to-Medium Businesses (SMBs) 
                      and Mid-Market companies. Our Services include:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>CRM Data Migration:</strong> Secure transfer of data between CRM systems</li>
                      <li><strong>AI-Powered Data Mapping:</strong> Automated field mapping with 99.9% accuracy using advanced AI</li>
                      <li><strong>Dashboard Recreation:</strong> Recreation of dashboards, reports, and visualizations in destination systems</li>
                      <li><strong>Data Validation:</strong> Comprehensive validation and error checking throughout the migration process</li>
                      <li><strong>Migration Support:</strong> Expert guidance and technical support throughout the migration</li>
                      <li><strong>Security & Compliance:</strong> Enterprise-grade security with encrypted data handling</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">3. Service Packages & Pricing</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">3.1 Essential Package - $999</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>Up to 250,000 records migration</li>
                      <li>AI-powered data mapping and transformation</li>
                      <li>Standard support and documentation</li>
                      <li>Complete data migration including contacts, accounts, opportunities, activities, tasks, notes, and documents</li>
                      <li>Dashboard recreation (standard configurations)</li>
                    </ul>

                    <h4 className="text-base font-medium mt-4 mb-2">3.2 Pro Package - Contact for Pricing</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>250,000+ records migration</li>
                      <li>Priority processing and dedicated migration specialist</li>
                      <li>Complex transformation support and custom mapping rules</li>
                      <li>Advanced AI mapping with custom configurations</li>
                      <li>White-glove service and expedited timeline</li>
                    </ul>

                    <p className="text-sm text-muted-foreground mt-3">
                      All prices are in USD and exclude applicable taxes. Payment is processed securely through Stripe.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">4. User Account & Responsibilities</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">4.1 Account Requirements</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      You must create an account to use our Services. You are responsible for maintaining the confidentiality 
                      of your account credentials and for all activities under your account.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">4.2 Customer Responsibilities</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>Data Access:</strong> Provide necessary access credentials and permissions for source and destination CRM systems</li>
                      <li><strong>Data Backup:</strong> Maintain current backups of all data before migration</li>
                      <li><strong>Data Quality:</strong> Ensure source data is reasonably clean and well-structured</li>
                      <li><strong>System Access:</strong> Maintain active subscriptions and access to both source and destination CRM systems during migration</li>
                      <li><strong>Testing:</strong> Thoroughly test migrated data and report any issues within 30 days of migration completion</li>
                      <li><strong>Compliance:</strong> Ensure you have legal authority to migrate the data and comply with all applicable laws</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">5. Payment Terms</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>Payment Processing:</strong> All payments are processed securely through Stripe</li>
                      <li><strong>Essential Package:</strong> Payment due in full before migration commencement</li>
                      <li><strong>Pro Package:</strong> Custom payment terms as agreed in writing</li>
                      <li><strong>Refund Policy:</strong> Refunds available within 14 days if migration has not commenced</li>
                      <li><strong>Taxes:</strong> Customer responsible for all applicable taxes and fees</li>
                      <li><strong>Currency:</strong> All prices quoted in US Dollars (USD)</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">6. Data Migration Disclaimers</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">6.1 Migration Accuracy</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      While we strive for 99.9% accuracy in data mapping and migration, we cannot guarantee perfect accuracy 
                      for all data types and configurations. Customer is responsible for validating migrated data.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">6.2 Third-Party System Dependencies</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Our Services depend on third-party CRM systems' APIs and availability. We are not responsible for 
                      limitations, downtime, or changes to third-party systems that may affect migration.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">6.3 Data Limitations</h4>
                    <p className="text-sm text-muted-foreground">
                      Some data types, custom configurations, or deprecated features may not be fully transferable between 
                      different CRM systems due to platform limitations.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">7. AI Services Disclaimer</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Our AI-powered data mapping uses Google Gemini AI and proprietary algorithms. While highly accurate, 
                      AI services may occasionally produce unexpected results. We recommend reviewing all AI-generated mappings 
                      before proceeding with migration. Customer retains final responsibility for approving all data transformations.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">8. Data Security & Privacy</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We implement enterprise-grade security measures including pgsodium encryption, Row Level Security (RLS), 
                      OAuth 2.0 authentication, and secure API connections. Our data handling practices are governed by our 
                      Privacy Policy, incorporated herein by reference. We maintain SOC 2 compliance standards and undergo 
                      regular security audits.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">9. Service Availability</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>Uptime:</strong> We strive for 99.9% platform availability but do not guarantee uninterrupted service</li>
                      <li><strong>Maintenance:</strong> Scheduled maintenance will be communicated at least 48 hours in advance</li>
                      <li><strong>Support:</strong> Customer support available during business hours with 24-hour response time</li>
                      <li><strong>Migration Timeline:</strong> Typical migrations complete within hours to days, not months</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">10. Limitation of Liability</h3>
                    <p className="mt-2 text-sm text-muted-foreground mb-2">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>QuillSwitch's total liability shall not exceed the amount paid for the specific Service</li>
                      <li>We are not liable for indirect, incidental, special, consequential, or punitive damages</li>
                      <li>We are not liable for loss of profits, revenue, data, or business opportunities</li>
                      <li>Customer assumes responsibility for data validation and business continuity planning</li>
                      <li>We are not liable for issues arising from third-party CRM system limitations or changes</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">11. Indemnification</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Customer agrees to defend, indemnify, and hold harmless QuillSwitch from claims arising from: 
                      (a) Customer's use of the Services, (b) Customer's violation of these Terms, (c) Customer's violation 
                      of any rights of third parties, or (d) any data provided by Customer for migration.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">12. Intellectual Property</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>QuillSwitch IP:</strong> All platform technology, algorithms, and proprietary methods remain our exclusive property</li>
                      <li><strong>Customer Data:</strong> Customer retains all rights to their data and CRM content</li>
                      <li><strong>AI Training:</strong> We do not use Customer data to train AI models without explicit consent</li>
                      <li><strong>License:</strong> We grant Customer a limited license to use our Services as described herein</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">13. Account Termination</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>By Customer:</strong> Account may be terminated at any time with 30 days' notice</li>
                      <li><strong>By QuillSwitch:</strong> We may terminate accounts for breach of Terms or illegal activity</li>
                      <li><strong>Data Retention:</strong> Customer data deleted within 30 days of account termination</li>
                      <li><strong>Service Completion:</strong> Ongoing migrations will be completed unless Customer requests termination</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">14. Changes to Terms</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We may modify these Terms with 30 days' notice for material changes. Continued use of Services after 
                      changes constitutes acceptance. For non-material changes, we will update the "Last Updated" date. 
                      Current Terms are always available on our platform.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">15. Governing Law & Dispute Resolution</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      These Terms are governed by the laws of the State of California, USA, without regard to conflict of law 
                      principles. Any disputes will be resolved through binding arbitration in California, except for claims 
                      involving intellectual property which may be brought in federal court.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">16. Contact Information</h3>
                    <p className="mt-2 text-sm text-muted-foreground mb-2">
                      For questions about these Terms of Service:
                    </p>
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>Legal Team:</strong> legal@quillswitch.com<br/>
                        <strong>Customer Support:</strong> support@quillswitch.com<br/>
                        <strong>Sales Inquiries:</strong> sales@quillswitch.com<br/>
                        <strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM PST
                      </p>
                    </div>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </ContentSection>
      </div>
    </BaseLayout>
  );
};

export default TermsOfServicePage;
