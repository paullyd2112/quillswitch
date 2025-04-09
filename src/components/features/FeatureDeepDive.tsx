
import React from "react";
import FeatureDetailCard from "./FeatureDetailCard";
import { Wand2, GitMerge, ListChecks, BellRing, FileBarChart2 } from "lucide-react";

const FeatureDeepDive = () => {
  const featureDetails = [
    {
      icon: <Wand2 size={32} className="text-brand-500 mb-4" />,
      title: "Intelligent Field Mapping",
      description: "Our AI-powered field mapping technology intelligently maps fields between different CRM systems, saving hours of manual configuration.",
      benefits: [
        "Automatically detects standard field mappings across platforms",
        "Suggests mappings for custom fields based on data patterns",
        "Learns from previous migrations to improve accuracy"
      ],
      isReversed: false
    },
    {
      icon: <GitMerge size={32} className="text-brand-500 mb-4" />,
      title: "Delta Synchronization",
      description: "Keep your CRM systems in sync with intelligent delta synchronization that only transfers what's changed.",
      benefits: [
        "Scheduled synchronization on custom intervals",
        "Change detection across contacts, accounts, and opportunities",
        "Conflict resolution with customizable rules"
      ],
      isReversed: true
    },
    {
      icon: <ListChecks size={32} className="text-brand-500 mb-4" />,
      title: "Data Validation & Quality",
      description: "Ensure data quality with robust validation tools that catch issues before they impact your business.",
      benefits: [
        "Customizable validation rules for different data types",
        "Pre-migration data quality assessments",
        "Issue correction workflows"
      ],
      isReversed: false
    },
    {
      icon: <BellRing size={32} className="text-brand-500 mb-4" />,
      title: "Real-time Notifications",
      description: "Stay informed about migration progress with real-time notifications through multiple channels.",
      benefits: [
        "Email, SMS, and in-app notifications",
        "Webhooks for integration with other systems",
        "Customizable notification thresholds and events"
      ],
      isReversed: true
    },
    {
      icon: <FileBarChart2 size={32} className="text-brand-500 mb-4" />,
      title: "Advanced Analytics",
      description: "Gain insights into your migration performance with detailed analytics and customizable dashboards.",
      benefits: [
        "Migration speed and performance metrics",
        "Data volume and transformation analytics",
        "Custom report generation and scheduling"
      ],
      isReversed: false
    }
  ];

  return (
    <section className="py-16 px-4 md:px-6 bg-slate-950">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-white">Feature Deep Dive</h2>
        
        {featureDetails.map((feature, index) => (
          <FeatureDetailCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            benefits={feature.benefits}
            isReversed={feature.isReversed}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureDeepDive;
