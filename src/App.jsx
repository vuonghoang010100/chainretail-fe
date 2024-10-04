import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import LoginLayout from "@/components/layout/LoginLayout";
import LazyLoadPage from "@/pages/LazyLoadPage";
import { ROUTE } from "@/constants/AppConstant";
import useAuth from "@/hooks/useAuth";
import { getSubDomain, onMainHost } from "./utils";

// -------------------------------------------------------------------
// ------------------------ lazy import pages ------------------------
// ------------ Tenants ------------
// Home
import Home from "@/pages/tenant/Home";
// Dashboard
import Dashboard from "@/pages/tenant/Dashboard";
// Product
const Product = lazy(() => import("@/pages/tenant/Product/Product/Product"));
const NewProduct = lazy(() => import("@/pages/tenant/Product/Product/NewProduct"));
const ViewProduct = lazy(() => import("@/pages/tenant/Product/Product/ViewProduct"));
const EditProduct = lazy(() => import("@/pages/tenant/Product/Product/EditProduct"));

// Category
const Category = lazy(() => import("@/pages/tenant/Product/Category/Category"));
const NewCategory = lazy(() => import("@/pages/tenant/Product/Category/NewCategory"));
const ViewCategory = lazy(() => import("@/pages/tenant/Product/Category/ViewCategory"));
const EditCategory = lazy(() => import("@/pages/tenant/Product/Category/EditCategory"));
// Order
const Order = lazy(() => import("@/pages/tenant/Sale/Order/Order"));
const NewOrder = lazy(() => import("@/pages/tenant/Sale/Order/NewOrder"));
const EditOrder = lazy(() => import("@/pages/tenant/Sale/Order/EditOrder"));
const ViewOrder = lazy(() => import("@/pages/tenant/Sale/Order/ViewOrder"));
// Invoice
const Invoice = lazy(() => import("@/pages/tenant/Sale/Invoice/Invoice"));
const NewInvoice = lazy(() => import("@/pages/tenant/Sale/Invoice/NewInvoice"));
const EditInvoice = lazy(() => import("@/pages/tenant/Sale/Invoice/EditInvoice"));
const ViewInvoice = lazy(() => import("@/pages/tenant/Sale/Invoice/ViewInvoice"));
// Pos
const Pos = lazy(() => import("@/pages/tenant/Sale/Pos"));
// Purchase
const Purchase = lazy(() => import("@/pages/tenant/Purchase/Purchase/Purchase"));
const NewPurchase = lazy(() => import("@/pages/tenant/Purchase/Purchase/NewPurchase"));
const EditPurchase = lazy(() => import("@/pages/tenant/Purchase/Purchase/EditPurchase"));
const ViewPurchase = lazy(() => import("@/pages/tenant/Purchase/Purchase/ViewPurchase"));
const ReceivePurchase = lazy(() => import("@/pages/tenant/Purchase/Purchase/ReceivePurchase"));
// Bill
const Bill = lazy(() => import("@/pages/tenant/Purchase/Bill/Bill"));
const NewBill = lazy(() => import("@/pages/tenant/Purchase/Bill/NewBill"));
const EditBill = lazy(() => import("@/pages/tenant/Purchase/Bill/EditBill"));
const ViewBill = lazy(() => import("@/pages/tenant/Purchase/Bill/ViewBill"));
// Customer
const Customer = lazy(() => import("@/pages/tenant/Partner/Customer/Customer"));
const NewCustomer = lazy(() => import("@/pages/tenant/Partner/Customer/NewCustomer"));
const EditCustomer = lazy(() => import("@/pages/tenant/Partner/Customer/EditCustomer"));
const ViewCustomer = lazy(() => import("@/pages/tenant/Partner/Customer/ViewCustomer"));
// Vendor
const Vendor = lazy(() => import("@/pages/tenant/Partner/Vendor/Vendor"));
const NewVendor = lazy(() => import("@/pages/tenant/Partner/Vendor/NewVendor"));
const EditVendor = lazy(() => import("@/pages/tenant/Partner/Vendor/EditVendor"));
const ViewVendor = lazy(() => import("@/pages/tenant/Partner/Vendor/ViewVendor"));
// Contract
const Contract = lazy(() => import("@/pages/tenant/Partner/Contract/Contract"));
const NewContract = lazy(() => import("@/pages/tenant/Partner/Contract/NewContract"));
const EditContract = lazy(() => import("@/pages/tenant/Partner/Contract/EditContract"));
const ViewContract = lazy(() => import("@/pages/tenant/Partner/Contract/ViewContract"));
// Store
const Store = lazy(() => import("@/pages/tenant/Store/Store/Store"));
const NewStore = lazy(() => import("@/pages/tenant/Store/Store/NewStore"));
const ViewStore = lazy(() => import("@/pages/tenant/Store/Store/ViewStore"));
const EditStore = lazy(() => import("@/pages/tenant/Store/Store/EditStore"));
// Transfer
const Transfer = lazy(() => import("@/pages/tenant/Store/Transfer/Transfer"));
const NewTransfer = lazy(() => import("@/pages/tenant/Store/Transfer/NewTransfer"));
const ViewTransfer = lazy(() => import("@/pages/tenant/Store/Transfer/ViewTransfer"));
const EditTransfer = lazy(() => import("@/pages/tenant/Store/Transfer/EditTransfer"));
// Inventory
const Inventory = lazy(() => import("@/pages/tenant/Store/Inventory/Inventory"));
const NewInventory = lazy(() => import("@/pages/tenant/Store/Inventory/NewInventory"));
const ViewInventory = lazy(() => import("@/pages/tenant/Store/Inventory/ViewInventory"));
const EditInventory = lazy(() => import("@/pages/tenant/Store/Inventory/EditInventory"));
// 
// Staff
const Staff = lazy(() => import("@/pages/tenant/Staff/Staff/Staff"))
const NewStaff = lazy(() => import("@/pages/tenant/Staff/Staff/NewStaff"))
const ViewStaff = lazy(() => import("@/pages/tenant/Staff/Staff/ViewStaff"))
const EditStaff = lazy(() => import("@/pages/tenant/Staff/Staff/EditStaff"))
// Role
// import Role from "@/pages/tenant/Staff/Role";
const Role = lazy(() => import("@/pages/tenant/Staff/Role/Role"))
const ViewRole = lazy(() => import("@/pages/tenant/Staff/Role/ViewRole"))
const NewRole = lazy(() => import("@/pages/tenant/Staff/Role/NewRole"))
const EditRole = lazy(() => import("@/pages/tenant/Staff/Role/EditRole"))

