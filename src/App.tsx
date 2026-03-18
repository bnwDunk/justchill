import { useState, useEffect, useCallback } from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import Modal from "./components/Modal";
import { WORDS } from "./utils/wordList";
import "./App.css";

export type TileState = "correct" | "present" | "absent" | "empty" | "active";

export interface TileData {
  letter: string;
  state: TileState;
}

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
}

function evaluateGuess(guess: string, answer: string): TileState[] {
  const result: TileState[] = Array(WORD_LENGTH).fill("absent");
  const answerArr = answer.split("");
  const guessArr = guess.split("");
  const used = Array(WORD_LENGTH).fill(false);

  // First pass: correct
  guessArr.forEach((letter, i) => {
    if (letter === answerArr[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  });

  // Second pass: present
  guessArr.forEach((letter, i) => {
    if (result[i] === "correct") return;
    const j = answerArr.findIndex((l, idx) => l === letter && !used[idx]);
    if (j !== -1) {
      result[i] = "present";
      used[j] = true;
    }
  });

  return result;
}

export default function App() {
  const [answer, setAnswer] = useState<string>(getRandomWord);
  const [guesses, setGuesses] = useState<TileData[][]>(
    Array(MAX_GUESSES)
      .fill(null)
      .map(() => Array(WORD_LENGTH).fill({ letter: "", state: "empty" as TileState }))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [keyStates, setKeyStates] = useState<Record<string, TileState>>({});
  const [showModal, setShowModal] = useState(false);
  const [invalidWord, setInvalidWord] = useState(false);

  const submitGuess = useCallback(() => {
    if (currentInput.length !== WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!WORDS.includes(currentInput.toLowerCase())) {
      setInvalidWord(true);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setInvalidWord(false);
      }, 600);
      return;
    }

    const states = evaluateGuess(currentInput, answer);
    const newTiles: TileData[] = currentInput
      .split("")
      .map((letter, i) => ({ letter, state: states[i] }));

    const newGuesses = guesses.map((row, i) => (i === currentRow ? newTiles : row));
    setGuesses(newGuesses);

    // Update key states
    const newKeyStates = { ...keyStates };
    newTiles.forEach(({ letter, state }) => {
      const prev = newKeyStates[letter];
      if (prev === "correct") return;
      if (prev === "present" && state === "absent") return;
      newKeyStates[letter] = state;
    });
    setKeyStates(newKeyStates);

    const isWin = states.every((s) => s === "correct");
    const nextRow = currentRow + 1;

    if (isWin) {
      setWon(true);
      setGameOver(true);
      setTimeout(() => setShowModal(true), 1600);
    } else if (nextRow >= MAX_GUESSES) {
      setGameOver(true);
      setTimeout(() => setShowModal(true), 1600);
    }

    setCurrentRow(nextRow);
    setCurrentInput("");
  }, [currentInput, answer, guesses, currentRow, keyStates]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameOver) return;
      if (key === "ENTER") {
        submitGuess();
      } else if (key === "BACKSPACE" || key === "DELETE") {
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentInput.length < WORD_LENGTH) {
        setCurrentInput((prev) => prev + key);
      }
    },
    [gameOver, currentInput, submitGuess]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      handleKey(key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  // Merge currentInput into display guesses
  const displayGuesses = guesses.map((row, i) => {
    if (i === currentRow && !gameOver) {
      return row.map((tile, j) => ({
        letter: currentInput[j] ?? "",
        state: currentInput[j] ? ("active" as TileState) : ("empty" as TileState),
      }));
    }
    return row;
  });

  const handleRestart = () => {
    setAnswer(getRandomWord());
    setGuesses(
      Array(MAX_GUESSES)
        .fill(null)
        .map(() => Array(WORD_LENGTH).fill({ letter: "", state: "empty" as TileState }))
    );
    setCurrentRow(0);
    setCurrentInput("");
    setGameOver(false);
    setWon(false);
    setKeyStates({});
    setShowModal(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-line" />
        <h1 className="title">WORDLE</h1>
        <div className="header-line" />
      </header>

      {invalidWord && <div className="toast">Not in word list</div>}

      <Board guesses={displayGuesses} currentRow={currentRow} shake={shake} />
      <Keyboard keyStates={keyStates} onKey={handleKey} />

      {showModal && (
        <Modal won={won} answer={answer} guesses={currentRow} onRestart={handleRestart} />
      )}
    </div>
  );
}
