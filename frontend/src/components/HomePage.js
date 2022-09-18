import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import {
  Button,
} from "@mui/material";

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

const HomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const difficulties = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard"
  };

  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [user, setUser] = useState(localStorage.getItem('username') || 'User');

  const handleDifficultySelection = (difficulty) => {
    setSelectedDifficulty(difficulty);
  }

  const handleCreateMatch = () => {
    return navigate('/matching', {state: {username: user, difficulty: selectedDifficulty}})
  }

  const SelectionBox = (props) => {
    const isSelected = props.difficulty === selectedDifficulty ;
    return (
      <div className={`${classes.selectionBox} ${isSelected ? classes.chosenDifficulty : ''}`}
        onClick={() => handleDifficultySelection(props.difficulty)}>
        {difficulties[props.difficulty]}
      </div>
    )
  }

  return (
    <div> 
      <h2>Welcome back {user}!</h2>
      <h4>Back for another grind?</h4>
      <br/>
      <h3 className={classes.selectionPrompt}>Select your desired difficulty level below:</h3>
      <div className={classes.selectionBoxesContainer}>
        {Object.keys(difficulties).map((difficulty) => <SelectionBox key={difficulty} difficulty={difficulty} />)}
      </div>
      <br/>
      <Button className={`${classes.findMatchBtn}`} variant={"contained"} size={"large"} onClick={handleCreateMatch}>Find me a match!</Button>
    </div>
  )
}

export default HomePage;