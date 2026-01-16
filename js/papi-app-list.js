# App Metadata for Marketplace & Dropdown

// This file is auto-generated. Update as new apps are added.

const PAPI_APPS = [
  {
    name: "AI Assistant Pro",
    icon: "🤖",
    price: "$9.99",
    path: "apps/ai-assistant-pro.html",
    description: "Full-featured AI chat and productivity assistant."
  },
  {
    name: "File Arranger Pro",
    icon: "🗂️",
    price: "$4.99",
    path: "apps/file-arranger-pro.html",
    description: "Organize and separate mixed files and folders."
  },
  // Add more apps here as needed
];

// Export for use in dropdowns and marketplace
if (typeof window !== 'undefined') {
  window.PAPI_APPS = PAPI_APPS;
}
