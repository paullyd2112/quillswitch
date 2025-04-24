
import { FileText, Star, MessageSquare, LayoutDashboard, CreditCard } from "lucide-react";

export const topNavItems = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "API Docs", href: "/api" },
  { label: "Data Loading", href: "/data-loading" }
];

export const sidebarNavItems = [
  {
    title: "General",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Get a birds eye view of your CRM migrations.",
      },
      {
        title: "Features",
        href: "/features",
        icon: Star,
        description: "See all the features we offer.",
      },
      {
        title: "Pricing",
        href: "/pricing",
        icon: CreditCard,
        description: "Choose the plan that's right for you.",
      },
      {
        title: "Documentation",
        href: "/docs",
        icon: FileText,
        description: "Learn how to use our platform.",
      },
    ],
  },
  {
    title: "Feedback",
    items: [
      {
        title: "Feedback",
        href: "/feedback",
        icon: MessageSquare,
        description: "Share your thoughts and ideas with us.",
      },
    ],
  },
];
