
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import MappingSuggestionRow from "./MappingSuggestionRow";
import { MappingSuggestion } from "./types";

interface MappingSuggestionsTableProps {
  suggestions: MappingSuggestion[];
}

const MappingSuggestionsTable: React.FC<MappingSuggestionsTableProps> = ({ suggestions }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source Field</TableHead>
            <TableHead className="w-[50px] text-center"></TableHead>
            <TableHead>Destination Field</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-center">Required</TableHead>
            <TableHead className="text-center">Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suggestions.map((suggestion, index) => (
            <MappingSuggestionRow key={index} suggestion={suggestion} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MappingSuggestionsTable;
