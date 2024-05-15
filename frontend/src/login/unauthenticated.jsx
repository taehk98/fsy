import React, { useContext } from 'react';
import AnimationWrapper from '../common/page-animation';
import './unauthenticated.css';
import InputBox from '../components/input.component';
import { Link, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
// import Button from 'react-bootstrap/Button';
import {MessageDialog} from './messageDialog';
import { storeInSession } from '../common/session';
import { UserContext } from '../App';

export function Unauthenticated(props) {
  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  // const [id, setID] = React.useState('');
  // const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser(e)  {
    e.preventDefault();
    // formData
    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    loginOrCreate(`/api/auth/login`, formData);
  }

  // async function createUser() {
  //   if(!userName || !password || !userEmail || !clubName) {
  //       setDisplayError(`⚠ Error: ${body.msg}`);
  //   }
  //   loginOrCreate(`/api/auth/create`);
  // }

  async function loginOrCreate(endpoint, formData) {
    const SERVER_DOMAIN = 'http://localhost:3000';
    const response = await fetch(SERVER_DOMAIN + endpoint, {
      method: 'post',
      body: JSON.stringify(formData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
        const scoresAndToken = await response.json();
        storeInSession('user', JSON.stringify(scoresAndToken));
        setUserAuth(scoresAndToken);
        window.location.href = '/teams';
    } else {
      // const body = await response.json();
      toast.error(`로그인 실패: 아이디 또는 비밀번호를 \n다시 확인해주세요.`);
    }
  }

  return access_token ? (
    <Navigate to='/' />
  ) : (
    <>
      <div className='h-cover flex flex-col items-center justify-center'>
      <Toaster/>
        <form id='formElement' className='w-[80%] max-w-[400px]'>
          <InputBox
            name='id'
            type='id'
            placeholder='아이디를 입력하세요.'
            icon='fi-rr-envelope'
          />
          <InputBox
            name='password'
            type='password'
            placeholder='비밀번호를 입력하세요.'
            icon='fi-rr-key'
          />
          <button
              className='btn-pink center mt-14'
              type='submit'
              onClick={loginUser}
            >
            로그인
          </button>
        </form>
      </div>
      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </>
  );
}
