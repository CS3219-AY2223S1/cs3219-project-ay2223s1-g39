import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Grid
} from "@mui/material";
import logo from '../assets/logo.png'
import difficulties from '../utils/difficulties';

const useStyles = createUseStyles({
  homePage: {
    height: "100vh"
  },
  background: {
    position: "absolute"
  },
  greyTriangle: {
    width: "100%",
    height: "100%",
    background: "conic-gradient(at 50% 50%,transparent 135deg,green 0,green 225deg, transparent 0)"
  },
  banner: {
    margin: "auto",
    width: "100%",
    height:"fit-content",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    display: "flex",
  },
  logo: {
    margin: "20px 0 20px 20px",
    height: "35px",
    width: "auto",
  },
  logoutButton: {
    margin: "20px 20px 20px 0",
  },
  pageBody: {
    display: "flex",
    flexDirection:"column",
    width: "95%",
    margin: "auto",
  },
  welcomePrompt: {
    margin: "0 20px 20px 20px",
    display: "block",
    padding: "15px 20px 35px 20px",
    borderRadius: "20px",
    boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 12px"
  },
  mainContent: {
    width: "100%",
    padding: "0 20px",
    backgroundColor: "pink",
    margin: "auto",
  },
  summaryStatistics: {
    justifyContent:"center",
    backgroundColor:"pink",
    textAlign:"center"
  },
  matchFind: {

  },
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

  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [user, setUser] = useState(localStorage.getItem('username') || 'User');

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // Force token to expire.
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    navigate('/login');
  }

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

  const renderMatchFindComponent = () => {
    return (
      <div>
        <h3 className={classes.selectionPrompt}>Select your desired difficulty level below:</h3>
        <div className={classes.selectionBoxesContainer}>
          {Object.keys(difficulties).map((difficulty) => <SelectionBox key={difficulty} difficulty={difficulty} />)}
        </div>
        <Button className={`${classes.findMatchBtn}`} variant={"contained"} size={"large"} onClick={handleCreateMatch}>Find me a match!</Button>
      </div>
    )
  }

  return (
    <div className={classes.homePage}>
      <div className={classes.background}>
        <div className={classes.greyTriangle}></div>
      </div>
      
      <div className={classes.banner}>
        <img src={logo} className={classes.logo}></img>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ fontWeight: "bold", height: 35 }}
          className={classes.logoutButton}
        >
          Logout
        </Button>
      </div>
      
      <div className={classes.pageBody}>
        <div className={classes.welcomePrompt}>
          <h1>Welcome back {user}!</h1>
          <p><i>Inspiring Quote here. Fetch from some API.</i></p>
        </div>

        <Grid container className={classes.mainContent}>
          <Grid item spacing={3} xs={4} sx={{border: "1px solid black"}}>
            <div className={`${classes.featureCard} ${classes.summaryStatistics}`}>
              Summary Statistics Component
            </div>
          </Grid>
          <Grid item spacing={3} xs={4} sx={{border: "1px solid red"}}>
            <div className={`${classes.featureCard} ${classes.matchFind}`}>
              {renderMatchFindComponent()}
            </div>
          </Grid>
          <Grid item spacing={3} xs={4} sx={{border: "1px solid red"}}>
            <div className={`${classes.featureCard} ${classes.historyService}`}>
              Learning History Service
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default HomePage;