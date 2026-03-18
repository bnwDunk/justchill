import type { TileData } from "../App";
import Row from "./Row";

interface BoardProps {
  guesses: TileData[][];
  currentRow: number;
  shake: boolean;
}

export default function Board({ guesses, currentRow, shake }: BoardProps) {
  return (
    <div className="board">
      {guesses.map((row, i) => (
        <Row
          key={i}
          tiles={row}
          isActive={i === currentRow}
          shake={shake && i === currentRow}
          reveal={i < currentRow}
          rowIndex={i}
        />
      ))}
    </div>
  );
}
