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
const EquipmentCategoriesPage = React.lazy(() => import("./pages/admin/EquipmentCategories"));
const EssentialToolsPage = React.lazy(() => import("./pages/admin/EssentialTools"));
const AddEssentialToolPage = React.lazy(() => import("./pages/admin/AddEssentialTool"));
const EditEssentialToolPage = React.lazy(() => import("./pages/admin/EditEssentialTool"));
const AddMaintenanceGuidePage = React.lazy(() => import("./pages/admin/AddMaintenanceGuide"));
const EditMaintenanceGuidePage = React.lazy(() => import("./pages/admin/EditMaintenanceGuide"));
const MaintenanceGuidesPage = React.lazy(() => import("./pages/admin/MaintenanceGuides"));
const PlumbingCodesPage = React.lazy(() => import("./pages/admin/PlumbingCodes"));
const AddPlumbingCodePage = React.lazy(() => import("./pages/admin/AddPlumbingCode"));
const EditPlumbingCodePage = React.lazy(() => import("./pages/admin/EditPlumbingCode"));
const PlumbingCodeCategoriesPage = React.lazy(() => import("./pages/admin/PlumbingCodeCategories"));
const TrendingVideosPage = React.lazy(() => import("./pages/admin/TrendingVideos"));
const AddTrendingVideoPage = React.lazy(() => import("./pages/admin/AddTrendingVideo"));
const EditTrendingVideoPage = React.lazy(() => import("./pages/admin/EditTrendingVideo"));
const AiVideosPage = React.lazy(() => import("./pages/admin/AiVideos"));
const AddAiVideoPage = React.lazy(() => import("./pages/admin/AddAiVideo"));
const EditAiVideoPage = React.lazy(() => import("./pages/admin/EditAiVideo"));
const FaqsPage = React.lazy(() => import("./pages/admin/Faqs"));
const AddFaqPage = React.lazy(() => import("./pages/admin/AddFaq"));
const EditFaqPage = React.lazy(() => import("./pages/admin/EditFaq"));
const SupportRequestsPage = React.lazy(() => import("./pages/admin/SupportRequests"));

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
              <Route path='/admin/equipment/categories' element={<EquipmentCategoriesPage />} />
              <Route path='/admin/equipment' element={<EquipmentPage />} />
              <Route path='/admin/essential-tools' element={<EssentialToolsPage />} />
              <Route path='/admin/essential-tools/add' element={<AddEssentialToolPage />} />
              <Route path='/admin/essential-tools/edit/:id' element={<EditEssentialToolPage />} />
              <Route path='/admin/maintenance-guides' element={<MaintenanceGuidesPage />} />
              <Route path='/admin/maintenance-guides/add' element={<AddMaintenanceGuidePage />} />
              <Route path='/admin/maintenance-guides/edit/:id' element={<EditMaintenanceGuidePage />} />
              <Route path='/admin/plumbing-codes' element={<PlumbingCodesPage />} />
              <Route path='/admin/plumbing-codes/add' element={<AddPlumbingCodePage />} />
              <Route path='/admin/plumbing-codes/edit/:id' element={<EditPlumbingCodePage />} />
              <Route path='/admin/plumbing-codes/categories' element={<PlumbingCodeCategoriesPage />} />
              <Route path='/admin/trending-videos/:audience' element={<TrendingVideosPage />} />
              <Route path='/admin/trending-videos/:audience/add' element={<AddTrendingVideoPage />} />
              <Route path='/admin/trending-videos/:audience/edit/:id' element={<EditTrendingVideoPage />} />
              <Route path='/admin/ai-videos' element={<AiVideosPage />} />
              <Route path='/admin/ai-videos/add' element={<AddAiVideoPage />} />
              <Route path='/admin/ai-videos/edit/:id' element={<EditAiVideoPage />} />
              <Route path='/admin/faqs' element={<FaqsPage />} />
              <Route path='/admin/add-faq' element={<AddFaqPage />} />
              <Route path='/admin/edit-faq/:id' element={<EditFaqPage />} />
              <Route path='/admin/support' element={<SupportRequestsPage />} />
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
