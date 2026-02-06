import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ModelAIList } from './pages/ModelAI/ModelAIList';
import { ModelAICreate } from './pages/ModelAI/ModelAICreate';
import { ModelAIEdit } from './pages/ModelAI/ModelAIEdit';
import { ModelAIDetail } from './pages/ModelAI/ModelAIDetail';
import { FeatureList } from './pages/Feature/FeatureList';
import { FeatureCreate } from './pages/Feature/FeatureCreate';
import { FeatureEdit } from './pages/Feature/FeatureEdit';
import { FeatureDetail } from './pages/Feature/FeatureDetail';
import { UnitOfMeasureList } from './pages/UnitOfMeasure/UnitOfMeasureList';
import { UnitOfMeasureCreate } from './pages/UnitOfMeasure/UnitOfMeasureCreate';
import { UnitOfMeasureEdit } from './pages/UnitOfMeasure/UnitOfMeasureEdit';
import { UnitOfMeasureDetail } from './pages/UnitOfMeasure/UnitOfMeasureDetail';
import { KoboToolboxImport } from './pages/KoboToolboxImport/KoboToolboxImport';
import { AudioToFeatures } from './pages/AudioToFeatures/AudioToFeatures';
import { Login } from './pages/Login/Login';
import { ProjectTreeFeatureView } from './pages/ProjectTreeFeature/ProjectTreeFeatureView';
import { DeleteProjectTreeFeature } from './pages/ProjectTreeFeature/DeleteProjectTreeFeature';
import { DuplicateFeaturesView } from './pages/ProjectTreeFeature/DuplicateFeaturesView';
import { TemplateFeatureList } from './pages/TemplateFeature/TemplateFeatureList';
import { TemplateFeatureCreate } from './pages/TemplateFeature/TemplateFeatureCreate';
import { TemplateFeatureDetail } from './pages/TemplateFeature/TemplateFeatureDetail';
import { TemplateFeatureEdit } from './pages/TemplateFeature/TemplateFeatureEdit';
import { TemplateList } from './pages/Template/TemplateList';
import { TemplateCreate } from './pages/Template/TemplateCreate';
import { TemplateDetail } from './pages/Template/TemplateDetail';
import { TemplateEdit } from './pages/Template/TemplateEdit';
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
                  <Route path="/features" element={<FeatureList />} />
                  <Route path="/features/create" element={<FeatureCreate />} />
                  <Route path="/features/:id" element={<FeatureDetail />} />
                  <Route path="/features/:id/edit" element={<FeatureEdit />} />
                  <Route path="/unitsofmeasure" element={<UnitOfMeasureList />} />
                  <Route path="/unitsofmeasure/create" element={<UnitOfMeasureCreate />} />
                  <Route path="/unitsofmeasure/:id" element={<UnitOfMeasureDetail />} />
                  <Route path="/unitsofmeasure/:id/edit" element={<UnitOfMeasureEdit />} />
                  <Route path="/kobotoolbox/import" element={<KoboToolboxImport />} />
                  <Route path="/audio-to-features" element={<AudioToFeatures />} />
                  <Route path="/projects" element={<ProjectTreeFeatureView />} />
                  <Route path="/projects/delete" element={<DeleteProjectTreeFeature />} />
                  <Route path="/projects/duplicates" element={<DuplicateFeaturesView />} />
                  <Route path="/templatefeatures" element={<TemplateFeatureList />} />
                  <Route path="/templatefeatures/create" element={<TemplateFeatureCreate />} />
                  <Route path="/templatefeatures/:id" element={<TemplateFeatureDetail />} />
                  <Route path="/templatefeatures/:id/edit" element={<TemplateFeatureEdit />} />
                  <Route path="/templates" element={<TemplateList />} />
                  <Route path="/templates/create" element={<TemplateCreate />} />
                  <Route path="/templates/:id" element={<TemplateDetail />} />
                  <Route path="/templates/:id/edit" element={<TemplateEdit />} />
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



