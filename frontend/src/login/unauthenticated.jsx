import React from 'react';
import './unauthenticated.css';
// import Button from 'react-bootstrap/Button';
import {MessageDialog} from './messageDialog';

export function Unauthenticated(props) {
  const [id, setID] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  // async function createUser() {
  //   if(!userName || !password || !userEmail || !clubName) {
  //       setDisplayError(`⚠ Error: ${body.msg}`);
  //   }
  //   loginOrCreate(`/api/auth/create`);
  // }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({id: id, password: password}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
        const scoresAndToken = await response.json();
        console.log(scoresAndToken);
        storeInSession('user', JSON.stringify(scoresAndToken));
        setUserAuth(scoresAndToken);
        // window.dispatchEvent(new Event('storage'));
        // props.onLogin(userEmail);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <>
      <div>
        <div className='form-group'>
          <input
            className='form-control'
            type='text'
            value={id}
            onChange={(e) => setID(e.target.value)}
            placeholder='아이디를 입력하세요.'
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            placeholder='비밀번호를 입력하세요.'
          />
        </div>
        <div className="login-button">
            <button type="login" className='btn btn-primary' variant="primary" onClick={() => loginUser()}>
            로그인
            </button>
        </div>
      </div>
      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </>
  );
}
