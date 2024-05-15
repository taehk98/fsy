import { useContext, useState } from 'react';
import logo from '../assets/fsy_logo.png';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import UserNavigationPanel from './user-navigation.component';
import { removeFromSession } from '../common/session';
import { Toaster, toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  

  let navigate = useNavigate();
  
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);


  const signOutUser = () => {
    removeFromSession('user');
    setUserAuth({ access_token: null });
    toast.success('로그아웃 되었습니다.', {
      duration: 1000 // 5초 동안 표시
    });
    // 홈페이지로 리디렉션
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  
  
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
      {access_token ? (
            <>
              <div
                className='relative'
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className='w-12 h-12 mt-1'>
                  <FontAwesomeIcon icon={faBars } size="3x" />
                </button>
                {userNavPanel ? <UserNavigationPanel /> : ''}
              </div>
              
              <div className='flex items-center gap-3 md:gap-6 ml-auto'></div>
              <button
                className='btn-dark text-left p-4 hover:bg-grey  py-4'
                onClick={signOutUser}
              >
                <h1 className='font-bold text-base mg-1'>로그아웃</h1>
            </button>
            </>
          ) : (
          <>
            <Link to='/' className='flex-none w-20'>
              <img src={logo} className='w-full rounded-full' />
            </Link>
            <div className='flex items-center gap-3 md:gap-6 ml-auto'></div>
            <Link to='/signin' className='btn-dark py-2'>
                로그인
            </Link>
          </>
        )}
      </nav>
      <Toaster />
      <Outlet />
    </>
  );
};

export default Navbar;