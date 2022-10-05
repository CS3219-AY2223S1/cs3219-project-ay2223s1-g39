import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Grid
} from "@mui/material";
import logo from '../assets/logo.png'
import footer from '../assets/homePageImage.svg'
import difficulties from '../utils/difficulties';

const useStyles = createUseStyles({
  homePage: {
    height: "100vh",
    backgroundColor: "#b5dce9"
  },
  banner: {
    marginBottom: "20px",
    width: "100%",
    height:"fit-content",
    backgroundColor: "white",
    justifyContent: "space-between",
    display: "flex",
    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"
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
    margin: "0 20px 40px 20px",
    display: "block",
    padding: "15px 20px 35px 20px",
    borderRadius: "20px",
    backgroundColor: "white",
    boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 12px"
  },
  mainContent: {
    display: "flex",
    width: "100%",
    padding: "0 20px",
    zIndex: "1"
  },
  featureCardContainer: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
  },
  featureCard: {
    display: "flex",
    flexDirection: "column",
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    backgroundColor: "white",
    width: "400px",
    height: "400px",
    padding: "15px 15px",
    borderRadius: "10px"
  },
  featureCardPrompt: {
    display: "flex",
    justifyContent: "center",
  },
  difficultyButton: {
    margin: "0px 10px"
  },
  selectionBoxesContainer: {
    justifyContent: "center",
    borderRadius: "10px",
    width: "fit-content",
    margin: "auto",
  },
  selectionBox: {
    border: "1px solid #0275d8",
    borderRadius: "10px",
    margin: "15px",
    display: "flex",
    height: "40px",
    width: "250px",
    alignItems: "center",
    padding: "10px 20px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#0275d8",
    "&:hover": {
      backgroundColor: "#0275d8",
      color: "white"
    }
  },
  findMatchBtn: {
    display: "flex",
    margin: "20px auto",
    textTransform: "none"
  }, 
  chosenDifficulty: {
    backgroundColor: "#0275d8",
    color: "white"
  },
  footerDesign: {
    position: "absolute",
    height: "500px",
    width: "500px",
    bottom: "0",
    right: "0",
    zIndex: "0"
  }
})

const HomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [user, setUser] = useState(localStorage.getItem('username') || 'User');
  const [quote, setQuote] = useState('');

  // Fetch quote for header card
  useEffect(() => {
    fetch("https://type.fit/api/quotes")
      .then((res) => res.json())
      .then((data) => setQuote(data[Math.floor(Math.random() * data.length)]))
  }, [])


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
      <div className={classes.featureCard}>
        <h2 className={classes.featureCardPrompt}>Up for another round?</h2>
        <div className={classes.selectionBoxesContainer}>
          {Object.keys(difficulties).map((difficulty) => <SelectionBox key={difficulty} difficulty={difficulty} />)}
        </div>
        <Button className={`${classes.findMatchBtn}`} variant={"contained"} size={"large"} onClick={handleCreateMatch}>Find me a match!</Button>
      </div>
    )
  }

  const renderSummaryStatisticsComponent = () => {
    return (
      <div className={classes.featureCard}>
        <h2 className={classes.featureCardPrompt}>Summary</h2>
      </div>
    )
  }

  const renderLearningHistoryComponent = () => {
    return (
      <div className={classes.featureCard}>
        <h2 className={classes.featureCardPrompt}>Recent Attempts</h2>
      </div>
    )
  }

  return (
    <div className={classes.homePage}>
      <div className={classes.banner}>
        <img src={logo} className={classes.logo}></img>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ fontWeight: "bold", height: 40 }}
          className={classes.logoutButton}
        >
          Logout
        </Button>
      </div>
      
      <div className={classes.pageBody}>
        <div className={classes.welcomePrompt}>
          <h1>Welcome back {user}! 👋</h1>
          <p><i>{quote.text} - {quote.author ? quote.author : "Unknown"}</i></p>
        </div>

        <Grid container className={classes.mainContent}>
          <Grid item xs={4}>
            <div className={`${classes.featureCardContainer}`}>
              {renderSummaryStatisticsComponent()}
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={`${classes.featureCardContainer}`}>
              {renderMatchFindComponent()}
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={`${classes.featureCardContainer}`}>
              {renderLearningHistoryComponent()}
            </div>
          </Grid>
        </Grid>
      </div>
      {/*<img className={classes.footerDesign} src={footer} alt="footer-img"></img> */}
    </div>
  )
}

export default HomePage;