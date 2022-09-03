import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ justifyContent: "center", alignContent: "center", textAlign: "center"}}>
      <h1 style={{ paddingBottom: "50px" }}> Welcome to PeerPrep!</h1>
      <div style={{ justifyContent: "center", display: "flex"}}>
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
          <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
            <Button variant={"contained"} size={"large"}>Login</Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;
