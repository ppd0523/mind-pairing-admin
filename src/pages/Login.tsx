import React, {
  ChangeEvent, FormEvent, useEffect,
  useState,
} from 'react';
import {
  useServer,
} from "../components/DataProvider";
import {useNavigate} from "react-router-dom";
import crypto from 'crypto';


function Login() {
  const server = useServer();
  const navigator = useNavigate();
  const [userId, setUserId] = useState<string>('');
  const [userPw, setUserPw] = useState<string>('');

  useEffect(()=>{
    (async function(){
      await server.checkLogin();
      if (server.isLogin) navigator('/');
    })();
  }, [])

  const onChangeId = (event: ChangeEvent<HTMLInputElement>)=>{
    const value = event.target.value;
    console.debug(event.target.name, value);

    setUserId(value);
  }
  const onChangePw = (event: ChangeEvent<HTMLInputElement>)=>{
    const value = event.target.value;
    console.debug(event.target.name, value);

    setUserPw(value);
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    console.log("Submit and go home");
    const isLogin = await server.login(userId, userPw);
    const hashed_pw = crypto.createHash('sha256')
      .update(userPw)
      .digest('hex');

    console.log(hashed_pw);

    if(isLogin) navigator('/');
  }
  
  return (
    <form action="POST" onSubmit={onSubmit}>
      <label htmlFor="userId">
        ID<input type="text" id="userId" onChange={onChangeId} name="id"/>
      </label>
      <label htmlFor="userPw">
        PW<input type="text" id="userPw" onChange={onChangePw} name="hashed_passwd"/>
      </label>
      <button type="submit">로그인</button>
    </form>
  );
}

export default Login;