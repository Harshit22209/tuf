import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import MainPage from './Components/MainPage';
import Submissions from './Components/Submissions';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/submissions" element={<Submissions />} />
        
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
