import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid
} from "@mui/material";
import { useState } from "react";
import { URL_USER_SVC } from "../configs";
import { Navigate, Link } from "react-router-dom";
import { createUseStyles } from 'react-jss';
import loginPageImage from '../assets/loginPageImage.svg';

const useStyles = createUseStyles({
  leftPortion: {
    textAlign: "center",
    margin: "auto",
  },
  quote: {
    colour: "#a9a9a9",
  },
  loginPageImage:{ 
    width: "60%"
  },
  rightPortion: {
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  loginContainer: {
    width: "100%",
    margin: "20px auto",
    padding: "50px 20px",
    borderRadius: "10px",
    // boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
    justifyContent: "center",
    alignContent: "center",
  },
  loginPromptContainer: {
    justifyContent: "center", 
    display: "flex" 
  },
  loginContainerButton: {
    height: "45px",
    margin: "10px 0px",
    textTransform: "Capitalize"
  }
})

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const classes = useStyles();

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true)
    setDialogMsg(msg)
}

  const closeDialog = () => setIsDialogOpen(false);

  const handleLogin = () => {
    setIsLoginSuccess(false)

    const credentials = { username: username, password: password };

    fetch(URL_USER_SVC + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "success!") {
          setSuccessDialog("Successfully logged in!")
          setIsLoginSuccess(true)
          document.cookie = "token=" + res.user.token
          localStorage.setItem('username', res.user.username);
          localStorage.setItem('id', res.user._id);
        } else {
          setErrorDialog("Invalid credentials!")
        }
      })
      .catch((error) => console.log(error))
  };

  return (  
    <Grid container sx={{height: "100%"}}>
      <Grid item xs={8} sx={{backgroundColor:"#b5dce9", height: "100%"}}>
        <div className={classes.leftPortion}>
          <h1 className={classes.quote}>Built for Coders, by coders.</h1>
          <img src={loginPageImage} className={classes.loginPageImage}/>
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className={classes.rightPortion}>
        <div className={classes.loginContainer}>
          <div className={classes.loginPromptContainer}>
            <Box display={"flex"} flexDirection={"column"} sx={{width: "80%"}}>
              <Typography variant={"h4"}>
                <strong>Welcome Back!</strong>
              </Typography>
              <Typography variant={"p"} marginBottom={"1rem"}>
                <p>Some text here to make it look slightly fancy :)</p>
              </Typography>
              <br />
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: "2rem" }}
                autoFocus
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: "3rem" }}
              />
              <Button className={classes.loginContainerButton} onClick={handleLogin} variant={"contained"}>
                Login
              </Button>
              <Button className={classes.loginContainerButton} variant={"outlined"} component={Link} to="/signup">
                New here? Click here to sign up!
              </Button>
              
              <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogContent sx={{ textTransform: "capitalize" }}>
                  <DialogContentText sx={{ textAlign: "center", fontWeight: "bold" }}>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                  {isLoginSuccess 
                    ? <Navigate to="/home" />
                    : (
                    <Button component={Link} to="/signup">
                      Click here to sign up!
                    </Button>
                  )}
                </DialogActions>
              </Dialog>


            </Box>
          </div>
        </div>
        </div>
      </Grid>
    </Grid> 
  );
};

export default LoginPage;
