import { CountdownCircleTimer } from "react-countdown-circle-timer";

const countdownTimer = () => (
    <div style={{ justifyContent: "center", alignContent: "center", textAlign: "center"}}>
      <h2 style={{ paddingBottom: "35px" }}>Currently matching you with another person!</h2>
      <div style={{ justifyContent: "center", display: "flex"}}>
      <CountdownCircleTimer
        isPlaying
        duration={30}
        size={300}
        colors={["#42f57b", "#F7B801", "#A30000", "#A30000"]}
        colorsTime={[15, 10, 5, 0]}
        onComplete={() => ({
          shouldRepeat: false,
        })}
      >
        {({ remainingTime }) => <h1>{remainingTime === 0 ? <h5>No match found...</h5> : remainingTime}</h1>}
      </CountdownCircleTimer>
      </div>
    </div>
);

export default countdownTimer;
