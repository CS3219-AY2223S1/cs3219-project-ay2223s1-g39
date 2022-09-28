import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage';
import MatchingPage from './components/MatchingPage';
import HomePage from './components/HomePage';
import SessionPage from './components/SessionPage';
import {Box} from "@mui/material";

function App() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift()
        };
    }

    function RequireAuth({ children }) {
        let isAuth = getCookie('token') !==  undefined;

        return isAuth === true ? children : <Navigate to="/login" replace />;
    }

    return (
        <div className="App">
          <Router>
              <Routes>
                  <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/signup" element={<SignupPage/>}/>
                  <Route path='/matching' element={
                      <RequireAuth>
                          <MatchingPage/>
                      </RequireAuth>
                  }/>
                  <Route path="/home" element={
                      <RequireAuth>
                          <HomePage/>
                      </RequireAuth>
                  }/>
                  <Route path="/session" element={
                      <RequireAuth>
                          <SessionPage/>
                      </RequireAuth>
                  }/>
              </Routes>
          </Router>
        </div>
    );
}

export default App;
