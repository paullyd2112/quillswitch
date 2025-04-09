
import React from "react";
import FeatureCategory from "./FeatureCategory";
import {
  Database,
  ListChecks,
  Shield,
  Terminal,
  FileBarChart2,
  BellRing,
  Calendar,
  UserCheck,
  UploadCloud
} from "lucide-react";

const FeaturesCategories = () => {
  const featureCategories = [
    {
      icon: <Database size={42} />,
      title: "Core Migration",
      description: "Essential tools for seamless data transfer between CRM systems.",
      features: [
        "Automated field mapping with AI",
        "Delta syncs for ongoing updates",
        "Custom objects migration"
      ],
      linkTo: "/migrations/setup",
      linkText: "Start Migration"
    },
    {
      icon: <ListChecks size={42} />,
      title: "Data Quality",
      description: "Tools to validate and improve data quality during migration.",
      features: [
        "Pre-migration data validation",
        "Customizable validation rules",
        "Data cleansing workflows"
      ],
      linkTo: "/migrations/setup",
      linkText: "Validate Data"
    },
    {
      icon: <Shield size={42} />,
      title: "Security & Compliance",
      description: "Enterprise-grade security for sensitive customer data.",
      features: [
        "End-to-end encryption",
        "GDPR & CCPA compliance controls",
        "Role-based access controls"
      ],
      linkTo: "/enterprise-test",
      linkText: "Test Security"
    },
    {
      icon: <Terminal size={42} />,
      title: "Integration & APIs",
      description: "Powerful APIs and integration tools for developers.",
      features: [
        "Comprehensive REST API",
        "Webhook notifications",
        "SDK for major programming languages"
      ],
      linkTo: "/api-docs",
      linkText: "API Documentation"
    },
    {
      icon: <FileBarChart2 size={42} />,
      title: "Reporting & Analytics",
      description: "Insightful reports and analytics on your migration process.",
      features: [
        "Migration performance metrics",
        "Data quality dashboards",
        "Custom report generation"
      ],
      linkTo: "/reports",
      linkText: "View Reports"
    },
    {
      icon: <BellRing size={42} />,
      title: "Notifications & Monitoring",
      description: "Stay informed about migration events and processes.",
      features: [
        "Real-time migration alerts",
        "Email and webhook notifications",
        "Migration progress tracking"
      ],
      linkTo: "/settings",
      linkText: "Configure Notifications"
    },
    {
      icon: <Calendar size={42} />,
      title: "Scheduling & Automation",
      description: "Automate your migration processes with advanced scheduling.",
      features: [
        "Off-hours migration scheduling",
        "Recurring synchronization tasks",
        "Event-triggered migrations"
      ],
      linkTo: "/migrations/setup",
      linkText: "Schedule Migration"
    },
    {
      icon: <UserCheck size={42} />,
      title: "User Management",
      description: "Comprehensive user controls and permission management.",
      features: [
        "Role-based access control",
        "Team collaboration features",
        "Audit logs for user actions"
      ],
      linkTo: "/settings",
      linkText: "Manage Users"
    },
    {
      icon: <UploadCloud size={42} />,
      title: "Cloud Integration",
      description: "Seamless integration with all major cloud providers and services.",
      features: [
        "Direct cloud storage connection",
        "Secure data transfer protocols",
        "Multi-cloud environment support"
      ],
      linkTo: "/migrations/setup",
      linkText: "Configure Cloud"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-6 bg-gray-50 dark:bg-slate-950">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCategories.map((category, index) => (
            <FeatureCategory
              key={index}
              icon={category.icon}
              title={category.title}
              description={category.description}
              features={category.features}
              linkTo={category.linkTo}
              linkText={category.linkText}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCategories;
