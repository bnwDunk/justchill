interface ModalProps {
  won: boolean;
  answer: string;
  guesses: number;
  onRestart: () => void;
}

const messages = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"];

export default function Modal({ won, answer, guesses, onRestart }: ModalProps) {
  const message = won ? messages[guesses - 1] ?? "Nice!" : "Better luck next time!";

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-emoji">{won ? "🎉" : "😔"}</div>
        <h2 className="modal-title">{message}</h2>
        {!won && (
          <p className="modal-answer">
            The word was <strong>{answer}</strong>
          </p>
        )}
        {won && (
          <p className="modal-sub">Solved in {guesses} {guesses === 1 ? "guess" : "guesses"}</p>
        )}
        <button className="modal-btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}
