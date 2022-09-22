import React, { useState, useEffect } from "react";
import { Button, Select, MenuItem } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import starterCode from "../utils/startercode";
import difficulties from "../utils/difficulties";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { useSyncState } from "../SyncProvider"

const SessionPage = () => {
  const { state } = useLocation();
  const {roomId, partner, difficulty, question} = state;
  const [language, setLanguage] = useState("java");
  const [query, setQuery] = useState("");
  const [code, setCode] = useSyncState('code');

  // this helps to reduce the number of times setState is called, reducing funkiness while typing 
  useEffect(() => {
    const timeOutId = setTimeout(() => setCode(query), 600);
    return () => clearTimeout(timeOutId);
  }, [query]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(starterCode[e.target.value]);
  }

  return (
    <div>
      <span
        className="menu"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            justifyContent: "center",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          PeerPrep
        </h1>
        <h3
          style={{
            backgroundColor: "#90EE90",
            padding: "5px",
            borderRadius: "5px",
            height: "35px",
            lineHeight: "35px",
            textAlign: "center",
          }}
        >
          In a session with {partner}
        </h3>
        <Button
          variant="contained"
          color="error"
          component={Link}
          to="/home"
          sx={{ fontWeight: "bold", height: 50 }}
        >
          End Session
        </Button>
      </span>
      <div
        className="question-space"
        style={{
          width: "48%",
          float: "left",
          paddingTop: "10px",
        }}
      >
        <h2
          style={{
            backgroundColor: "#FFE4B5",
            padding: "10px",
            marginTop: "3px",
            borderRadius: "5px",
          }}
        >
          {question.title}
        </h2>
        <h3 style={{ paddingLeft: "5px" }}>Difficulty: {difficulties[difficulty]}</h3>
        <div
          style={{
            fontWeight: "600",
            lineHeight: "1.8",
            padding: "10px",
            backgroundColor: "blanchedalmond",
            borderRadius: "10px",
            maxHeight: "60vh",
            overflow: "scroll",
          }}
        >
          <p>{question.question}</p>
          { question.examples.map((example) => 
            {
              return (
                <div>
                  {example.map((line) => <p>{line.toString()}</p>)}
                </div>
              )
            })
          }
        </div>
      </div>
      <div
        className="answer-space"
        style={{ width: "48%", float: "right", paddingTop: "10px" }}
      >
        <div style={{ paddingBottom: "10px" }}>
          <Select
            sx={{ width: "150px", height: "40px", fontWeight: "bold" }}
            value={language}
            onChange={(e) => handleLanguageChange(e)}
          >
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="ruby">Ruby</MenuItem>
            <MenuItem value="cpp">C++</MenuItem>
          </Select>
        </div>
        <div
          className="text-area"
          style={{
            maxHeight: "72vh",
            overflowY: "scroll",
            borderRadius: "10px",
          }}
        >
          <CodeEditor
            value={code}
            language={language}
            placeholder="Type your code here!"
            // onChange={(e) => setCode(e.target.value)}
            onChange={(e) => setQuery(e.target.value)}
            padding={15}
            style={{
              fontSize: 14,
              minHeight: "65vh",
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
    </div>
  );
};

export default SessionPage;
