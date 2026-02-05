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
  "/admin/workflows/stock-in": [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Workflows" },
    { label: "Stock In" },
  ],
  "/admin/workflows/settlement": [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Workflows" },
    { label: "Settlement" },
  ],
  "/admin/sales": [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Sales" },
  ],
  "/admin/users": [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Users" },
  ],
  "/admin/outlet": [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Outlet" },
  ],
};
