import React, { useState, useEffect } from 'react';
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { URL_QUESTION_SVC } from "../configs";

const socket = io.connect("http://localhost:8001");

const MatchingPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { username, difficulty } = state;
    const token = document.cookie.substring(6);

    socket.emit("createPendingMatch", {username: username, token: token, difficulty: difficulty});

    socket.on("matchSuccess", (data) => {
      clearTimeout();
      return navigate('/session', {
        state: {
          roomId: data.roomId, 
          partner: data.partner, 
          difficulty: data.difficulty, 
          question: data.question
        }
      });
    })
    
    socket.on("matchFailure", () => {
      return (navigate('/home'));
    })
    
    return (
      <div style={{ justifyContent: "center", alignContent: "center", textAlign: "center"}}>
        <h2 style={{ paddingBottom: "35px" }}>Currently matching you with another person!</h2>
        <div style={{ justifyContent: "center", display: "flex"}}>
        <CountdownCircleTimer
          isPlaying
          duration={30}
          size={300}
          colors={["#42f57b", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[15, 10, 5, 0]}
          onComplete={() => ({
            shouldRepeat: false,
          })}
        >
          {({ remainingTime }) => <h1>{remainingTime === 0 ? <h5>No match found...</h5> : remainingTime}</h1>}
        </CountdownCircleTimer>
        </div>
      </div>
    )
};

export default MatchingPage;
