import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import RecoveryCheckin from './pages/RecoveryCheckin';
import Results from './pages/Results';
import History from './pages/History';
import SkinAnalysisFactors from './pages/SkinAnalysisFactors';
import FoodRecommendationFactors from './pages/FoodRecommendationFactors';
import DailyRoutineFactors from './pages/DailyRoutineFactors';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/assessment" element={<Assessment />} />
                    <Route path="/recovery" element={<RecoveryCheckin />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/factors/skin" element={<SkinAnalysisFactors />} />
                    <Route path="/factors/food" element={<FoodRecommendationFactors />} />
                    <Route path="/factors/routine" element={<DailyRoutineFactors />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
