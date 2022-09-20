import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useState } from "react";
import { URL_USER_SVC } from "../configs";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");

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
    <div
      style={{
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
      }}
    >
      <h1 style={{ paddingBottom: "50px" }}> Welcome to PeerPrep!</h1>
      <div style={{ justifyContent: "center", display: "flex" }}>
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
          <Typography variant={"h4"} marginBottom={"2rem"}>
            <strong>Login</strong>
          </Typography>
          <TextField
            label="Username"
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: "1rem" }}
            autoFocus
          />
          <TextField
            label="Password"
            variant="standard"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "2rem" }}
          />
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
          >
            <Button onClick={handleLogin} variant={"contained"} size={"large"}>
              Login
            </Button>
          </Box>
          <Dialog open={isDialogOpen} onClose={closeDialog}>
            <DialogContent sx={{ textTransform: "capitalize" }}>
              <DialogContentText sx={{ textAlign: "center", fontWeight: "bold" }}>{dialogMsg}</DialogContentText>
            </DialogContent>
            <DialogActions>
              {isLoginSuccess ? (
                <Button component={Link} to="/home">
                  <p style={{ fontWeight: "bold" }}>
                    Proceed to await match!
                  </p>
                </Button>
              ) : (
                <Button component={Link} to="/signup">
                  Click here to sign up!
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;
