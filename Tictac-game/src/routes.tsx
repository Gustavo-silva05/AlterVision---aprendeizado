import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Game from './routes/Game'
import Home from './routes/Home'
import History from './routes/History'
const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Game" element={<Game />} />
                <Route path="/Game/:id" element={<Game />} />
                <Route path="/History" element={<History />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;