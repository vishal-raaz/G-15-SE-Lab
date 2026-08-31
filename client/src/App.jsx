import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PaperProvider } from './context/PaperContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuestionGenerator from './pages/QuestionGenerator';
import PaperBuilder from './pages/PaperBuilder';
import PaperPreview from './pages/PaperPreview';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-surface-950">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PaperProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/generator" element={
                <ProtectedRoute>
                  <AppLayout><QuestionGenerator /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/builder" element={
                <ProtectedRoute>
                  <AppLayout><PaperBuilder /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="/preview" element={
                <ProtectedRoute>
                  <AppLayout><PaperPreview /></AppLayout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </PaperProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
