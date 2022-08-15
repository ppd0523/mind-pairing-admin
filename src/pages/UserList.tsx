import React, {useEffect, useState} from 'react';
import {User, useServer} from "../components/DataProvider";


function UserList() {
  const server = useServer();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(()=>{
    (async function(){
      const data = await server.allUsers(1, 20);
      console.log(data);

      setUsers(data.userEntitiesList);
    })();
  }, []);

  return (
    <>
      <h1>user page</h1>
      <table>
        <caption>User list</caption>
        <thead>
          <tr>
            <td>ID</td>
            <td>NAME</td>
            <td>MBTI</td>
            <td>STATUS</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User)=><tr>
            <td>{user.id}</td>
            <td>{user.mbti}</td>
            <td>{user.role}</td>
            <td>{user.status}</td>
          </tr>)}
        </tbody>
      </table>
    </>
  );
}

export default UserList;