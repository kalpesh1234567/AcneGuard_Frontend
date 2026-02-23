import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protected pages
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import History from './pages/History';
import DietCheck from './pages/DietCheck';
import DietResults from './pages/DietResults';
import RecoveryCheckin from './pages/RecoveryCheckin';

// Factor info pages (public)
import SkinAnalysisFactors from './pages/SkinAnalysisFactors';
import FoodRecommendationFactors from './pages/FoodRecommendationFactors';
import DailyRoutineFactors from './pages/DailyRoutineFactors';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Factor info pages */}
                        <Route path="/factors/skin" element={<SkinAnalysisFactors />} />
                        <Route path="/factors/food" element={<FoodRecommendationFactors />} />
                        <Route path="/factors/routine" element={<DailyRoutineFactors />} />

                        {/* Protected routes */}
                        <Route path="/assessment" element={<PrivateRoute><Assessment /></PrivateRoute>} />
                        <Route path="/results" element={<PrivateRoute><Results /></PrivateRoute>} />
                        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
                        <Route path="/recovery" element={<PrivateRoute><RecoveryCheckin /></PrivateRoute>} />
                        <Route path="/diet-check" element={<PrivateRoute><DietCheck /></PrivateRoute>} />
                        <Route path="/diet-results" element={<PrivateRoute><DietResults /></PrivateRoute>} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
}

export default App;
