import type { TileData } from "../App";
import Tile from "./Title";

interface RowProps {
  tiles: TileData[];
  isActive: boolean;
  shake: boolean;
  reveal: boolean;
  rowIndex: number;
}

export default function Row({ tiles, shake, reveal, rowIndex }: RowProps) {
  return (
    <div className={`row ${shake ? "shake" : ""}`}>
      {tiles.map((tile, i) => (
        <Tile
          key={i}
          letter={tile.letter}
          state={tile.state}
          reveal={reveal}
          delay={i * 120}
        />
      ))}
    </div>
  );
}
