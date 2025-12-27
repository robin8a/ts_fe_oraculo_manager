import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ModelAIList } from './pages/ModelAI/ModelAIList';
import { ModelAICreate } from './pages/ModelAI/ModelAICreate';
import { ModelAIEdit } from './pages/ModelAI/ModelAIEdit';
import { ModelAIDetail } from './pages/ModelAI/ModelAIDetail';
import { KoboToolboxImport } from './pages/KoboToolboxImport/KoboToolboxImport';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/modelai" replace />} />
          <Route path="/modelai" element={<ModelAIList />} />
          <Route path="/modelai/create" element={<ModelAICreate />} />
          <Route path="/modelai/:id" element={<ModelAIDetail />} />
          <Route path="/modelai/:id/edit" element={<ModelAIEdit />} />
          <Route path="/kobotoolbox/import" element={<KoboToolboxImport />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;



