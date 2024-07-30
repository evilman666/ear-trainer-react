import React, { useEffect, useRef, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Checkbox, Grid, MenuItem, Slider } from "@mui/material";
import * as Tone from "tone";
import { Frequency } from "tone/build/esm/core/type/Units";

interface IPlayer {
  channel: number;
  playing: boolean;
  defaultNote: string;
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const generateMidiNotes = (): string[] => {
  const result: string[] = new Array<string>(112);
  const notes: string[] = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  //octaves (8 total octaves in midi)
  for (let i: number = 0; i <= 8; i++) {
    //notes (12 total notes)
    for (let j: number = 0; j < 12; j++) {
      const newNote = notes[j] + i;
      const newIndex = i * (12 + 1) + j;
      if (newIndex === 112) {
        return result;
      }
      result[newIndex] = newNote;
    }
  }

  return result;
};

const Player = (props: IPlayer): JSX.Element => {
  const [note, setNote] = useState<string>(props.defaultNote);
  const previousNote = usePrevious<string>(note);
  const [panning, setPanning] = useState<number>(0);
  const [active, setActive] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(props.playing);
  //const synth = new Tone.PolySynth(Tone.Synth).toDestination();
  //panning documentation at https://tonejs.github.io/docs/15.0.4/classes/Panner.html
  const [panner] = useState(new Tone.Panner(panning / 100).toDestination());
  const [synth] = useState(new Tone.PolySynth(Tone.Synth).connect(panner));
  const [midiNotes] = useState(generateMidiNotes());
  //const now = useRef();

  useEffect(() => {
    //init
    return () => {
      //deinit
    };
  }, []);

  useEffect(() => {
    console.log("note change?", playing, previousNote, note);
    if (playing && previousNote !== note) {
      console.log("stop for note change", previousNote, Tone.now());
      const x: Frequency = previousNote as Frequency;
      synth.triggerRelease(x, Tone.now() + 1);
      console.log("changing for note", note);
      synth.triggerAttack(note, Tone.now() + 1);
    }

    if (props.playing && active && !playing) {
      console.log("play", note, Tone.now());
      synth.triggerAttack(note, Tone.now());
      setPlaying(true);
    } else if ((!props.playing || !active) && playing) {
      console.log("stop", note, Tone.now());
      synth.triggerRelease(note, Tone.now() + 1);
      setPlaying(false);
    }
  }, [props.playing, playing, note, previousNote, synth, active]);

  const handleChange = (event: SelectChangeEvent) => {
    console.log("new note", event.target.value);
    setNote(event.target.value);
  };

  const handleChangePanning = (event: Event, newValue: number | number[]) => {
    setPanning(newValue as number);
    panner.pan.setValueAtTime((newValue as number) / 100, Tone.now());
    console.log("new panning", (newValue as number) / 100);
  };

  const handleChangeActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActive(event.target.checked);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={1}>
          <Select value={note} label="Note" onChange={handleChange}>
            {midiNotes.map((note) => (
              <MenuItem value={note} key={note}>
                {note}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={10}>
          <Slider
            aria-label="panning"
            value={panning}
            onChange={handleChangePanning}
            min={-100}
            max={100}
          />
        </Grid>
        <Grid item xs={1}>
          <Checkbox
            checked={active}
            onChange={handleChangeActive}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Player;
