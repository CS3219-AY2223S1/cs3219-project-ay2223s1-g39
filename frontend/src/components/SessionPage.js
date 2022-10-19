import React, { useState, useEffect } from "react";
import { Button, Grid, Select, MenuItem, Dialog,
  DialogActions,
  DialogContent,
  DialogContentText } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import starterCode from "../utils/startercode";
import difficulties from "../utils/difficulties";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useSyncState } from "../SyncProvider"
import { createUseStyles } from 'react-jss';
import { io } from 'socket.io-client';
import logo from '../assets/logo.png'
import "../index.css";

const useStyles = createUseStyles({
  mainContent: {
    display: "flex",
    height: "fit-content",
    backgroundColor: "#b5dce9",
    flexDirection: "column",
    paddingBottom: "10px"
  },
  banner: {
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
  endSessionButton: {
    margin: "20px 20px 20px 0",
  },
  questionSpace: {
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    marginTop: "20px",
    marginLeft: "15px",
    padding: "30px 10px 25px 10px",
    lineHeight: "1.8",
    borderRadius: "10px",
    overflow: "scroll",
    backgroundColor: "white",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px"
  },
  questionHeader: {
    width: "fit-content",
    margin: "0px 10px",
    lineHeight: "1",
    borderBottom: "2px solid #cccccc"
  },
  easy: {
    color: "#95b634",
    fontSize: "24px",
    fontWeight: "bold"
  },
  medium: {
    color: "#fda172",
    fontSize: "24px",
    fontWeight: "bold"
  },
  hard: {
    color: "#ed2939",
    fontSize: "24px",
    fontWeight: "bold"
  },
  questionDetails: {
    margin: "0px 10px",
    padding: "0 0 20px 0"
  },
  questionExampleContainer: {
    margin: "0",
    padding: "0"
  },
  questionExample: {
    width: "95%",
    backgroundColor: "#eeeeee",
    fontSize: "13px",
    fontFamily: "Roboto Mono",
    borderRadius: "10px",
    padding: "10px",
  },
  solutionSpace: {
    padding: "20px"
  },
  solutionSpaceBanner: {
    display:"flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  sessionInfo: {
    display: "flex",
    flexDirection:"column",
    backgroundColor: "white",
    width: "fit-content",
    alignContent: "center",
    borderRadius: "5px",
    padding: "5px 10px",
    fontSize: "15px",
  },
  sessionText: {
    margin: "0",
  },
  textArea: {
    overflowY: "scroll",
    borderRadius: "10px",
  },
  exitDialogContainer: {
    borderRadius: "10px",
    boxShadow: "box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px"
  }, 
  exitDialogOptions: {
    textTransform: "none",
    fontWeight: "bold",
    margin: "5px",
    height: "30px"
  }
})

const socket = io.connect("http://localhost:8001");

const SessionPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {roomId, partner, difficulty, question} = state;
  const [language, setLanguage] = useState("java");
  const [query, setQuery] = useState("");
  const [code, setCode] = useSyncState(`${roomId}`);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const classes = useStyles();

  // this helps to reduce the number of times setState is called, reducing funkiness while typing 
  useEffect(() => {
    const timeOutId = setTimeout(() => setCode(query), 600);
    return () => clearTimeout(timeOutId);
  }, [query]);

  const handleLanguageChange = (e) => {
    socket.emit('changeLanguage', { 
      roomId: roomId,
      lang: e.target.value
    });
    setLanguage(e.target.value);
    setCode(starterCode[e.target.value]);
  }

  const openExitDialog = () => {
    setIsExitDialogOpen(true);
  }

  const closeExitDialog = () => setIsExitDialogOpen(false);

  const openAlertDialog = () => {
    setIsAlertDialogOpen(true);
  }

  const closeAlertDialog = () => setIsAlertDialogOpen(false);

  const returnToHome = () => {
    socket.emit(`leaveRoom`, { roomId: roomId });
    navigate('/home');
  }

  socket.emit('joinRoom', {roomId: roomId});

  socket.on(`alertLeaveRoom`, () => setIsAlertDialogOpen(true));

  socket.on('handleLangChange', async (data) => {
    setLanguage(data.language);
  })

  return (
    <div className={classes.mainContent}>
      <div className={classes.banner}>
        <img src={logo} className={classes.logo}></img>
        <Button
          variant="contained"
          color="error"
          onClick={openExitDialog}
          sx={{ fontWeight: "bold", height: 40 }}
          className={classes.endSessionButton}
        >
          End Session
        </Button>
      </div>
    
      <div>
      <Grid container>
        <Grid item xs={6}>
          <div className={classes.questionSpace}>
            <div className={classes.questionHeader}>
              <h1>{question.title}</h1>
              <p className={classes[difficulty]}>{difficulties[difficulty]}</p>
            </div>
            <div className={classes.questionDetails}>
              <p>{question.question}</p>
              { question.examples.map((example, idx) => 
                {
                  return (
                    <div className={classes.questionExampleContainer}>
                      <p><b>Example {idx + 1}</b></p>
                      <div className={classes.questionExample}>
                        {example.map((line) => <div>{line.toString()}</div>)}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          </Grid>
          <Grid item xs={6}>
            <div className={classes.solutionSpace}>
              <div className={classes.solutionSpaceBanner}>
                <Select
                  sx={{ width: "150px", height: "40px", fontWeight: "bold", backgroundColor:"white"}}
                  value={language}
                  onChange={(e) => handleLanguageChange(e)}
                >
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="ruby">Ruby</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                </Select>
                <div className={classes.sessionInfo}>
                  <p className={classes.sessionText}>In a session with <b>{partner}</b></p>
                  <p className={classes.sessionText}>Room ID: <b>{roomId}</b></p>
                </div>
              </div>
              
              <div className={classes.textArea}>
                <CodeEditor
                  value={code}
                  language={language}
                  placeholder="Type your code here!"
                  onChange={(e) => setQuery(e.target.value)}
                  padding={15}
                  style={{
                    fontSize: 14,
                    minHeight: "80vh",
                    overflow: "scroll",
                    backgroundColor: "#f9f9f9",
                    color: "#384547",
                    lineHeight: "1.5",
                    fontWeight: "bold",
                    fontFamily:
                      "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                  }}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <Dialog open={isExitDialogOpen} onClose={closeExitDialog} className={classes.exitDialog}>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontWeight: "bold" }}>
            You are about the leave to room. Continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeExitDialog} className={classes.exitDialogOptions}>
            <p>
              Return
            </p>
          </Button>
          <Button onClick={returnToHome} className={classes.exitDialogOptions}>
            <p style={{ fontWeight: "bold", color: "red"}}>
              Confirm
            </p>
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAlertDialogOpen} onClose={closeAlertDialog} className={classes.exitDialog}>
        <DialogContent>
          <DialogContentText sx={{ textAlign: "center", fontWeight: "bold" }}>
            Oh no! It seems like your partner has left the room.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAlertDialog} className={classes.exitDialogOptions}>
            <p>
              Got it
            </p>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SessionPage;
