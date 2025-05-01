
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyDocumentsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Policy & Terms</CardTitle>
        <CardDescription>
          Review our legal documents and privacy practices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Privacy Policy</h3>
                  <p className="text-sm text-muted-foreground">Last updated: May 1, 2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/privacy">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Terms of Service</h3>
                  <p className="text-sm text-muted-foreground">Last updated: May 1, 2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/terms">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Data Processing Agreement</h3>
                  <p className="text-sm text-muted-foreground">Last updated: January 10, 2023</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/privacy?section=data-processing">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyDocumentsCard;
