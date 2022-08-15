import {
  createContext, ReactNode,
  useContext, useState,
} from 'react';
import React from 'react'
import axios from 'axios';

// null: login success, 001: login already, 002: not login, 003: login fail
type ServerResponse = {
  errorCode: null|"login-001"|"login-002"|"login-003",
  errorMsg: string,
  httpStatus: number,
  data?: any
}
type User = {
  id: number,
  mbti: string,
  role: string,
  status: string,
  nickname: string|null,
  name?: string,
  sex?: 'F'|'M',
  createTime?: Date,
  deleteTime?: Date,
}

interface ServerInterface {
  isLogin: boolean,
  login: (id: string, hashed_passwd: string) => Promise<boolean>,
  logout: () => Promise<boolean>,
  checkLogin: ()=>Promise<void>,
  allUsers: (pageNo: number, pageSize: number)=>Promise<AllUsersResponse>,
}
type AllUsersResponse = {
  userEntitiesList: User[],
  total: number,
  pageNo: number,
  pageSize: 10
}
const dbContext = createContext<ServerInterface>({} as ServerInterface);

function DataProvider(props: { children?: ReactNode }) {
  const [isLogin, setLogin] = useState<boolean>(false);
  const defaultValue = {
    isLogin: isLogin,
    allUsers: (pageNo: number, pageSize: number )=>{
      return new Promise<AllUsersResponse>(function(resolve, reject){
        axios.get(`/v1/admin/user/infos?pageNo=${pageNo}&pageSize=${pageSize}`)
          .then(response=>{
            if (response.status == 200) return response.data; // 서버 통신 성공
            else reject(new Error('No server response')) // 서버 통신 실패
          })
          .then((data: ServerResponse)=>{
            console.debug(data);
            resolve({...data.data})
          });
      });
    },
    checkLogin: ()=>{
      return new Promise<void>(function(resolve, reject){
        axios.get('/v1/admin/user/infos?pageNo=1&pageSize=1')
          .then(response=>{
            if (response.status == 200) return response.data; // 서버 통신 성공
            else reject(new Error('No server response')) // 서버 통신 실패
          })
          .then((data: ServerResponse)=>{
            console.debug(data);
            if (data.errorCode == null){
              setLogin(true);
            }

            resolve()
          });
      });

    },
    login: (id: string, hashed_passwd: string) => {
      console.debug('request login ', {id, hashed_passwd});

      return new Promise<boolean>(function (resolve, reject) {
        axios.post('/v1/admin/login/', {id, hashed_passwd})
          .then(response=>{
            console.log(response);
            if (response.status == 200) return response.data; // 서버 통신 성공
            else reject(new Error('No server response')) // 서버 통신 실패
          })
          .then((data: ServerResponse)=>{
            console.log('login response data:', data);
            if (data.errorCode == null || data.errorCode == "login-001") setLogin(true);
            else setLogin(false);

            resolve(true);
          })  // end axios.post().then()

      });

    },
    logout: () => {

      return new Promise<boolean>(function(resolve, reject){

        axios.post('/v1/admin/logout/', {})
          .then(response=>{
            if(response.status === 200) return response.data;
            else reject(new Error('No server response'));
          })
          .then((data: ServerResponse)=>{
            console.log('logout response data:', data);
            if (data.errorCode == null || data.errorCode == "login-002"){
              setLogin(false);
            } else {
              // setLogin(true);
            }
            resolve(true);

          }) // end axios.post().then()

      });

    }
  };

  return (
    <dbContext.Provider value={defaultValue}>
      {props.children}
    </dbContext.Provider>
  );
}

const useServer = () => useContext(dbContext);

export {
  DataProvider,
  useServer
};
export type { User };
