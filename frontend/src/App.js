import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage';
import MatchingPage from './components/MatchingPage';
import HomePage from './components/HomePage';
import {Box} from "@mui/material";


function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path='/matching' element={<MatchingPage/>}/>
                        <Route path="/home" element={<HomePage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
