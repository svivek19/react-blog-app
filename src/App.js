import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/Navbar';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Help from './pages/Help'
import { useState } from 'react';
import Edit from './pages/Edit';
import PostDetail from './pages/PostDetail';
import UserProfileCard from './component/UserProfileCard';

function App() {

  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));



  return (
    <Router>
      <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
      <Routes>
        <Route index element={<Home isAuth={isAuth} />} />
        <Route path='/createpost' element={<CreatePost isAuth={isAuth} />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/help' element={<Help />} />
        <Route path='/login' element={<Login setIsAuth={setIsAuth} />} />
        <Route path='/edit/:postId' element={<Edit />} />
        <Route path='/post/:postId' element={<PostDetail />} />
        <Route path='/userprofile' element={<UserProfileCard />} />
      </Routes>
    </Router>
  );
}

export default App;

