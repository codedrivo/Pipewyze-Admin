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
