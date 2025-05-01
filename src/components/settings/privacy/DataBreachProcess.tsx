
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const DataBreachProcess: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          <div>
            <CardTitle>Data Breach Notification Process</CardTitle>
            <CardDescription>
              Procedure for handling and reporting data breaches within 72 hours
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <h3 className="font-medium mb-2">Data Breach Response Team</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Data Protection Officer:</strong> [Founder's Name] (dpo@quillswitch.com)<br />
              <strong>Security Officer:</strong> security@quillswitch.com<br />
              <strong>Legal Counsel:</strong> legal@quillswitch.com<br />
              <strong>IT Support:</strong> it-security@quillswitch.com<br />
              <strong>Communications:</strong> communications@quillswitch.com
            </p>
          </div>
          
          <h3 className="font-medium">Breach Notification Timeline</h3>
          <ol className="space-y-4 mt-2">
            <li className="flex">
              <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-primary text-primary mr-3">
                1
              </div>
              <div>
                <h4 className="font-medium">Detection & Internal Reporting</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Any employee who discovers a potential data breach must immediately report it to the Data Protection Officer and Security Officer.
                </p>
              </div>
            </li>
            
            <li className="flex">
              <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-primary text-primary mr-3">
                2
              </div>
              <div>
                <h4 className="font-medium">Assessment & Containment (Within 24 hours)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The breach response team will assess the nature, scope, and likely impact of the breach. 
                  Immediate containment actions will be taken to limit further exposure of data.
                </p>
              </div>
            </li>
            
            <li className="flex">
              <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-primary text-primary mr-3">
                3
              </div>
              <div>
                <h4 className="font-medium">Authority Notification (Within 72 hours)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  If the breach poses a risk to individuals' rights and freedoms, the DPO will notify the relevant 
                  supervisory authority (e.g., ICO in the UK, local DPA in EU) within 72 hours of becoming aware of the breach.
                </p>
              </div>
            </li>
            
            <li className="flex">
              <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-primary text-primary mr-3">
                4
              </div>
              <div>
                <h4 className="font-medium">Affected Individual Notification (Without undue delay)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  If the breach is likely to result in a high risk to individuals' rights and freedoms, 
                  the affected individuals will be notified without undue delay.
                </p>
              </div>
            </li>
            
            <li className="flex">
              <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-primary text-primary mr-3">
                5
              </div>
              <div>
                <h4 className="font-medium">Documentation & Review</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  All breaches are documented in our breach register, including facts, effects, and remedial actions taken. 
                  Post-breach review to identify improvements to security and response procedures.
                </p>
              </div>
            </li>
          </ol>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <h3 className="font-medium">Notification Requirements</h3>
            <p className="text-sm text-muted-foreground">
              Data breach notifications to authorities must include:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
              <li>Nature of the breach and approximate number of individuals affected</li>
              <li>Name and contact details of the Data Protection Officer</li>
              <li>Likely consequences of the breach</li>
              <li>Measures taken or proposed to address the breach and mitigate potential adverse effects</li>
            </ul>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Run Breach Simulation
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Procedure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataBreachProcess;
