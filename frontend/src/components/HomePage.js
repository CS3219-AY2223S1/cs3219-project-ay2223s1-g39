import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { io } from 'socket.io-client';
import MatchingPage from './MatchingPage';
import {
  Button,
} from "@mui/material";
import { alignProperty } from '@mui/material/styles/cssUtils';

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

const HomePage = (props) => {
  const classes = useStyles();
  const [firstPlayer, setFirstPlayer] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [user, setUser] = useState('User'); // To change to just utilise props.user
  const [difficulties, setDifficulties] = useState(["Easy", "Medium", "Hard"]);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleDifficultySelection = (difficulty) => {
    setSelectedDifficulty(difficulty);
  }

  const handleMatchFailure = () => {
    setSelectedDifficulty('');
    setIsWaiting(false);
  }

  const handleCreateMatch = () => {
    console.log("Creating Match detected!");
    setFirstPlayer(true);
    const playerName = user;
    socket.emit("createMatch", {userOne: playerName, difficulty: selectedDifficulty}); // Emit event createGame
  }

  socket.on("pendingMatch", (data) => {
    setIsWaiting(true);
    setTimeout(handleMatchFailure, 30000);
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

  if (isWaiting) {
    return (
      <MatchingPage />
    )
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
        <Button className={`${classes.findMatchBtn}`} variant={"contained"} size={"large"} onClick={handleCreateMatch}>Create me a match!</Button>
      </div>
    )
  }
}

export default HomePage;