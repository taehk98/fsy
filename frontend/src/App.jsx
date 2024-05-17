// import './App.css'
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lookInSession } from './common/session';
import HomePage from './pages/home.page';
import PageNotFound from './pages/404.page';
import Navbar from './components/navbar.component';
import {CollapsibleTable} from './components/table.component.jsx';
import {Unauthenticated} from './login/unauthenticated.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <Route path='/rank' element={<CollapsibleTable />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
    </UserContext.Provider>
    
  )
}

export default App
