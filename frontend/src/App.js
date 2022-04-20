import './App.css';
import Navbar from './components/Navbar';
import Teach from './components/Teach';
import Home from './components/Home';
import Learn from './components/Learn';
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/teach" element={<Teach/>}></Route>
          <Route path="/learn" element={<Learn/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
