import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField
} from "@mui/material";
import logo from '../assets/logo.png';
import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_OK, STATUS_CODE_BAD_REQUEST} from "../constants";

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
  passwordChangeCardContainer: {
    display: "flex",
    margin: "auto",
    height: "fit-content",
    backgroundColor: "white",
    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
    borderRadius: "10px"
  },
  passwordChangeCard: {
    padding: "40px",
    display: "block",
    margin: "auto",
  },
  backButton: {
    border: "none",
    backgroundColor: "transparent",
    fontSize: "16px",
    fontStyle: "italic",
    color: "#898989",
    cursor: "pointer",
    marginBottom: "20px",
  },
  changePasswordButton: {
    height: "45px",
    margin: "10px auto",
    textTransform: "Capitalize",
    fontWeight: "bold"
  },
  passwordMismatch: {
    display: "block",
    margin: "5px 0",
    fontSize: "12px",
    fontStyle: "italic",
    color: "#898989"
  }
})

const PasswordChangePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [user, setUser] = useState(localStorage.getItem('username') || 'User');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isPasswordChangeDialogOpen, setIsPasswordChangeDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successfulReset, setSuccessfulReset] = useState(false);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // Force token to expire.
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    navigate('/login');
  }

  const clearInput = () => {
    setCurrentPassword('');
    setNewPassword('');
    setNewConfirmPassword('');
  }

  const handlePasswordChange = async () => {
    setErrorMessage('');
    setSuccessfulReset(false);

    if (newPassword.length < 5) return setErrorMessage("Your password must be at least 5 characters long.")
    if (!passwordsMatch) return setErrorMessage("Your new password does not match. Please check again.");
    if (newPassword === currentPassword) return setErrorMessage("Your current password and new password cannot be the same!");
    const reqBody = {
      username: user,
      oldPassword: currentPassword,
      newPassword: newConfirmPassword,
      token: document.cookie.split('=')[1]
    }
    const res = await axios.put(URL_USER_SVC + "/update-password", reqBody)
      .catch((err) => {
        if (err.response.status !== STATUS_CODE_OK) {
          console.log(err);
          if (err.response.status === STATUS_CODE_BAD_REQUEST) setErrorMessage("Invalid Credentials! Please check your password again.")
          
          setErrorMessage(err.response.data.message)
        }
      })
    
    if (res && res.status === STATUS_CODE_OK) {
      clearInput();
      setSuccessfulReset(true);
    }
    
    closePasswordChangeDialog();
  }

  const passwordsMatch = newPassword === newConfirmPassword;

  const openLogoutDialog = () => setIsLogoutDialogOpen(true);
  const closeLogoutDialog = () => setIsLogoutDialogOpen(false);
  const openPasswordChangeDialog = () => setIsPasswordChangeDialogOpen(true);
  const closePasswordChangeDialog = () => setIsPasswordChangeDialogOpen(false);

  return (
    <div className={classes.homePage}>
      <div className={classes.banner}>
        <img src={logo} className={classes.logo}></img>
        <Button
          variant="contained"
          color="error"
          onClick={openLogoutDialog}
          sx={{ fontWeight: "bold", height: 40 }}
          className={classes.logoutButton}
        >
          Logout
        </Button>
      </div>
      <div className={classes.pageBody}>
        <div className={classes.passwordChangeCardContainer}>
          <div className={classes.passwordChangeCard}>
            <button onClick={() => navigate('/home')} className={classes.backButton}> {"< Back"}</button>
            {errorMessage && <Alert severity="error" className={classes.alertBanner}>{errorMessage}</Alert>}
            {successfulReset && <Alert severity="success" className={classes.alertBanner}>Password changed successfully.</Alert>}  
            <h2>Change your password</h2>
            <TextField
              label="Current Password"
              variant="outlined"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{marginBottom: "1.5rem", width: "100%"}}
              autoFocus
            />
            <TextField
              label="New Password"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{marginBottom: "1.5rem", width: "100%"}}
            />
            <TextField
              label="Confirm New Password"
              variant="outlined"
              type="password"
              value={newConfirmPassword}
              onChange={(e) => setNewConfirmPassword(e.target.value)}
              sx={{marginBottom: "1.5rem", width: "100%"}}
            />
            {!passwordsMatch && <label className={classes.passwordMismatch}>Passwords do not match!</label>}
          <br/>
          <Button className={classes.changePasswordButton} variant={"contained"} onClick={openPasswordChangeDialog}>Change Password</Button>
          </div>
        </div>
        
        
        <Dialog open={isLogoutDialogOpen} onClose={closeLogoutDialog} className={classes.logoutDialog}>
          <DialogContent>
            <DialogContentText sx={{ textAlign: "center", fontWeight: "bold" }}>
              You are about to log out. Continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeLogoutDialog} className={classes.logoutDialogOptions}>
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

        <Dialog open={isPasswordChangeDialogOpen} onClose={closePasswordChangeDialog} className={classes.logoutDialog}>
          <DialogContent>
            <DialogContentText sx={{ textAlign: "center", fontWeight: "bold" }}>
              Confirm password change?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closePasswordChangeDialog} className={classes.logoutDialogOptions}>
              <p style={{ color: "#898989"}}>
                Return
              </p>
            </Button>
            <Button onClick={handlePasswordChange} className={classes.logoutDialogOptions}>
              <p style={{ fontWeight: "bold"}}>
                Confirm
              </p>
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}

export default PasswordChangePage;