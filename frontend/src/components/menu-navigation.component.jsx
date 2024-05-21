import AnimationWrapper from '../common/page-animation';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import React, { useContext } from 'react';
import { removeFromSession } from '../common/session';

const MenuNavigationPanel = () => {
  const {
    userAuth: { access_token, id },
    setUserAuth,
  } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession('user');
    setUserAuth({ access_token: null });
  };

  return (
    access_token && 
      <div className='bg-white absolute mt-3 left-0 border border-grey w-52 md:w-60 overflow-hidden duration-200'>
        <Link to='/' className='flex gap-2 link pl-8 py-3 text-black'>
          <p>홈</p>
        </Link>
        <Link to='/rank' className='flex gap-2 link pl-8 py-3 text-black'>
          <p>순위</p>
        </Link>
        {id === 'admin' && (
          <>
            <Link to='/team' className='flex gap-2 link pl-8 py-3 text-black'>
              <p>조 관리</p>
            </Link>
            <Link to='/editor' className='flex gap-2 link pl-8 py-3 text-black'>
              <p>활동 관리</p>
            </Link>
          </>
        )}
        <Link to='/editor' className='flex gap-2 link pl-8 py-3 text-black'>
          <p>점수 기입</p>
        </Link>
        <span className='absolute border-t border-grey w-[100%]'></span>
      </div>
  );
};

export default MenuNavigationPanel;