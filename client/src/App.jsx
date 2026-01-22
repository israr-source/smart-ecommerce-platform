import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Contact from './pages/Contact';
import About from './pages/About';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import ProfileCompletionModal from './components/ProfileCompletionModal';
import { useState, useEffect } from 'react';

// Wrapper to use hooks outside Router
const AppContent = () => {
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const location = useLocation();

  // Check user on mount and route change (in case login happened)
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Check if profile incomplete and NOT on profile page (to avoid loop or annoying overlap if editing)
        if ((!parsedUser.phone || !parsedUser.address) && parsedUser.role !== 'admin' && location.pathname !== '/profile' && location.pathname !== '/login') {
          setShowProfileModal(true);
        } else {
          setShowProfileModal(false);
        }
      } else {
        setUser(null);
        setShowProfileModal(false);
      }
    };

    checkUser();

    // Listen to custom event for login updates if we emit one, or just rely on location change re-check
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  const handleModalClose = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      setShowProfileModal(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow relative">
        <ProfileCompletionModal user={user} isOpen={showProfileModal} onClose={handleModalClose} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      {!location.pathname.startsWith('/admin') && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
