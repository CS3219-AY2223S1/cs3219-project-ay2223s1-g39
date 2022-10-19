import {
  Alert,
  Box,
  Button,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { URL_USER_SVC } from "../configs";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createUseStyles } from 'react-jss';
import loginPageImage from '../assets/loginPageImage.svg';

const useStyles = createUseStyles({
  leftPortion: {
    paddingTop: "3%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
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
    justifyContent: "center",
    alignContent: "center",
  },
  alertBanner: {
    marginBottom: "10px"
  },
  loginPromptContainer: {
    justifyContent: "center", 
    display: "flex" 
  },
  loginContainerButton: {
    height: "45px",
    margin: "10px 0px",
    textTransform: "none",
    fontWeight: "bold"
  }
})

const LoginPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const classes = useStyles();
  console.log(state);

  const resetAlerts = () => {
    if (state) {
      state.registrationSuccess = false
    };
    setErrorMessage("");
  }

  const handleLogin = () => {
    resetAlerts();
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
        if (res.message === "Success!") {
          document.cookie = "token=" + res.user.token
          localStorage.setItem('username', res.user.username);
          localStorage.setItem('id', res.user._id);
          return navigate('/home');
        } else {
          setErrorMessage("Invalid credentials!")
        }
      })
      .catch((error) => console.log(error))
  };

  return (  
    <Grid container sx={{height: "100%"}}>
      <Grid item xs={8} sx={{backgroundColor:"#b5dce9", height: "100%"}}>
        <div className={classes.leftPortion}>
          <div>
            <h1 className={classes.quote}>Built with love for coders, by coders. ❤️</h1>
          </div>
          <div>
            <img alt="pair-programming" src={loginPageImage} className={classes.loginPageImage}/>
          </div>
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className={classes.rightPortion}>
        <div className={classes.loginContainer}>
          <div className={classes.loginPromptContainer}>
            <Box display={"flex"} flexDirection={"column"} sx={{width: "80%"}}>
            {errorMessage && <Alert severity="error" className={classes.alertBanner}>{errorMessage}</Alert>}
            {state && state.registrationSuccess && <Alert severity="success" className={classes.alertBanner}>Account successfully created.</Alert>}  
              <Typography variant={"h4"}>
                <strong>Welcome Back!</strong>
              </Typography>
              <Typography variant={"p"} marginBottom={"1rem"}>
                <p>Back for another grind?</p>
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
            </Box>
          </div>
        </div>
        </div>
      </Grid>
    </Grid> 
  );
};

export default LoginPage;
