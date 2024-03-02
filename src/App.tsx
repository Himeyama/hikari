import './Home'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Home from './Home';
import SignIn from './SignIn';


const App = () => {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
