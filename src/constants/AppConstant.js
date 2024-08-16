const AppConstant = {};

export const TENANT_GROUP = {
  PRODUCT_GROUP: "product-group",
  SALE_GROUP: "sale-group",
  PURCHASE_GROUP: "purchase-group",
  PARTNER_GROUP: "partner-group",
  STORE_GROUP: "store-group",
  STAFF_GROUP: "staff-group",
};

export const ROUTE = {
  TENANT_APP: {
    HOME: {
      path: "/",
      group: null,
    },
    DASHBOARD: {
      path: "/dashboard",
      name: "dashboard",
      group: null,
    },
    PRODUCT: {
      path: "/product",
      name: "product",
      group: TENANT_GROUP.PRODUCT_GROUP,
    },
    CATEGORY: {
      path: "/category",
      name: "category",
      group: TENANT_GROUP.PRODUCT_GROUP,
    },
    ORDER: {
      path: "/order",
      name: "order",
      group: TENANT_GROUP.SALE_GROUP,
    },
    INVOICE: {
      path: "/invoice",
      name: "invoice",
      group: TENANT_GROUP.SALE_GROUP,
    },
    POS: {
      path: "/pos",
      name: "pos",
      group: TENANT_GROUP.SALE_GROUP,
    },
    PURCHASE: {
      path: "/purchase",
      name: "purchase",
      group: TENANT_GROUP.PURCHASE_GROUP,
    },
    BILL: {
      path: "/bill",
      name: "bill",
      group: TENANT_GROUP.PURCHASE_GROUP,
    },
    CUSTOMER: {
      path: "/customer",
      name: "customer",
      group: TENANT_GROUP.PARTNER_GROUP,
    },
    VENDOR: {
      path: "/vendor",
      name: "vendor",
      group: TENANT_GROUP.PARTNER_GROUP,
    },
    CONTRACT: {
      path: "/contract",
      name: "contract",
      group: TENANT_GROUP.PARTNER_GROUP,
    },
    STORE: {
      path: "/store",
      name: "store",
      group: TENANT_GROUP.STORE_GROUP,
    },
    TRANSFER: {
      path: "/transfer",
      name: "transfer",
      group: TENANT_GROUP.STORE_GROUP,
    },
    INVENTORY: {
      path: "/inventory",
      name: "inventory",
      group: TENANT_GROUP.STORE_GROUP,
    },
    STAFF: {
      path: "/staff",
      name: "staff",
      group: TENANT_GROUP.STAFF_GROUP,
    },
    ROLE: {
      path: "/role",
      name: "role",
      group: TENANT_GROUP.STAFF_GROUP,
    },
    PROMOTE: {
      path: "/promote",
      name: "promote",
      group: null,
    },
    REPORT: {
      path: "/report",
      name: "report",
      group: null,
    },
    SETTING: {
      path: "/setting",
      name: "setting",
      group: null,
    },
  },
  ADMIN_APP: {
    HOME: {
      path: "/",
      group: null,
    },
    TENANT: {
      path: "/tenant",
      name: "tenant",
      group: null,
    },
  },
  LOGIN: {
    name: "login",
    path: "/login",
  },
  SIGNUP: {
    name: "signup",
    path: "/signup",
  },
  LOGOUT: {
    name: "logout",
    path: "/logout",
  },
};

export default AppConstant;
