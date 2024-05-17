import AnimationWrapper from '../common/page-animation';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { useContext } from 'react';
import { removeFromSession } from '../common/session';

const MenuNavigationPanel = () => {
  const {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession('user');
    setUserAuth({ access_token: null });
  };
  
  // <Link to={`/user/${username}`} className='link pl-8 py-4'>
          //   Profile
          // </Link>

        //   <button
        //   className='text-left p-4 hover:bg-grey w-full pl-8 py-4'
        //   onClick={signOutUser}
        // >
        //   <h1 className='font-bold text-xl mg-1'>Sign Out</h1>
        //   <p className='text-dark-grey'>@{username}</p>
        // </button>

  return (
    access_token && <AnimationWrapper
      transition={{ duration: 0.2 }}
      className='absolute left-0 z-50'
    >
      <div className='bg-white absolute mt-3 left-0 border border-grey w-60 overflow-hidden duration-200'>
        <Link to='/' className='flex gap-2 link pl-8 py-4 text-black'>
          <p>홈</p>
        </Link>
        <Link to='/editor' className='flex gap-2 link  pl-8 py-4 text-black'>
          <p>조 관리</p>
        </Link>
        <Link to='/editor' className='flex gap-2 link pl-8 py-4 text-black'>
          <p>활동 관리</p>
        </Link>
        <Link to='/editor' className='flex gap-2 link pl-8 py-4 text-black'>
          <p>점수 기입</p>
        </Link>
        <span className='absolute border-t border-grey w-[100%]'></span>
      </div>
    </AnimationWrapper>
  );
};

export default MenuNavigationPanel;