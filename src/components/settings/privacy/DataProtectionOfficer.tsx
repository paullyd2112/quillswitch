
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Calendar, FileText, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DataProtectionOfficer: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Protection Officer</CardTitle>
        <CardDescription>
          Contact information and responsibilities of the company's DPO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="border rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">Founder's Name</h3>
                  <p className="text-sm text-muted-foreground">Data Protection Officer</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    Appointed: January 1, 2025
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact via support channel
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">Contact DPO</Button>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 space-y-6">
              <div>
                <h3 className="font-medium mb-2">DPO Responsibilities</h3>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  <li>Monitor compliance with the GDPR and other data protection laws</li>
                  <li>Inform and advise the organization on data protection obligations</li>
                  <li>Provide advice regarding Data Protection Impact Assessments</li>
                  <li>Serve as contact point for data subjects on privacy matters</li>
                  <li>Act as a contact point for supervisory authorities</li>
                  <li>Maintain expert knowledge of data protection law and practices</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Independence and Reporting Structure</h3>
                <p className="text-sm text-muted-foreground">
                  In accordance with GDPR requirements, our DPO:
                </p>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1 mt-2">
                  <li>Reports directly to the highest level of management</li>
                  <li>Operates independently without receiving instructions on how to perform tasks</li>
                  <li>Cannot be dismissed or penalized for performing DPO duties</li>
                  <li>Has access to all necessary resources to fulfill their role</li>
                </ul>
              </div>
              
              <div className="border rounded-md p-4 bg-muted">
                <div className="flex gap-2 mb-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">DPO Office Hours</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  The DPO is available for consultation during the following hours:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Monday - Friday</p>
                    <p className="text-muted-foreground">9:00 AM - 5:00 PM (PST)</p>
                  </div>
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-muted-foreground">Within 48 hours</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  DPO Appointment Letter
                </Button>
                <Button variant="outline" className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Data Protection Policy
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-sm text-muted-foreground">
            <p>
              Under GDPR Article 37, the appointment of a Data Protection Officer is mandatory for:
            </p>
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>Public authorities</li>
              <li>Organizations whose core activities require regular and systematic monitoring of individuals on a large scale</li>
              <li>Organizations whose core activities consist of processing special categories of data on a large scale</li>
            </ul>
            <p className="mt-2">
              Even when not legally required, appointing a DPO demonstrates commitment to data protection and accountability.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataProtectionOfficer;
