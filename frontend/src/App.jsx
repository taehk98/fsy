import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lookInSession } from './common/session';
import HomePage from './pages/home.page';
import PageNotFound from './pages/404.page';
import Navbar from './components/navbar.component';

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
    <Router>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route index element={<HomePage />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </Router>
    // {/* <div>
    //   <a href="https://vitejs.dev" target="_blank">
    //     <img src={viteLogo} className="logo" alt="Vite logo" />
    //   </a>
    //   <a href="https://react.dev" target="_blank">
    //     <img src={reactLogo} className="logo react" alt="React logo" />
    //   </a>
    // </div>
    // <h1>Vite + React</h1>
    // <div className="card">
    //   <button onClick={() => setCount((count) => count + 1)}>
    //     count is {count}
    //   </button>
    //   <p>
    //     Edit <code>src/App.jsx</code> and save to test HMR
    //   </p>
    // </div> */}
    // {/* <p className="read-the-docs">
    //   Click on the Vite and React logos to learn more
    // </p> */}

  )
}

export default App
