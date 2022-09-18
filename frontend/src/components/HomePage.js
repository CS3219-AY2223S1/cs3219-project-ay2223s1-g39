import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
  Button,
} from "@mui/material";
import MatchingPage from './MatchingPage';

const useStyles = createUseStyles({
  difficultyButton: {
    margin: "0px 10px"
  },
  selectionPrompt: {
    display: "flex",
    justifyContent: "center",
  },
  selectionBoxesContainer: {
    justifyContent: "center",
    borderRadius: "10px",
    width: "fit-content",
    margin: "auto",
  },
  selectionBox: {
    borderBottom: "1px solid black",
    display: "flex",
    height: "80px",
    width: "500px",
    alignItems: "center",
    padding: "10px 20px",
    fontSize: "24px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#cccccc",
    }
  },
  findMatchBtn: {
    display: "flex",
    margin: "20px auto",
  }, 
  chosenDifficulty: {
    backgroundColor: "#cccccc"
  }
})

const socket = io.connect("http://localhost:8001");

const HomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [user, setUser] = useState(localStorage.getItem('username') || 'User'); // To change to just utilise props.user
  const [partner, setPartner] = useState('');
  const [difficulties, setDifficulties] = useState(["Easy", "Medium", "Hard"]);
  const [status, setStatus] = useState("idle");
  const [roomId, setRoomId] = useState('');

  const handleDifficultySelection = (difficulty) => {
    setSelectedDifficulty(difficulty);
  }

  const handleMatchFailure = () => {
    setSelectedDifficulty('');
    setStatus("idle");
    //alert("No compatible match found. Try again later!");
  }

  const handleCreateMatch = () => {
    if (selectedDifficulty) {
      socket.emit("createPendingMatch", {username: user, difficulty: selectedDifficulty});
    }
  }

  socket.on("createRoom", (data) => {
    setStatus("waiting");
    socket.emit('room', {room_id: data.roomId});
  })

  socket.on("matchSuccess", (data) => {
    setRoomId(data.roomId);
    setPartner(data.partner);
    setStatus("in-room");
    clearTimeout();
  })

  socket.on("matchFailure", (data) => {
    handleMatchFailure();
  })

  const SelectionBox = (props) => {
    const isSelected = props.difficulty === selectedDifficulty ;
    return (
      <div className={`${classes.selectionBox} ${isSelected ? classes.chosenDifficulty : ''}`}
        onClick={() => handleDifficultySelection(props.difficulty)}>
        {props.difficulty}
      </div>
    )
  }

  if (status === 'waiting') {
    return (
      <MatchingPage />
    )
  } else if (status === 'in-room') { 
    return navigate('/session', {state: {roomId: roomId, partner: partner, difficulty: selectedDifficulty}});
  } else {
    return (
      <div> 
        <h2>Welcome back {user}!</h2>
        <h4>Back for another grind?</h4>
        <br/>
        <h3 className={classes.selectionPrompt}>Select your desired difficulty level below:</h3>
        <div className={classes.selectionBoxesContainer}>
          {difficulties.map((difficulty) => <SelectionBox key={difficulty} difficulty={difficulty} />)}
        </div>
        <br/>
        <Button className={`${classes.findMatchBtn}`} variant={"contained"} size={"large"} onClick={handleCreateMatch}>Find me a match!</Button>
      </div>
    )
  }
}

export default HomePage;