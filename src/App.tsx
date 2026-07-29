import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";
import LoadingSpinner from "./components/UI/loadingSpinner/LoadingSpinner";
import FormCus from "./components/UI/form/FormCus";
import ChangePass from "./components/form/ChangePass";
import "./scss/App.scss";
import "./scss/custom.scss";
import "./scss/theme.css";

const NotFound = React.lazy(() => import("./pages/NotFound"));
const NotAuthorized = React.lazy(() => import("./pages/NotAuthorized"));
const Login = React.lazy(() => import("./pages/Login"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

const DashboardPage = React.lazy(() => import("./pages/admin/Dashboard"));
const UsersPage = React.lazy(() => import("./pages/admin/Users"));
const AddUserPage = React.lazy(() => import("./pages/admin/AddUser"));
const EditUserPage = React.lazy(() => import("./pages/admin/EditUser"));
const EquipmentPage = React.lazy(() => import("./pages/admin/Equipment"));
const EssentialToolsPage = React.lazy(() => import("./pages/admin/EssentialTools"));
const AddEssentialToolPage = React.lazy(() => import("./pages/admin/AddEssentialTool"));
const EditEssentialToolPage = React.lazy(() => import("./pages/admin/EditEssentialTool"));
const PlumbingCodesPage = React.lazy(() => import("./pages/admin/PlumbingCodes"));
const AddPlumbingCodePage = React.lazy(() => import("./pages/admin/AddPlumbingCode"));
const EditPlumbingCodePage = React.lazy(() => import("./pages/admin/EditPlumbingCode"));
const PlumbingCodeCategoriesPage = React.lazy(() => import("./pages/admin/PlumbingCodeCategories"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path='/' element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path='/admin/profile' element={<FormCus />} />
              <Route path='/admin/changePassword' element={<ChangePass />} />
              <Route path='/admin/dashboard' element={<DashboardPage />} />
              <Route path='/admin/users' element={<UsersPage />} />
              <Route path='/admin/users/add-user' element={<AddUserPage />} />
              <Route path='/admin/users/update-user/:id' element={<EditUserPage />} />
              <Route path='/admin/equipment/:plumberId' element={<EquipmentPage />} />
              <Route path='/admin/equipment' element={<EquipmentPage />} />
              <Route path='/admin/essential-tools' element={<EssentialToolsPage />} />
              <Route path='/admin/essential-tools/add' element={<AddEssentialToolPage />} />
              <Route path='/admin/essential-tools/edit/:id' element={<EditEssentialToolPage />} />
              <Route path='/admin/plumbing-codes' element={<PlumbingCodesPage />} />
              <Route path='/admin/plumbing-codes/add' element={<AddPlumbingCodePage />} />
              <Route path='/admin/plumbing-codes/edit/:id' element={<EditPlumbingCodePage />} />
              <Route path='/admin/plumbing-codes/categories' element={<PlumbingCodeCategoriesPage />} />
            </Route>
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/not-authorized' element={<NotAuthorized />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
