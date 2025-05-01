
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
          description="Last updated: May 1, 2025"
          centered={true}
        >
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Terms of Service</CardTitle>
              <CardDescription>
                Last updated: May 1, 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">1. Acceptance of Terms</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      By accessing and using QuillSwitch's services, you acknowledge that you have read, 
                      understood, and agree to be bound by these Terms of Service. If you do not agree with 
                      any part of these terms, you may not use our services.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">2. Description of Service</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      QuillSwitch provides data migration and integration services for businesses. Our services 
                      include, but are not limited to, CRM data migration, data mapping, data validation, 
                      and related consulting services.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">3. User Accounts</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      To use certain features of our services, you may be required to create an account. You are 
                      responsible for maintaining the confidentiality of your account credentials and for all 
                      activities that occur under your account. You agree to notify us immediately of any 
                      unauthorized use of your account.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">4. User Responsibilities</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      When using our services, you agree to:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>Provide accurate and complete information</li>
                      <li>Use the services only for lawful purposes</li>
                      <li>Not interfere with or disrupt the services or servers</li>
                      <li>Not attempt to gain unauthorized access to any part of the services</li>
                      <li>Comply with all applicable laws and regulations</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">5. Intellectual Property</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      All content, features, and functionality of our services, including but not limited to 
                      text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, 
                      and software, are the exclusive property of QuillSwitch or its licensors and are 
                      protected by copyright, trademark, and other intellectual property laws.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">6. Payment and Subscription</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Some of our services require payment. By subscribing to a paid service, you agree to 
                      pay all fees associated with the service. We may change our fees at any time, but will 
                      give you advance notice of these changes. You are responsible for paying all taxes 
                      associated with your use of our services.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">7. Data Privacy</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Our data privacy practices are governed by our Privacy Policy, which is incorporated 
                      into these Terms of Service by reference. By using our services, you consent to our 
                      collection, use, and sharing of information as described in our Privacy Policy.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">8. Limitation of Liability</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      To the maximum extent permitted by law, QuillSwitch shall not be liable for any 
                      indirect, incidental, special, consequential, or punitive damages, including but not 
                      limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, 
                      resulting from your use of or inability to use the service.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">9. Indemnification</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You agree to defend, indemnify, and hold harmless QuillSwitch, its officers, directors, 
                      employees, and agents, from and against any claims, liabilities, damages, losses, and 
                      expenses, including without limitation reasonable attorney fees and costs, arising out of 
                      or in any way connected with your access to or use of the services.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">10. Termination</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We may terminate or suspend your account and access to our services immediately, 
                      without prior notice or liability, for any reason, including but not limited to a breach 
                      of these Terms of Service. Upon termination, your right to use the services will cease 
                      immediately.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">11. Changes to Terms</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We reserve the right to modify or replace these Terms of Service at any time. If a 
                      revision is material, we will provide at least 30 days' notice prior to any new terms 
                      taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">12. Governing Law</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      These Terms of Service shall be governed by and construed in accordance with the laws 
                      of the United States and the State of California, without regard to its conflict of law 
                      principles.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">13. Contact Us</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      If you have any questions about these Terms of Service, please contact us:
                      <br />
                      By email: legal@quillswitch.com
                      <br />
                      By mail: 123 Tech Avenue, San Francisco, CA 94105
                    </p>
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
