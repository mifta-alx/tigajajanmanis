export interface BreadcrumbStep {
  label: string;
  href?: string;
}

export const breadcrumbList: Record<string, BreadcrumbStep[]> = {
  "/admin/dashboard": [{ label: "Dashboard" }],
  "/admin/inventory/merchants": [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Inventory" },
    { label: "Merchants" },
  ],
  "/admin/inventory/products": [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Inventory" },
    { label: "Products" },
  ],
  "/admin/sales": [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Sales" },
  ],
  "/admin/users": [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users" },
  ],
};
