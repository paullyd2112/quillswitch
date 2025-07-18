
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Support = () => {
  return (
    <BaseLayout>
      <div className="container max-w-5xl py-10">
        <h1 className="text-4xl font-bold mb-6">Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our support team is available Monday through Friday, 9am-5pm EST.
                We typically respond within 24 business hours.
              </p>
              <p className="font-medium">We're here to help with your migration questions</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Send Email</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Schedule a Call</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Need immediate assistance? Schedule a call with our support team
                to get help with your migration needs.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Book Appointment</Button>
            </CardFooter>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">How long does a typical CRM migration take?</h3>
            <p className="text-muted-foreground">
              Migration times vary based on the amount of data and complexity. Small migrations may complete in hours, 
              while large enterprise migrations might take a few days. The QuillSwitch dashboard provides real-time 
              estimates once your migration begins.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Is my data secure during migration?</h3>
            <p className="text-muted-foreground">
              Yes, QuillSwitch uses OAuth 2.0 for authentication and encrypts all credentials with pgsodium. 
              We never store your raw data - we only facilitate the transfer between your source and destination systems.
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-xl font-semibold mb-2">What happens if a migration fails?</h3>
            <p className="text-muted-foreground">
              If a migration encounters issues, QuillSwitch provides detailed error reports and will automatically 
              attempt to resume from the point of failure. Our support team can help diagnose and resolve any 
              persistent problems.
            </p>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Support;
