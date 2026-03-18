import type { TileState } from "../App";

interface KeyboardProps {
  keyStates: Record<string, TileState>;
  onKey: (key: string) => void;
}

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export default function Keyboard({ keyStates, onKey }: KeyboardProps) {
  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => {
            const state = keyStates[key] ?? "empty";
            const isWide = key === "ENTER" || key === "BACKSPACE";
            return (
              <button
                key={key}
                className={`key key--${state} ${isWide ? "key--wide" : ""}`}
                onClick={() => onKey(key)}
                aria-label={key}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
