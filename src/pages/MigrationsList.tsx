
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import MigrationsTable from "@/components/migrations/MigrationsTable";
import { mockMigrations } from "@/assets/mockData";
import BaseLayout from "@/components/layout/BaseLayout";

const MigrationsList = () => {
  return (
    <BaseLayout>
      <div className="container px-4 py-8 mx-auto max-w-7xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Migrations</h1>
          <Link to="/app/migrations/setup">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Migration
            </Button>
          </Link>
        </div>
        
        <MigrationsTable 
          projects={mockMigrations}
          isLoading={false}
        />
      </div>
    </BaseLayout>
  );
};

export default MigrationsList;
