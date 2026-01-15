import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import { LanguageProvider } from './context/LanguageContext.jsx';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;

