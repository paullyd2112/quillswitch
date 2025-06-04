
import React, { useState, useMemo } from "react";
import SavingsCalculatorHeader from "./SavingsCalculatorHeader";
import SavingsInputsCard from "./SavingsInputsCard";
import SavingsResultsCard from "./SavingsResultsCard";
import SavingsAssumptionsCard from "./SavingsAssumptionsCard";
import { CalculatorInputs } from "./types";
import { calculateSavings } from "./utils";

const SavingsCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    migrationWeeks: 12,
    useConsultant: true,
    consultantRate: 125,
    consultantHours: 100,
    internalStaff: 2,
    internalStaffRate: 75, // Default value for internal staff rate
    oldCrmCost: 1000,
    newCrmCost: 400,
  });

  const results = useMemo(() => calculateSavings(inputs), [inputs]);

  return (
    <div className="space-y-8">
      <SavingsCalculatorHeader />

      <div className="grid gap-8 lg:grid-cols-2">
        <SavingsInputsCard
          inputs={inputs}
          onInputsChange={setInputs}
          monthlyCrmSavings={results.monthlyCrmSavings}
        />

        <SavingsResultsCard results={results} />
      </div>

      <SavingsAssumptionsCard />
    </div>
  );
};

export default SavingsCalculator;
