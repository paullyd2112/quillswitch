
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
                    <h3 className="text-lg font-medium">Welcome to QuillSwitch!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This Terms of Service ("Terms") is a binding contract between you ("Customer," "you," or "your") 
                      and QuillSwitch Inc. ("QuillSwitch," "we," or "us"). This Agreement governs your access to and use 
                      of the QuillSwitch data migration services, our website, and any associated software (collectively, the "Service").
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <strong>By purchasing a plan or using the Service, you agree to be bound by these Terms.</strong>
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">1. Description of Service</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      QuillSwitch provides a cloud-based, self-service platform that enables customers to migrate data 
                      between various third-party Customer Relationship Management (CRM) systems. The Service utilizes 
                      a Unified API Integration and AI-powered schema mapping to facilitate the transfer of Customer Data 
                      from a source CRM to a destination CRM.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">2. User Accounts & Responsibilities</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">Account Creation</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      You must provide accurate and complete information to create an account. You are responsible for 
                      maintaining the confidentiality of your account credentials.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">Authorized Users</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      You are responsible for all activity that occurs under your account, including that of any users you authorize.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">Your Responsibilities</h4>
                    <p className="text-sm text-muted-foreground mb-2">You agree to:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>Comply with all applicable laws and regulations in your use of the Service.</li>
                      <li>Be solely responsible for the accuracy, quality, and legality of your Customer Data and the means by which you acquired it.</li>
                      <li>Secure and maintain the necessary API keys, tokens, and permissions from your third-party CRM providers to allow the Service to function.</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">3. Fees and Payment</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">Service Plans</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      The Service is offered via two distinct, one-time payment plans: the "Standard" plan at $999 and 
                      the "Pro" plan at $2499. The features included in each plan are detailed on our website.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">Payment</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      All fees are due upfront at the time of purchase. Payments are processed through a third-party 
                      payment processor. All fees are quoted in U.S. Dollars.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">No Refunds</h4>
                    <p className="text-sm text-muted-foreground">
                      All payments are final and non-refundable. As a self-service tool where value is delivered upon use, 
                      we do not offer refunds once a migration has been initiated or after 14 days from the purchase date, 
                      whichever comes first.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">4. Intellectual Property Rights</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">QuillSwitch IP</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      We retain all rights, title, and interest in and to the Service, including our website, branding, 
                      AI-powered mapping algorithms, Unified API architecture, and all related software and technology. 
                      This Agreement does not grant you any rights to our intellectual property except for the limited 
                      right to use the Service as described.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">Customer Data</h4>
                    <p className="text-sm text-muted-foreground">
                      You retain all rights, title, and interest in and to your data, including all contacts, accounts, 
                      opportunities, and other information you migrate using the Service ("Customer Data"). You grant 
                      QuillSwitch a limited, non-exclusive, worldwide, royalty-free license to access, use, copy, and 
                      process your Customer Data solely for the purpose of providing and improving the Service.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">5. Acceptable Use Policy</h3>
                    <p className="text-sm text-muted-foreground mb-2">You agree not to use the Service to:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>Migrate any data that is unlawful, harmful, or infringes on the intellectual property rights of others.</li>
                      <li>Reverse-engineer, decompile, or otherwise attempt to discover the source code of the Service.</li>
                      <li>Use any automated means (e.g., spiders, robots) to access the Service for any purpose other than as intended.</li>
                      <li>Transmit any viruses, worms, or other malicious software.</li>
                      <li>Overload or disrupt the integrity or performance of the Service or its underlying infrastructure.</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">6. Data Migration & Security</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">Your Responsibility</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      You acknowledge that you are the "Data Controller" of your Customer Data. You are solely responsible 
                      for its content and for ensuring you have the legal right to migrate it.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">Our Role</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      QuillSwitch acts as a "Data Processor," processing data on your behalf and at your direction.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">No Permanent Storage</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      The Service is a conduit for data migration. We do not permanently store your Customer Data. Any 
                      cached Customer Data necessary for the migration process is deleted from our servers within 30 days 
                      of the completion or termination of your migration project. See our Privacy Policy for more details.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">Security</h4>
                    <p className="text-sm text-muted-foreground">
                      We implement robust technical and organizational measures, such as end-to-end encryption, to protect 
                      the security and integrity of your data during the migration process.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">7. Limitation of Liability</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL QUILLSWITCH, ITS AFFILIATES, OR THEIR 
                      DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, OR 
                      CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN ANY WAY 
                      CONNECTED WITH THE USE OF THE SERVICE.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      OUR TOTAL AGGREGATE LIABILITY IN ANY MATTER ARISING OUT OF OR RELATED TO THESE TERMS IS LIMITED TO 
                      THE AMOUNT YOU PAID FOR THE SERVICE.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">8. Disclaimers</h3>
                    <p className="text-sm text-muted-foreground">
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." QUILLSWITCH MAKES NO WARRANTIES, WHETHER EXPRESS, 
                      IMPLIED, OR STATUTORY, REGARDING THE SERVICE, INCLUDING ANY WARRANTY THAT THE SERVICE WILL BE 
                      UNINTERRUPTED OR ERROR-FREE. WHILE OUR AI PROVIDES MAPPING SUGGESTIONS, YOU ARE ULTIMATELY RESPONSIBLE 
                      FOR VALIDATING THE ACCURACY OF YOUR DATA MIGRATION.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">9. Term and Termination</h3>
                    
                    <h4 className="text-base font-medium mt-4 mb-2">Term</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      This Agreement begins when you purchase a plan and continues until your one-time migration is complete or terminated.
                    </p>

                    <h4 className="text-base font-medium mt-4 mb-2">Termination</h4>
                    <p className="text-sm text-muted-foreground">
                      We may terminate or suspend your access to the Service immediately, without prior notice, for any 
                      material breach of these Terms, including failure to comply with the Acceptable Use Policy.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">10. Governing Law & Contact</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      This Agreement shall be governed by the laws of the State of California, without regard to its 
                      conflict of law principles. Any questions about these Terms should be addressed to:
                    </p>
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <p className="text-sm">
                        <strong>QuillSwitch Inc.</strong><br/>
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

export default TermsOfServicePage;
