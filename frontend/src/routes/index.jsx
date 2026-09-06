import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import SiteLayout from "../components/SiteLayout/SiteLayout";
import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import CoursesPage from "../pages/Courses/Courses";
import PortfolioPage from "../pages/Portfolio/Portfolio";
import ContactPage from "../pages/Contact/Contact";
import Placeholder from "../pages/Placeholder/Placeholder";
import ProtectedRoute from "../components/admin/ProtectedRoute";

/* ---- Admin (unchanged, lazy) ---- */
const AdminLogin = lazy(() => import("../pages/Admin/Login/Login"));
const AdminLayout = lazy(() => import("../pages/Admin/AdminLayout/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/Admin/Dashboard/Dashboard"));
const AdminSettings = lazy(() => import("../pages/Admin/Settings/Settings"));
const AdminHero = lazy(() => import("../pages/Admin/Hero/Hero"));
const AdminAbout = lazy(() => import("../pages/Admin/About/About"));
const AdminServices = lazy(() => import("../pages/Admin/Services/Services"));
const AdminPortfolio = lazy(() => import("../pages/Admin/Portfolio/Portfolio"));
const AdminBlog = lazy(() => import("../pages/Admin/Blog/Blog"));

const Fallback = () => (
  <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
    <span className="mono">Yüklənir…</span>
  </div>
);

const S = ({ children }) => <Suspense fallback={<Fallback />}>{children}</Suspense>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "xidmetler", element: <Services /> },
      { path: "kurslar", element: <CoursesPage /> },
      { path: "portfolio", element: <PortfolioPage /> },
      { path: "elaqe", element: <ContactPage /> },
      {
        path: "*",
        element: (
          <Placeholder
            index="404"
            title="Tapılmadı"
            note="Axtardığınız səhifə mövcud deyil."
          />
        ),
      },
    ],
  },

  {
    path: "/admin/login",
    element: (
      <S>
        <AdminLogin />
      </S>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <S>
          <AdminLayout />
        </S>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <S><AdminDashboard /></S> },
      { path: "settings", element: <S><AdminSettings /></S> },
      { path: "hero", element: <S><AdminHero /></S> },
      { path: "about", element: <S><AdminAbout /></S> },
      { path: "services", element: <S><AdminServices /></S> },
      { path: "portfolio", element: <S><AdminPortfolio /></S> },
      { path: "blog", element: <S><AdminBlog /></S> },
    ],
  },
]);

export default router;
