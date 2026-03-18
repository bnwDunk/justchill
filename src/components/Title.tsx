import type { TileState } from "../App";

interface TileProps {
  letter: string;
  state: TileState;
  reveal: boolean;
  delay: number;
}

export default function Tile({ letter, state, reveal, delay }: TileProps) {
  return (
    <div
      className={`tile tile--${state} ${reveal ? "tile--reveal" : ""} ${letter ? "tile--filled" : ""}`}
      style={reveal ? { animationDelay: `${delay}ms`, "--delay": `${delay}ms` } as React.CSSProperties : {}}
    >
      <div className="tile-inner">
        <div className="tile-front">{letter}</div>
        <div className={`tile-back tile-back--${state}`}>{letter}</div>
      </div>
    </div>
  );
}
