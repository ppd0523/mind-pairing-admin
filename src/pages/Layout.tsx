import React, {useEffect} from 'react';
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {useServer} from "../components/DataProvider";
import Login from "./Login";


function Layout() {
  const server = useServer();
  const navigator = useNavigate();

  useEffect(()=>{
    (async function(){
      await server.checkLogin();
      if(!server.isLogin) navigator('/login');
    })();


  }, [])

  return (
    <>
      <nav>
        <ul>
          <NavLink to="users"><li>회원</li></NavLink>
          <NavLink to="posts"><li>게시글</li></NavLink>
        </ul>
      </nav>
      <header>
        title
      </header>
      <main>
        <Outlet/>
      </main>
    </>
  );
}

export default Layout;