
import React from "react";
import Navbar from "@/components/layout/Navbar";
import ContentSection from "@/components/layout/ContentSection";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentSection 
          title="About QuillSwitch"
          description="Learn more about our mission, values, and the team behind QuillSwitch."
          centered
        >
          <div className="grid gap-8 mt-10">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  QuillSwitch simplifies CRM migrations with our API-driven platform, giving businesses of all sizes 
                  the tools and control to seamlessly move their data, without the need for costly and time-consuming consultants.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Our Story</h3>
                <p className="text-muted-foreground">
                  Like many businesses, we were promised a smooth, strategic CRM upgrade when we switched from our previous CRM to a different one. 
                  Instead, we found ourselves navigating treacherous waters, drowning in the frustrating inefficiency of 
                  exorbitant consultant fees and labyrinthine managed service packages. We felt trapped and disappointed.
                  What should have been a step forward became a costly, draining ordeal, a financial shipwreck of our 
                  strategic vision. We knew there had to be a lifeline for businesses caught in this storm, a way to cut 
                  through the red tape and bring sanity back to the process.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Our Technology</h3>
                <p className="text-muted-foreground">
                  QuillSwitch leverages cutting-edge technologies to ensure accurate, secure, and efficient 
                  data transfers. Our platform utilizes intelligent mapping algorithms, comprehensive validation checks, 
                  and real-time monitoring to guarantee that your data arrives intact and properly structured.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                <p className="text-muted-foreground">
                  Have questions or want to learn more about how QuillSwitch can help your organization?
                  Reach out to our team at <span className="text-brand-600">contact@quillswitch.com</span> or
                  visit our headquarters at 1234 Innovation Way, Tech City, CA 94043.
                </p>
              </CardContent>
            </Card>
          </div>
        </ContentSection>
      </div>
    </div>
  );
};

export default About;
