import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import About from './pages/About';
import Home from './pages/Home';
import Help from './pages/Help'
import { useState } from 'react';
import Edit from './pages/Edit';

function App() {

  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));


  return (
    <Router>
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
      <Routes>
        <Route index element={<Home isAuth={isAuth}/>} />
        <Route path='/createpost' element={<CreatePost isAuth={isAuth}/>} />
        <Route path='/about' element={<About />} />
        <Route path='/help' element={<Help />} />
        <Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
        <Route path='/edit/:postId' element={<Edit/>} />
      </Routes>
    </Router>
  );
}

export default App;

