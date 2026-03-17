import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookList from './pages/BookList';
import BookForm from './pages/BookForm';
import ArchiveExplorer from './pages/ArchiveExplorer';
import BookDetails from './pages/BookDetails';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/archives" element={<ArchiveExplorer />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/add-book" element={<BookForm />} />
                <Route path="/edit-book/:id" element={<BookForm />} />
              </Route>

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
