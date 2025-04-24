import { Docs, Features, Feedback, Overview, Pricing } from "@/components/icons";

export const topNavItems = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Resources", href: "/resources" },
  { name: "API Docs", href: "/api" },
  { name: "Data Loading", href: "/data-loading" }
];

export const sidebarNavItems = [
  {
    title: "General",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: Overview,
        description: "Get a birds eye view of your CRM migrations.",
      },
      {
        title: "Features",
        href: "/features",
        icon: Features,
        description: "See all the features we offer.",
      },
      {
        title: "Pricing",
        href: "/pricing",
        icon: Pricing,
        description: "Choose the plan that's right for you.",
      },
      {
        title: "Documentation",
        href: "/docs",
        icon: Docs,
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
        icon: Feedback,
        description: "Share your thoughts and ideas with us.",
      },
    ],
  },
];
