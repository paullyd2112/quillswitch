
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
          description="Last updated: May 1, 2025"
          centered={true}
        >
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>
                Last updated: May 1, 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] rounded-md border p-4">
                <div className="space-y-6">
                  <section>
                    <h3 className="text-lg font-medium">1. Introduction</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This Privacy Policy explains how we collect, use, store, protect, and share your personal data. 
                      We are committed to ensuring the privacy and security of your data in compliance with the General 
                      Data Protection Regulation (GDPR) and other applicable data protection laws.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">2. Data Controller</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The Data Controller responsible for your personal data is:
                      <br />
                      Company Name: QuillSwitch Inc.
                      <br />
                      Address: 123 Tech Avenue, San Francisco, CA 94105
                      <br />
                      Email: privacy@quillswitch.com
                      <br />
                      Our Data Protection Officer can be contacted at: dpo@quillswitch.com
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">3. Data We Collect</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We collect and process the following categories of personal data:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>Identity data (name, username)</li>
                      <li>Contact data (email address, telephone number)</li>
                      <li>Profile data (preferences, feedback, survey responses)</li>
                      <li>Technical data (IP address, login data, browser type and version)</li>
                      <li>Usage data (information about how you use our website and services)</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">4. How We Use Your Data</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We use your personal data for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>To provide and maintain our services</li>
                      <li>To notify you about changes to our services</li>
                      <li>To allow you to participate in interactive features of our services</li>
                      <li>To provide customer support</li>
                      <li>To gather analysis or valuable information to improve our services</li>
                      <li>To monitor the usage of our services</li>
                      <li>To detect, prevent and address technical issues</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">5. Legal Basis for Processing</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We process your personal data based on the following legal grounds:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>Your consent</li>
                      <li>Performance of a contract with you</li>
                      <li>Compliance with a legal obligation</li>
                      <li>Protection of your vital interests</li>
                      <li>Performance of a task carried out in the public interest</li>
                      <li>Our legitimate interests, provided your interests and fundamental rights do not override those interests</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">6. Data Retention</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We will retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy. 
                      We will retain and use your personal data to the extent necessary to comply with our legal obligations, resolve disputes, 
                      and enforce our legal agreements and policies.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">7. Data Transfer</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your personal data may be transferred to — and maintained on — computers located outside of your state, province, 
                      country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. 
                      If you are located outside the United States and choose to provide information to us, please note that we transfer 
                      the data, including personal data, to the United States and process it there.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We ensure that any such transfer complies with applicable data protection laws and that your data is protected as 
                      outlined in this Privacy Policy. When we transfer your data outside the European Economic Area (EEA), we use 
                      standard contractual clauses approved by the European Commission.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">8. Your Data Protection Rights</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Under the GDPR, you have the following rights:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                      <li><strong>Right to access</strong> - You have the right to request copies of your personal data.</li>
                      <li><strong>Right to rectification</strong> - You have the right to request that we correct any information you believe is inaccurate or incomplete.</li>
                      <li><strong>Right to erasure</strong> - You have the right to request that we erase your personal data, under certain conditions.</li>
                      <li><strong>Right to restrict processing</strong> - You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                      <li><strong>Right to object to processing</strong> - You have the right to object to our processing of your personal data, under certain conditions.</li>
                      <li><strong>Right to data portability</strong> - You have the right to request that we transfer the data we have collected to another organization, or directly to you, under certain conditions.</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">9. Cookies</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
                      You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do 
                      not accept cookies, you may not be able to use some portions of our service.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      For more information about the cookies we use, please see our Cookie Policy.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">10. Data Security</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      The security of your data is important to us, but remember that no method of transmission over the Internet, 
                      or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect 
                      your personal data, we cannot guarantee its absolute security.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">11. Changes to This Privacy Policy</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy 
                      Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
                    </p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">12. Contact Us</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      If you have any questions about this Privacy Policy, please contact us:
                      <br />
                      By email: privacy@quillswitch.com
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

export default PrivacyPolicyPage;
