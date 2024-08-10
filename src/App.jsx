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
import Product from "@/pages/tenant/Product/Product";
// Category
import Category from "@/pages/tenant/Product/Category";
// Order
import Order from "@/pages/tenant/Sale/Order";
// Invoice
import Invoice from "@/pages/tenant/Sale/Invoice";
// Pos
import Pos from "@/pages/tenant/Sale/Pos";
// Purchase
import Purchase from "@/pages/tenant/Purchase/Purchase";
// Bill
import Bill from "@/pages/tenant/Purchase/Bill";
// Customer
import Customer from "@/pages/tenant/Partner/Customer";
// Vendor
import Vendor from "@/pages/tenant/Partner/Vendor";
// Contract
import Contract from "@/pages/tenant/Partner/Contract";
// Store
const Store = lazy(() => import("@/pages/tenant/Store/Store/Store"));
const NewStore = lazy(() => import("@/pages/tenant/Store/Store/NewStore"));
const ViewStore = lazy(() => import("@/pages/tenant/Store/Store/ViewStore"));
const EditStore = lazy(() => import("@/pages/tenant/Store/Store/EditStore"));
// Transfer
import Transfer from "@/pages/tenant/Store/Transfer";
// Inventory
import Inventory from "@/pages/tenant/Store/Inventory";
// 
// Staff
const Staff = lazy(() => import("@/pages/tenant/Staff/Staff/Staff"))
const NewStaff = lazy(() => import("@/pages/tenant/Staff/Staff/NewStaff"))
const ViewStaff = lazy(() => import("@/pages/tenant/Staff/Staff/ViewStaff"))
const EditStaff = lazy(() => import("@/pages/tenant/Staff/Staff/EditStaff"))
// Role
import Role from "@/pages/tenant/Staff/Role";
// Promote
import Promote from "@/pages/tenant/Promote";
// Report
import Report from "@/pages/tenant/Report";
// Setting
import Setting from "@/pages/tenant/Setting";


// ------------ Admins ------------
const AdminHome = lazy(() => import("@/pages/admin/AdminHome"))
const Tenant = lazy(() => import("@/pages/admin/Tenant"))

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
          <Route index element={<Product/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.CATEGORY.name} >
          <Route index element={<Category/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.ORDER.name} >
          <Route index element={<Order/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.INVOIVE.name} >
          <Route index element={<Invoice/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.POS.name} >
          <Route index element={<Pos/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.PRUCHASE.name} >
          <Route index element={<Purchase/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.BILL.name} >
          <Route index element={<Bill/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.CUSTOMER.name} >
          <Route index element={<Customer/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.VENDOR.name} >
          <Route index element={<Vendor/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.CONTRACT.name} >
          <Route index element={<Contract/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.STORE.name} >
          <Route index element={<LazyLoadPage><Store/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewStore/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewStore/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditStore/></LazyLoadPage>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.TRANSFER.name} >
          <Route index element={<Transfer/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.INVENTORY.name} >
          <Route index element={<Inventory/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.STAFF.name} >
          <Route index element={<LazyLoadPage><Staff/></LazyLoadPage>} />
          <Route path="new" element={<LazyLoadPage><NewStaff/></LazyLoadPage>} />
          <Route path=":id" element={<LazyLoadPage><ViewStaff/></LazyLoadPage>} />
          <Route path=":id/edit" element={<LazyLoadPage><EditStaff/></LazyLoadPage>} />

        </Route>

        <Route path={ROUTE.TENANT_APP.ROLE.name} >
          <Route index element={<Role/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.PROMOTE.name} >
          <Route index element={<Promote/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.REPORT.name} >
          <Route index element={<Report/>} />
        </Route>

        <Route path={ROUTE.TENANT_APP.SETTING.name} >
          <Route index element={<Setting/>} />
        </Route>
        
      </Route>
    </Routes>
  );
}

export default App;
