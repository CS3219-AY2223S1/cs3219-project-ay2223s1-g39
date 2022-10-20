import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import { URL_HISTORY_SVC } from "../configs";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid
} from "@mui/material";
import logo from '../assets/logo.png';
import homePageImage from '../assets/homePageImage.svg'
import difficulties from '../utils/difficulties';

const useStyles = createUseStyles({
  homePage: {
    height: "100vh",
    backgroundColor: "#b5dce9",
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
  bannerRight: {
    display: "flex",
    alignItems: "center"
  },
  logo: {
    margin: "20px 0 20px 20px",
    height: "35px",
    width: "auto",
  },
  changePasswordButton: {
    margin: "20px 20px 20px 0px",
  },
  logoutButton: {
    margin: "20px 20px 20px 0px",
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
    padding: "15px 20px 20px 20px",
    borderRadius: "20px",
    backgroundColor: "white",
    boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 12px",
    lineHeight: "0.8"
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
    width: "80%",
    height: "350px",
    padding: "15px 15px",
    borderRadius: "10px",
    maxWidth:"100%",
    maxHeight: "100%",
  },
  featureCardPrompt: {
    display: "flex",
    justifyContent: "center",
    lineHeight: "1",
    margin: "0 0 0 10px"
  },
  sortByDiv: {
    display: "flex",
    justifyContent: "center",
    fontSize: "14px",
    color: "#cccccc"
  },
  sortByButton: {
    background: "transparent",
    border: "none",
    fontSize: "14px",
    color: "#cccccc"
  },
  sortBySelected: {
    color: "#767676",
    fontWeight: "bold",
    textDecoration: "underline"
  },
  difficultyButton: {
    margin: "0px 10px"
  },
  selectionBoxesContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "10px",
    width: "100%",
    margin: "auto",
  },
  selectionBox: {
    border: "1px solid #0275d8",
    borderRadius: "10px",
    margin: "15px auto",
    display: "flex",
    height: "30px",
    width: "60%",
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
    textTransform: "none",
    fontWeight: "bold"
  }, 
  chosenDifficulty: {
    backgroundColor: "#0275d8",
    color: "white"
  },
  recentAttemptsContent: {
    margin: "0 10px",
    overflow: "scroll"
  },
  recentAttemptEntry: {
    display: "flex",
    alignContent: "bottom"
  },
  easy: {
    color: "#95b634",
    fontSize: "16px",
    fontWeight: "bold"
  },
  medium: {
    color: "#fda172",
    fontSize: "16px",
    fontWeight: "bold"
  },
  hard: {
    color: "#ed2939",
    fontSize: "16px",
    fontWeight: "bold"
  },
  attemptDate: {
    marginLeft: "10px",
    color: "#cccccc",
    fontSize: "16px",
    fontStyle: "italic",
  },
  homePageImage: {
    position: "absolute",
    width: "30%",
    bottom: "0",
    right: "2.5%",
  },
  logoutDialogOptions: {
    textTransform: "none",
    fontWeight: "bold",
    margin: "5px",
    height: "30px"
  }
})

const difficultyMap = {
  easy: 1,
  medium: 2,
  hard: 3
}

const HomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [user, setUser] = useState(localStorage.getItem('username') || 'User');
  const [history, setHistory] = useState({})
  const [historyByDate, setHistoryByDate] = useState({});
  const [historyByDifficulty, setHistoryByDifficulty] = useState({});
  const [quote, setQuote] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortHistoryBy, setSortHistoryBy] = useState("date");

  // Fetch quote for header card
  useEffect(() => {
    fetch("https://type.fit/api/quotes")
      .then((res) => res.json())
      .then((data) => setQuote(data[Math.floor(Math.random() * data.length)]))
  }, [])

  useEffect(() => {
    const reqConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: `${user}`})
    }
    fetch(`${URL_HISTORY_SVC}` + '?' + `${document.cookie}`, reqConfig)
      .then((res) => res.json())
      .then((data) => {
        const dataHistoryByDate = [...data.history].reverse();
        setHistoryByDate(dataHistoryByDate)
        setHistory(dataHistoryByDate);

        const dataHistoryByDifficulty = [...data.history]
          .sort((a, b) => difficultyMap[a.difficulty] - difficultyMap[b.difficulty]);
        setHistoryByDifficulty(dataHistoryByDifficulty);
      })
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // Force token to expire.
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    navigate('/login');
  }

  const handleDifficultySelection = (difficulty) => {
    setSelectedDifficulty(difficulty);
  }

  const handleSortByChange = (sortBySelected) => {
    setSortHistoryBy(sortBySelected);
    if (sortBySelected === 'date') {
      console.log("date");
      console.log(historyByDate);
      setHistory(historyByDate);
    } else if (sortBySelected === 'difficulty') {
      console.log("diffculty");
      console.log(historyByDifficulty);
      setHistory(historyByDifficulty);
    } else {
      throw new Error("Unknown sort parameter.")
    }
  }

  const openDialog = () => setIsDialogOpen(true);

  const closeDialog = () => setIsDialogOpen(false);

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

  const renderLearningHistoryComponent = () => {
    return (
      <div className={classes.featureCard}>
        <h2 className={classes.featureCardPrompt}>Most Recent Attempts</h2>
        <div className={classes.sortByDiv}>
          <p>Sort By:
            <button 
              className={`${classes.sortByButton} ${sortHistoryBy === 'date' ? classes.sortBySelected : ''}`}
              onClick={() => handleSortByChange('date')}
              value="date"
            >Date (Most Recent)</button>
            |
            <button 
              className={`${classes.sortByButton} ${sortHistoryBy === 'difficulty' ? classes.sortBySelected : ''}`}
              onClick={() => handleSortByChange('difficulty')}
            >Difficulty</button></p>
        </div>
        { history.length === 0 && <p className={classes.noAttemptsPrompt}>No recent attempts found.</p>}
        { history.length > 0 && 
          <div className={classes.recentAttemptsContent}>
            { history.map((prev) => {
              return (
                <div className={classes.recentAttemptEntry}>
                  <p className={`${classes.recentAttemptTitle} ${classes[prev.difficulty]}`}>
                    {prev.question}
                  </p>
                  <p className={classes.attemptDate}>{`${new Date(prev.attemptedAt).toLocaleDateString()}`}</p>
                </div>
              )
            })}
          </div>
        }
      </div>
    )
  }

  return (
    <div className={classes.homePage}>
      <div className={classes.banner}>
        <img src={logo} className={classes.logo}></img>
        <div className={classes.bannerRight}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/passwordchange')}
            sx={{ fontWeight: "bold", height: 40 }}
            className={classes.changePasswordButton}
          >
            Change Password
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={openDialog}
            sx={{ fontWeight: "bold", height: 40 }}
            className={classes.logoutButton}
          >
            Logout
          </Button>
        </div>
      </div>
      
      <div className={classes.pageBody}>
        <div className={classes.welcomePrompt}>
          <h1>Welcome back {user}! 👋</h1>
          <p><i>{quote.text} - {quote.author ? quote.author : "Unknown"}</i></p>
        </div>

        <Grid container className={classes.mainContent}>
        <Grid item xs={4}>
            <div className={`${classes.featureCardContainer}`}>
              {renderLearningHistoryComponent()}
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={`${classes.featureCardContainer}`}>
              {renderMatchFindComponent()}
            </div>
          </Grid>
        </Grid>
        
        <Dialog open={isDialogOpen} onClose={closeDialog} className={classes.logoutDialog}>
            <DialogContent>
              <DialogContentText sx={{ textAlign: "center", fontWeight: "bold" }}>
                You are about to log out. Continue?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} className={classes.logoutDialogOptions}>
                <p>
                  Return
                </p>
              </Button>
              <Button onClick={handleLogout} className={classes.logoutDialogOptions}>
                <p style={{ fontWeight: "bold", color: "red"}}>
                  Confirm
                </p>
              </Button>
            </DialogActions>
          </Dialog>
      </div>
      <div className={classes.homePageImage}>
        <img src={homePageImage} alt="homepage-image"></img>
      </div>
    </div>
  )
}

export default HomePage;