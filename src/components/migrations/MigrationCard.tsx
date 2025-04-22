
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Database, ArrowRightCircle } from "lucide-react";

interface MigrationCardProps {
  isCreateCard?: boolean;
}

const MigrationCard = ({ isCreateCard = false }: MigrationCardProps) => {
  const navigate = useNavigate();

  if (isCreateCard) {
    return (
      <Card 
        className="relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow duration-200"
        onClick={() => navigate("/migrations/setup")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 opacity-50"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Create New Migration
          </CardTitle>
          <CardDescription>
            Set up a new CRM data migration project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Database className="h-16 w-16 text-muted-foreground/50 group-hover:text-primary transition-colors duration-200" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div></div>
          <Button variant="ghost" className="gap-2 group-hover:text-primary transition-colors duration-200">
            <span>Get Started</span>
            <ArrowRightCircle className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
};

export default MigrationCard;
