import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lookInSession } from './common/session';
import HomePage from './pages/home.page';
import PageNotFound from './pages/404.page';
import Navbar from './components/navbar.component';
import {Unauthenticated} from './login/unauthenticated.jsx';

export const UserContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState(() => {
    const userInSession = lookInSession('user');
    return userInSession ? JSON.parse(userInSession) : { access_token: null };
  });

  useEffect(() => {
    let userInSession = lookInSession('user');

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index element={<HomePage />} />
            <Route path='/signin' element={<Unauthenticated />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
        <footer>
          <hr className="my-2 border-t border-gray-400" />
            <h4 className='pt-5 font-bold text-indigo text-xl'>
              <span>* 점수를 기입하려면</span><br />
              <span>로그인을 해주세요.</span>
            </h4>
        </footer>
    </UserContext.Provider>
    
  )
}

export default App
