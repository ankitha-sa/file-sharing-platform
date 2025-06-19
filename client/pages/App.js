// client/App.js

import LoginPage from './pages/login';
import Home from './pages/home';

function App() {
  const isAuthenticated = localStorage.getItem('token'); // JWT stored after login

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

