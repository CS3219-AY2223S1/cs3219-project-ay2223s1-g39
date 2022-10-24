import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Button, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText } from "@mui/material";
import {HashLoader} from "react-spinners";
import { io } from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import { URL_MATCHING_SVC } from "../configs";

const socket = io.connect(URL_MATCHING_SVC);
const loadingMessages = [
  "Following a trail to find your coding partner...",
  "Searching far and wide, to find the one that's right...",
  "Hang on, we're finding you a buddy...",
  "Finding you a buddy, so just sit back and relax..."
]
const chosenMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

const useStyles = createUseStyles({
  matchingPage: {
    display: "flex",
    height: "100%",
    alignContent: "center",
    textAlign: "center", 
    backgroundColor: "#b5dce9",
    flexDirection: "column",
  },
  loader: {
    display: "block",
    marginTop: "10%",
    marginBottom: "10px",
    margin: "auto",
    height: "fit-content"
  },
  loadingMessage: {
    display: "block",
    color: "white",
    fontSize: "30px",
    fontWeight: "bold",
    height: "fit-content"
  },
  timeRemaining: {
    display: "block",
    color: "white",
    fontSize: "20px",
    marginBottom: "30px"
  },
  matchFailureNotif: {
    display: "block",
    color: "white",
    fontSize: "30px",
  }, 
  exitDialogOptions: {
    textTransform: "none",
    fontWeight: "bold",
    margin: "5px",
    height: "30px"
  }
})

const MatchingPage = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const { state } = useLocation();
    const { username, difficulty } = state;
    const token = document.cookie.substring(6);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFailure, setIsFailure] = useState(false);

    useEffect(() => {
      if (timeLeft === 30) {
        socket.emit("createPendingMatch", {username: username, token: token, difficulty: difficulty});
      } 
      
      if (timeLeft > 0) {
        const newTimeLeft = timeLeft - 1;
        setTimeout(() => setTimeLeft(newTimeLeft), 1000);
      } else {
        setIsFailure(true);
      }
    })

    socket.on("matchSuccess", (data) => {
      clearTimeout();
      console.log(`Match Success ${data}`);
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

    const openDialog = () => setIsDialogOpen(true);

    const closeDialog = () => setIsDialogOpen(false);

    const cancelMatching = () => {
      socket.emit("cancelMatch", {difficulty: difficulty});
      return navigate("/home");
    }
    
    return (
      <div className={classes.matchingPage}>
        <div className={classes.loader}>
          <HashLoader size={300} color={"white"} />
        </div>
        { !isFailure && 
          <div>
            <div className={classes.loadingMessage}>
              <p>{chosenMessage}</p>
            </div>
            <div className={classes.timeRemaining}>
              {timeLeft} seconds remaining...
            </div>
            <Button variant="contained" color="error" onClick={openDialog} sx={{ fontWeight: "bold", height: 40 }}> 
              Cancel 
            </Button>
            <Dialog open={isDialogOpen} onClose={closeDialog} className={classes.exitDialog}>
            <DialogContent>
              <DialogContentText sx={{ textAlign: "center", fontWeight: "bold" }}>
                You are about to exit the matching queue.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} className={classes.exitDialogOptions}>
                <p>
                  Return
                </p>
              </Button>
              <Button onClick={cancelMatching} className={classes.exitDialogOptions}>
                <p style={{ fontWeight: "bold", color: "red"}}>
                  Confirm
                </p>
              </Button>
            </DialogActions>
          </Dialog>
          </div>
        }
        { isFailure && 
          <h4 className={classes.matchFailureNotif}> 
            No suitable match found! Returning you back to the main page... 
          </h4>
        }
        
      </div>
    )
};

export default MatchingPage;
