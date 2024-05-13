import { useContext, useState } from 'react';
import logo from '../assets/fsy_logo.png';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import UserNavigationPanel from './user-navigation.component';
import { removeFromSession } from '../common/session';

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);


  const signOutUser = () => {
    removeFromSession('user');
    setUserAuth({ access_token: null });
  };

  const [userNavPanel, setUserNavPanel] = useState(false);

  let navigate = useNavigate();
  
  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleSearch = (e) => {
    let query = e.target.value;

    if(e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`);
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };


  return (
    <>
      <nav className='navbar flex-items bg-bgColor' >
        <Link to='/' className='flex-none w-20'>
          <img src={logo} className='w-full rounded-full' />
        </Link>

        <div className='flex items-center gap-3 md:gap-6 ml-auto'>

          {access_token ? (
            <>
              <button
                className='text-left p-4 hover:bg-grey w-full pl-8 py-4'
                onClick={signOutUser}
              >
                <h1 className='font-bold text-xl mg-1'>로그아웃</h1>
            </button>
          </>
          ) : (
            <>
              <Link to='/signin' className='btn-dark py-2'>
                로그인
              </Link>
            </>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;