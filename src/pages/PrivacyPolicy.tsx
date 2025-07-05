
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BaseLayout from "@/components/layout/BaseLayout";
import ContentSection from "@/components/layout/ContentSection";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <BaseLayout>
      <div className="min-h-screen pt-24 pb-16 bg-background">
        <ContentSection
          title="Privacy Policy"
          description="Last updated: July 4, 2025"
          centered={true}
        >
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>
                Last updated: July 4, 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">1. Introduction</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      QuillSwitch ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                      explains how we collect, use, disclose, and safeguard your information when you use our CRM data 
                      migration services and platform. We handle highly sensitive business data and maintain enterprise-grade 
                      security standards throughout all our operations.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">2. Data Controller Information</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The Data Controller responsible for your personal data is:
                    </p>
                    <div className="bg-slate-800 p-3 rounded-lg mt-2">
                      <p className="text-sm">
                        <strong>Company:</strong> QuillSwitch, Inc.<br/>
                        <strong>Email:</strong> privacy@quillswitch.com<br/>
                        <strong>Data Protection Officer:</strong> dpo@quillswitch.com<br/>
                        <strong>Response Time:</strong> We respond to privacy inquiries within 72 hours
                      </p>
                    </div>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">3. Information We Collect</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">3.1 Account & Contact Information</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>Name, email address, company name, and role</li>
                      <li>Account credentials (encrypted and secured)</li>
                      <li>Payment information (processed securely through Stripe)</li>
                      <li>Communication preferences and support interactions</li>
                    </ul>

                    <h4 className="text-base font-medium mt-4 mb-2">3.2 CRM & Business Data</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>CRM system credentials (encrypted using pgsodium enterprise-grade encryption)</li>
                      <li>CRM data: contacts, accounts, opportunities, activities, tasks, notes, documents</li>
                      <li>Custom fields, dashboards, reports, and workflow configurations</li>
                      <li>Data mapping configurations and transformation rules</li>
                      <li>Migration logs, error reports, and performance metrics</li>
                    </ul>

                    <h4 className="text-base font-medium mt-4 mb-2">3.3 Technical & Usage Data</h4>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>Platform usage analytics and interaction patterns</li>
                      <li>AI mapping and transformation history</li>
                      <li>System performance data and error diagnostics</li>
                      <li>IP addresses, browser information, and device data</li>
                      <li>Chatbot conversation data (for support improvement)</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">4. How We Use Your Information</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>CRM Migration Services:</strong> Process and migrate your data between CRM systems</li>
                      <li><strong>AI-Powered Data Mapping:</strong> Use Google Gemini AI to automatically map and transform data with 99.9% accuracy</li>
                      <li><strong>Dashboard Recreation:</strong> Recreate dashboards, reports, and visualizations in destination systems</li>
                      <li><strong>Security & Monitoring:</strong> Detect unauthorized access, prevent data breaches, and maintain audit logs</li>
                      <li><strong>Customer Support:</strong> Provide technical assistance and troubleshoot migration issues</li>
                      <li><strong>Service Improvement:</strong> Analyze usage patterns to enhance platform performance and features</li>
                      <li><strong>Billing & Account Management:</strong> Process payments and manage subscriptions</li>
                      <li><strong>Legal Compliance:</strong> Meet regulatory requirements and enforce our terms</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">5. Data Security & Protection</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">5.1 Enterprise-Grade Encryption</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      We use pgsodium encryption to protect all sensitive data at rest. All CRM credentials and business data 
                      are encrypted using advanced cryptographic methods before storage.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">5.2 Access Controls & Authentication</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      We implement Row Level Security (RLS) ensuring you can only access your own data. OAuth 2.0 is used 
                      for secure CRM connections. Multi-factor authentication and session management protect account access.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">5.3 Infrastructure Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Our platform runs on Supabase with enterprise-grade infrastructure, automated security monitoring, 
                      regular security audits, and 24/7 threat detection systems.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">6. Third-Party Services</h3>
                    <p className="text-sm text-muted-foreground mb-2">We integrate with these third-party services:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>Supabase:</strong> Database hosting, authentication, and infrastructure services</li>
                      <li><strong>Google Gemini AI:</strong> AI-powered data mapping and intelligent chatbot functionality</li>
                      <li><strong>Stripe:</strong> Secure payment processing (PCI DSS compliant)</li>
                      <li><strong>CRM Providers:</strong> Direct API connections to your source and destination systems</li>
                      <li><strong>Cloud Storage:</strong> Encrypted document storage and migration services</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      We maintain data processing agreements with all third-party providers to ensure your data protection 
                      rights are preserved.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">7. Data Retention Periods</h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>Account Data:</strong> Retained while your account is active and for 12 months after closure</li>
                      <li><strong>CRM Migration Data:</strong> Processed during migration and securely deleted within 30 days after completion</li>
                      <li><strong>Encrypted Credentials:</strong> Deleted immediately upon request or account termination</li>
                      <li><strong>Migration Logs:</strong> Retained for 12 months for support and compliance purposes</li>
                      <li><strong>Payment Records:</strong> Retained for 7 years for tax and regulatory compliance</li>
                      <li><strong>Support Communications:</strong> Retained for 3 years for service improvement</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">8. Your Data Protection Rights</h3>
                    <p className="text-sm text-muted-foreground mb-2">Under GDPR and other privacy laws, you have these rights:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li><strong>Right to Access:</strong> Request copies of your personal data and migration history</li>
                      <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete information</li>
                      <li><strong>Right to Erasure:</strong> Request deletion of your data (with certain limitations)</li>
                      <li><strong>Right to Restrict Processing:</strong> Limit how we process your data</li>
                      <li><strong>Right to Data Portability:</strong> Export your data in a portable format</li>
                      <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                      <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      To exercise these rights, contact us at privacy@quillswitch.com. We will respond within 72 hours.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">9. International Data Transfers</h3>
                    <p className="text-sm text-muted-foreground">
                      Your data may be processed in the United States and other countries where our service providers operate. 
                      We ensure appropriate safeguards are in place for international transfers, including Standard Contractual 
                      Clauses approved by the European Commission and adequacy decisions where applicable.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">10. Business Transfers</h3>
                    <p className="text-sm text-muted-foreground">
                      In the event of a merger, acquisition, or sale of assets, your personal data may be transferred to the 
                      acquiring entity. We will provide notice before your data is transferred and becomes subject to a 
                      different Privacy Policy.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">11. Children's Privacy</h3>
                    <p className="text-sm text-muted-foreground">
                      Our services are designed for businesses and not intended for individuals under 18. We do not knowingly 
                      collect personal information from children under 18. If we discover we have collected such data, we will 
                      delete it immediately.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">12. Changes to This Privacy Policy</h3>
                    <p className="text-sm text-muted-foreground">
                      We may update this Privacy Policy to reflect changes in our practices or legal requirements. Material 
                      changes will be communicated via email or platform notification at least 30 days before taking effect. 
                      Continued use of our services after changes constitutes acceptance.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">13. Contact Us</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us at:
                    </p>
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>QuillSwitch Inc.</strong><br/>
                        Attn: Privacy Officer<br/>
                        1889 Harrison Street, #552<br/>
                        Oakland, CA 94612<br/>
                        <strong>Email:</strong> paul.aqua@quillswitch.com
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

export default PrivacyPolicyPage;
