import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PreviewPage from './pages/PreviewPage';
import SiteViewPage from './pages/SiteViewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/generate" element={<DashboardPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/site/:slug" element={<SiteViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