// Promote
const Promote = lazy(() => import("@/pages/tenant/Promote/Promote"));
const NewPromote = lazy(() => import("@/pages/tenant/Promote/NewPromote"));
const ViewPromote = lazy(() => import("@/pages/tenant/Promote/ViewPromote"));
const EditPromote = lazy(() => import("@/pages/tenant/Promote/EditPromote"));
// Report
import Report from "@/pages/tenant/Report";
const Report1 = lazy(() => import("@/pages/tenant/Report/pages/1SalePerTime"))
const Report2 = lazy(() => import("@/pages/tenant/Report/pages/2SalePerProduct"))
const Report3 = lazy(() => import("@/pages/tenant/Report/pages/3SalePerCategory"))
const Report4 = lazy(() => import("@/pages/tenant/Report/pages/4SalePerEm"))
const Report5 = lazy(() => import("@/pages/tenant/Report/pages/5SalePerStore"))
const Report6 = lazy(() => import("@/pages/tenant/Report/pages/6SalePerCustomer"))
const Report7 = lazy(() => import("@/pages/tenant/Report/pages/7PurchasePerTime"))
const Report8 = lazy(() => import("@/pages/tenant/Report/pages/8PurchasePerStore"))
const Report9 = lazy(() => import("@/pages/tenant/Report/pages/9PurchasePerVendor"))
const Report10 = lazy(() => import("@/pages/tenant/Report/pages/3SalePerCategory"))
const Report11 = lazy(() => import("@/pages/tenant/Report/pages/11ABC"))
const Report12 = lazy(() => import("@/pages/tenant/Report/pages/12FSN"))

// Setting
import Setting from "@/pages/tenant/Setting";


// ------------ Admins ------------
const AdminHome = lazy(() => import("@/pages/admin/AdminHome"))
const Tenant = lazy(() => import("@/pages/admin/Tenant"))
const ViewTenant = lazy(() => import("@/pages/admin/Tenant/ViewTenant"));

// -------------------------------------------------------------------

// Always import pages
import Login from "@/pages/Login";
import LoginDomain from "@/pages/LoginDomain";
import SignUp from "@/pages/SignUp";
import Logout from "@/pages/Logout";



