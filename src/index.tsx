import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './index.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import {DataProvider} from "./components/DataProvider";
import Layout from "./pages/Layout";
import UserList from "./pages/UserList";



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <DataProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="" element={<Home/>}/>
          <Route path="/users" element={<UserList/>}/>
          <Route path="/posts" element={<h1>Posts</h1>}/>
        </Route>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </Router>
  </DataProvider>
);
