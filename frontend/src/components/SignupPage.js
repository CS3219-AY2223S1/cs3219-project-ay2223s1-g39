import {
    Alert,
    Box,
    Button,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_CREATED} from "../constants";
import { useNavigate, Link } from "react-router-dom";
import { createUseStyles } from 'react-jss';
import signupPageImage from '../assets/signupPageImage.svg';

const useStyles = createUseStyles({
  leftPortion: {
    textAlign: "center",
    marginTop: "10%"
  },
  quote: {
    marginBottom: "50px",
    colour: "#a9a9a9",
  },
  signupPageImage:{ 
    maxWidth: "60%"
  },
  rightPortion: {
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  signupContainer: {
    display: "flex",
    width: "100%",
    margin: "20px auto",
    padding: "50px 20px",
    justifyContent: "center",
    alignContent: "center"
  },
  alertBanner: {
    marginBottom: "10px"
  },
  signupPromptContainer: {
    justifyContent: "center", 
    display: "flex"
  },
  signupButton: {
    height: "45px",
    margin: "10px 0px",
    textTransform: "Capitalize",
    fontWeight: "bold"
  },
  passwordMismatch: {
    margin: "5px 0",
    fontSize: "12px",
    fontStyle: "italic",
    color: "#898989"
  }
})

function SignupPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const classes = useStyles();

    const navigate = useNavigate();

    const passwordsMatch = password === confirmPassword;

    const handleSignup = async () => {
        if (password.length < 5) return setErrorMessage("Your password must be at least 5 characters long.")
        if (!passwordsMatch) return setErrorMessage('Passwords do not match.')
        console.log("post!");
        const res = await axios.post(URL_USER_SVC + "/signup", { username: username, password: password })
            .catch((err) => {
                if (err.response.status !== STATUS_CODE_CREATED) {
                    setErrorMessage(err.response.data.message)
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
          return navigate('/login', {
            state: {
              registrationSuccess: true
            }
          });
        }
    }

    return (
      <Grid container height={"100%"}>
        <Grid item xs={8} sx={{backgroundColor:"#b5dce9", height: "100%"}}>
          <div className={classes.leftPortion}>
            <h1 className={classes.quote}>Join a network of like-minded individuals.</h1>
            <img alt="people-in-front-of-computer" src={signupPageImage} className={classes.signupPageImage}/>
          </div>
        </Grid>
        <Grid item xs={4}>
        <div className={classes.rightPortion}>
        <div className={classes.signupContainer}>
          <div className={classes.signupPromptContainer}></div>
              <Box display={"flex"} flexDirection={"column"} sx={{width: "80%"}}>
                  {errorMessage && <Alert severity="error" className={classes.alertBanner}>{errorMessage}</Alert>}
                  <Typography variant={"h4"}>
                    <strong>Create an Account</strong>
                  </Typography>
                  <Typography variant={"p"} marginBottom={"1rem"} lineHeight={"1.5rem"}>
                    <p>Get connected with many others just like you, preparing for their dream tech job. </p>
                  </Typography>
                  <TextField
                      label="Username"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      sx={{marginBottom: "1.5rem"}}
                      autoFocus
                  />
                  <TextField
                      label="Password"
                      variant="outlined"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{marginBottom: "1.5rem"}}
                  />
                  <TextField
                      label="Confirm Password"
                      variant="outlined"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {!passwordsMatch && <label className={classes.passwordMismatch}>Passwords do not match!</label>}
                  <br/>
                  <Button className={classes.signupButton} variant={"contained"} onClick={handleSignup}>Sign up</Button>
                  <br />
                  <Typography variant={"p"} marginBottom={"1rem"}>
                    <p>Already have an account? Log in <Link to="/login">here</Link>.</p>
                  </Typography>
              </Box>
              </div>
        </div>
      </Grid>
    </Grid> 
    )
}

export default SignupPage;
