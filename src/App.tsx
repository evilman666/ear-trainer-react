import "./App.css";
import { Button, Typography } from "@mui/material";
import Player from "./Player";
import { useState } from "react";

const App = (): JSX.Element => {
  const [playing, setPlaying] = useState<boolean>(false);

  function handlePlayClick(_: any): void {
    setPlaying(!playing);
  }

  return (
    <>
      <Typography variant="h2">Ear Trainer</Typography>
      <Player channel={1} playing={playing} defaultNote="E4" />
      <Player channel={2} playing={playing} defaultNote="G4" />
      <Button onClick={handlePlayClick}>{playing ? "Stop" : "Play"}</Button>
    </>
  );
};

export default App;
