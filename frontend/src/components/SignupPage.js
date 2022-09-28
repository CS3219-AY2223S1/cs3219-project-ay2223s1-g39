import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
    Grid
} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_CONFLICT, STATUS_CODE_CREATED} from "../constants";
import {Link} from "react-router-dom";
import { createUseStyles } from 'react-jss';
import signupPageImage from '../assets/signupPageImage.svg';

const useStyles = createUseStyles({
  leftPortion: {
    textAlign: "center",
    margin: "auto",
    backgroundColor: "#b5dce9",
    padding: "160px 0px"
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
  signupPromptContainer: {
    justifyContent: "center", 
    display: "flex"
  },
  signupButton: {
    height: "45px",
    margin: "10px 0px",
    textTransform: "Capitalize"
  }
})

function SignupPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogMsg, setDialogMsg] = useState("")
    const [isSignupSuccess, setIsSignupSuccess] = useState(false)
    const classes = useStyles();

    const handleSignup = async () => {
        setIsSignupSuccess(false)
        const res = await axios.post(URL_USER_SVC + "/signup", { username: username, password: password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_CONFLICT) {
                    setErrorDialog('This username already exists')
                } else {
                    setErrorDialog('Please try again later')
                }
            })
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccessDialog('Account successfully created')
            setIsSignupSuccess(true)
        }
    }

    const closeDialog = () => setIsDialogOpen(false)

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Success')
        setDialogMsg(msg)
    }

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true)
        setDialogTitle('Error')
        setDialogMsg(msg)
    }

    return (
      <Grid container width={"100%"} height={"100%"}>
        <Grid item xs={8}>
          <div className={classes.leftPortion}>
            <h1 className={classes.quote}>Join a network of like-minded individuals.</h1>
            <img src={signupPageImage} className={classes.signupPageImage}/>
          </div>
        </Grid>
        <Grid item xs={4}>
        <div className={classes.rightPortion}>
        <div className={classes.signupContainer}>
          <div className={classes.signupPromptContainer}></div>
              <Box display={"flex"} flexDirection={"column"} sx={{width: "80%"}}>
                  <Typography variant={"h4"}>
                    <strong>Create an Account</strong>
                  </Typography>
                  <Typography variant={"p"} marginBottom={"1rem"} lineHeight={"1.5rem"}>
                    <p>Get connected with many others like you, preparing for their dream technical job. </p>
                  </Typography>
                  <TextField
                      label="Username"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      sx={{marginBottom: "2rem"}}
                      autoFocus
                  />
                  <TextField
                      label="Password"
                      variant="outlined"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{marginBottom: "3rem"}}
                  />
                  <Button className={classes.signupButton} variant={"contained"} onClick={handleSignup}>Sign up</Button>
                  <br />
                  <Typography variant={"p"} marginBottom={"1rem"}>
                    <p>Already have an account? Log in <Link to="/login">here</Link>.</p>
                  </Typography>
                  <Dialog
                      open={isDialogOpen}
                      onClose={closeDialog}
                  >
                      <DialogTitle>{dialogTitle}</DialogTitle>
                      <DialogContent>
                          <DialogContentText>{dialogMsg}</DialogContentText>
                      </DialogContent>
                      <DialogActions>
                          {isSignupSuccess
                              ? <Button component={Link} to="/login">Log in</Button>
                              : <Button onClick={closeDialog}>Done</Button>
                          }
                      </DialogActions>
                  </Dialog>
              </Box>
              </div>
        </div>
      </Grid>
    </Grid> 
    )
}

export default SignupPage;
