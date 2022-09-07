import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
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


const HomePage = (props) => {
  const classes = useStyles();
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [user, setUser] = useState('User'); // To change to just utilise props.user
  const [difficulties, setDifficulties] = useState(["Easy", "Medium", "Hard"]);

  const handleDifficultySelection = (difficulty) => {
    setSelectedDifficulty(difficulty);
  }

  const handleFindMatch = () => {
    console.log(`${selectedDifficulty} chosen, but the backend has yet to be implemented!`);
    // To-redirect to matching page.
  }

  const SelectionBox = (props) => {
    const isSelected = props.difficulty === selectedDifficulty ;
    return (
      <div className={`${classes.selectionBox} ${isSelected ? classes.chosenDifficulty : ''}`}
        onClick={() => handleDifficultySelection(props.difficulty)}>
        {props.difficulty}
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
        {difficulties.map((difficulty) => <SelectionBox difficulty={difficulty} />)}
      </div>
      <br/>
      <Button className={classes.findMatchBtn} variant={"contained"} size={"large"} onClick={handleFindMatch}>Find me a match!</Button>
    </div>
  )
}

export default HomePage;