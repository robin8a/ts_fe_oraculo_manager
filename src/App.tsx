import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ModelAIList } from './pages/ModelAI/ModelAIList';
import { ModelAICreate } from './pages/ModelAI/ModelAICreate';
import { ModelAIEdit } from './pages/ModelAI/ModelAIEdit';
import { ModelAIDetail } from './pages/ModelAI/ModelAIDetail';
import { KoboToolboxImport } from './pages/KoboToolboxImport/KoboToolboxImport';
import { Login } from './pages/Login/Login';
import { ProjectTreeFeatureView } from './pages/ProjectTreeFeature/ProjectTreeFeatureView';
import { DeleteProjectTreeFeature } from './pages/ProjectTreeFeature/DeleteProjectTreeFeature';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
}

function LoginRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, redirect to Model AI (or return to previous page)
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/modelai';
    return <Navigate to={from} replace />;
  }

  return <Login />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/modelai" replace />} />
                  <Route path="/modelai" element={<ModelAIList />} />
                  <Route path="/modelai/create" element={<ModelAICreate />} />
                  <Route path="/modelai/:id" element={<ModelAIDetail />} />
                  <Route path="/modelai/:id/edit" element={<ModelAIEdit />} />
                  <Route path="/kobotoolbox/import" element={<KoboToolboxImport />} />
                  <Route path="/projects" element={<ProjectTreeFeatureView />} />
                  <Route path="/projects/delete" element={<DeleteProjectTreeFeature />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



