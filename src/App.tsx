import { Suspense } from 'react';
import { BrowserRouter as Router, useRoutes, useLocation } from 'react-router-dom';
import routes from '~react-pages';
import MainLayout from './layouts/MainLayout';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import LoadingPage from './components/LoadingPage';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

function AppRoutes() {
    const element = useRoutes(routes);
    const location = useLocation();

    if (!element) return null;

    return (
        <AnimatePresence mode="wait">
            <div key={location.pathname} className="w-full">
                <PageTransition>{element}</PageTransition>
            </div>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <MainLayout>
                <ErrorBoundary>
                    <Suspense fallback={<LoadingPage />}>
                        <AppRoutes />
                    </Suspense>
                </ErrorBoundary>
            </MainLayout>
        </Router>
    );
}

export default App;