function App() {
  const {auth, isAdminApp} = useAuth();
  console.info("Sub domain:", getSubDomain());
  
  // Routes
  // Case on exact domain => route to tenant app + register
  if ( onMainHost() || getSubDomain() === "www") {
    return (
      <Routes>
        <Route path="/" element={<LoginLayout/>} >
          <Route index element={<LoginDomain/>} />
          <Route path={ROUTE.LOGIN.name} element={<LoginDomain/>} />
          <Route path={ROUTE.SIGNUP.name} element={<SignUp/>} />
        </Route>
      </Routes>
    )
  }

  // Case on tenant domain
  //// Public pages
  if (!auth.isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LoginLayout/>} >
          <Route index element={<Login/>} />
          <Route path={ROUTE.LOGIN.name} element={<Login/>} />
        </Route>

        <Route path={ROUTE.LOGOUT.name} element={<Logout/>} />
      </Routes>
    );
  }
  //// Private pages (authenticated)
  ////// System admin app
  if (isAdminApp()) {
    return (
      <Routes>
        {/* Publics */}
        {/* TODO New Login page */}
        <Route path={ROUTE.LOGIN.name} element={<LoginLayout/>} >
          <Route index element={<Login/>} />
        </Route>

        <Route path={ROUTE.LOGOUT.name} element={<Logout/>} />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<LazyLoadPage><AdminHome/></LazyLoadPage>}/>

          <Route path={ROUTE.ADMIN_APP.TENANT.name} >
            <Route index element={<LazyLoadPage><Tenant /></LazyLoadPage>} />
            <Route path=":id" element={<LazyLoadPage><ViewTenant/></LazyLoadPage>} />
          </Route>

        </Route>
      </Routes>
    );
  }

  ////// Tenant app
  return (
    <Routes>
      {/* Publics */}
      {/* TODO New Login page */}
      <Route path={ROUTE.LOGIN.name} element={<LoginLayout/>} >
        <Route index element={<Login/>} />
      </Route>

      <Route path={ROUTE.LOGOUT.name} element={<Logout/>} />

      {/* Tenant app */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Home/>}/>

        <Route path={ROUTE.TENANT_APP.DASHBOARD.name} >
          <Route index element={<Dashboard />} />
        </Route>
        
        <Route path={ROUTE.TENANT_APP.PRODUCT.name} >
          <Route index element={<LazyLoadPage><Product/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewProduct/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewProduct/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditProduct/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.CATEGORY.name} >
          <Route index element={<LazyLoadPage><Category/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewCategory/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewCategory/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditCategory/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.ORDER.name} >
          <Route index element={<LazyLoadPage><Order/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewOrder/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewOrder/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditOrder/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.INVOICE.name} >
          <Route index element={<LazyLoadPage><Invoice/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewInvoice/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewInvoice/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditInvoice/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.POS.name} >
          <Route index element={<LazyLoadPage><Pos/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.PURCHASE.name} >
          <Route index element={<LazyLoadPage><Purchase/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewPurchase/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewPurchase/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditPurchase/></LazyLoadPage>} />
          <Route path=":id/receive" element={<LazyLoadPage><ReceivePurchase/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.BILL.name} >
          <Route index element={<LazyLoadPage><Bill/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewBill/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewBill/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditBill/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.CUSTOMER.name} >
          <Route index element={<LazyLoadPage><Customer/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewCustomer/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewCustomer/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditCustomer/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.VENDOR.name} >
          <Route index element={<LazyLoadPage><Vendor/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewVendor/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewVendor/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditVendor/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.CONTRACT.name} >
          <Route index element={<LazyLoadPage><Contract/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewContract/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewContract/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditContract/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.STORE.name} >
          <Route index element={<LazyLoadPage><Store/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewStore/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewStore/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditStore/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.TRANSFER.name} >
          <Route index element={<LazyLoadPage><Transfer/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewTransfer/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewTransfer/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditTransfer/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.INVENTORY.name} >
          <Route index element={<LazyLoadPage><Inventory/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewInventory/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewInventory/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditInventory/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.STAFF.name} >
          <Route index element={<LazyLoadPage><Staff/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewStaff/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewStaff/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditStaff/></LazyLoadPage>} />

        </Route>

        <Route path={ROUTE.TENANT_APP.ROLE.name} >
          <Route index element={<LazyLoadPage><Role/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewRole/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewRole/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditRole/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.PROMOTE.name} >
          <Route index element={<LazyLoadPage><Promote/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewPromote/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewPromote/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditPromote/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.REPORT.name} >
          <Route index element={<Report/>} />
          <Route path="1" element={<LazyLoadPage><Report1/></LazyLoadPage>} />
          <Route path="2" element={<LazyLoadPage><Report2/></LazyLoadPage>} />
          <Route path="3" element={<LazyLoadPage><Report3/></LazyLoadPage>} />
          <Route path="4" element={<LazyLoadPage><Report4/></LazyLoadPage>} />
          <Route path="5" element={<LazyLoadPage><Report5/></LazyLoadPage>} />
          <Route path="6" element={<LazyLoadPage><Report6/></LazyLoadPage>} />
          <Route path="7" element={<LazyLoadPage><Report7/></LazyLoadPage>} />
          <Route path="8" element={<LazyLoadPage><Report8/></LazyLoadPage>} />
          <Route path="9" element={<LazyLoadPage><Report9/></LazyLoadPage>} />
          <Route path="10" element={<LazyLoadPage><Report10/></LazyLoadPage>} />
          <Route path="11" element={<LazyLoadPage><Report11/></LazyLoadPage>} />
          <Route path="12" element={<LazyLoadPage><Report12/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.SETTING.name} >
          <Route index element={<Setting/>} />
        </Route>
        
      </Route>
    </Routes>
  );
}

export default App;
