import React, { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import PageTransition from '../components/layout/PageTransition';
import Spinner from '../components/ui/Spinner';

const Home = lazy(() => import('../pages/Home/Home'));
const Services = lazy(() => import('../pages/Services/Services'));
const Portfolio = lazy(() => import('../pages/Portfolio/Portfolio'));
const PortfolioDetail = lazy(() => import('../pages/PortfolioDetail/PortfolioDetail'));
const Blog = lazy(() => import('../pages/Blog/Blog'));
const BlogDetail = lazy(() => import('../pages/BlogDetail/BlogDetail'));
const About = lazy(() => import('../pages/About/About'));
const Contact = lazy(() => import('../pages/Contact/Contact'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><Spinner /></div>}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><PageTransition><Home /></PageTransition></SuspenseWrapper> },
      { path: 'services', element: <SuspenseWrapper><PageTransition><Services /></PageTransition></SuspenseWrapper> },
      { path: 'portfolio', element: <SuspenseWrapper><PageTransition><Portfolio /></PageTransition></SuspenseWrapper> },
      { path: 'portfolio/:slug', element: <SuspenseWrapper><PageTransition><PortfolioDetail /></PageTransition></SuspenseWrapper> },
      { path: 'blog', element: <SuspenseWrapper><PageTransition><Blog /></PageTransition></SuspenseWrapper> },
      { path: 'blog/:slug', element: <SuspenseWrapper><PageTransition><BlogDetail /></PageTransition></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><PageTransition><About /></PageTransition></SuspenseWrapper> },
      { path: 'contact', element: <SuspenseWrapper><PageTransition><Contact /></PageTransition></SuspenseWrapper> },
      { path: '*', element: <SuspenseWrapper><PageTransition><NotFound /></PageTransition></SuspenseWrapper> },
    ],
  },
]);

export default router;
