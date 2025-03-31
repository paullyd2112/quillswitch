
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
                  At QuillSwitch, we are dedicated to simplifying data migration processes for businesses of all sizes. 
                  Our platform empowers organizations to seamlessly transition between systems without the typical 
                  headaches and technical challenges that come with data migrations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Our Story</h3>
                <p className="text-muted-foreground">
                  Founded in 2023, QuillSwitch was born from the realization that data migration remains 
                  one of the most challenging aspects of adopting new technologies. Our team of experts has 
                  combined years of experience in database management, cloud computing, and enterprise software 
                  to create a solution that makes migrations intuitive and reliable.
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
