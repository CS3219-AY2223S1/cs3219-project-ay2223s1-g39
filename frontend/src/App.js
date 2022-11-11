import React from 'react';
import axios from 'axios';
import https from 'https';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage';
import MatchingPage from './components/MatchingPage';
import HomePage from './components/HomePage';
import PasswordChangePage from './components/PasswordChangePage';
import SessionPage from './components/SessionPage';
import SyncProvider from "./SyncProvider"
import {createUseStyles} from 'react-jss';
import { URL_TWILIO_SVC } from "./configs";

const useStyles = createUseStyles({
  app: {
    height: "100vh"
  }
})

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

function App() {
    const classes = useStyles();
    
    const getToken = async () => {
      const response = await axiosInstance.post(`${URL_TWILIO_SVC}`);
      const data = response.data;
      return data.token;
    };

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
        <div className={classes.app}>
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
                  <Route path='/passwordchange' element={
                      <RequireAuth>
                          <PasswordChangePage/>
                      </RequireAuth>
                  }/>
                  <Route path="/session" element={
                      <RequireAuth>
                        <SyncProvider tokenFunc={getToken}>
                            <SessionPage/>
                        </SyncProvider>
                      </RequireAuth>
                  }/>
              </Routes>
          </Router>
        </div>
    );
}

export default App;
