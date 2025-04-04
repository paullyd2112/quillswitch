
import React from "react";
import MigrationHeader from "../MigrationHeader";
import { Database } from "lucide-react";

type MigrationHeaderSectionProps = {
  sourceTitle: string;
  destinationTitle: string;
}

const MigrationHeaderSection = ({ sourceTitle, destinationTitle }: MigrationHeaderSectionProps) => {
  return (
    <>
      <MigrationHeader 
        title={sourceTitle} 
        type="source" 
        icon={<Database size={20} />} 
      />
      <MigrationHeader 
        title={destinationTitle} 
        type="destination" 
        icon={<Database size={20} />} 
      />
    </>
  );
};

export default MigrationHeaderSection;
