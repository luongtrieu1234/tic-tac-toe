import React, { useState } from 'react';
import './App.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winningSquares: [a, b, c],
      };
    }
  }
  return null;
}

function Square({ value, onClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? 'winning' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, onClick, winningSquares }) {
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onClick(i)}
      isWinningSquare={winningSquares.includes(i)}
    />
  );

  let rows = [];
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      row.push(renderSquare(i * 3 + j));
    }
    rows.push(
      <div key={i} className="board-row">
        {row}
      </div>
    );
  }

  return <div>{rows}</div>;
}

function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [sortDescending, setSortDescending] = useState(true);

  const current = history[stepNumber] || { squares: Array(9).fill(null) };
  const winnerInfo = calculateWinner(current.squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningSquares = winnerInfo ? winnerInfo.winningSquares : [];

  const moves = history.map((step, move) => {
    const location = move ? calculateLocation(history[move - 1].squares, step.squares) : '';
    const moveDescription = move ? `Go to move #${move} ${location}` : 'Go to game start';

    return (
      <li key={move}>
        {move === stepNumber ? (
          <div>
            <span>You are at move #{move}</span>
            <span>{location}</span>
          </div>
        ) : (
          <button onClick={() => jumpTo(move)}>{moveDescription}</button>
        )}
      </li>
    );
  });




  if (!sortDescending) {
    moves.reverse();
  }

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const handleClick = (i) => {
    if (winner || current.squares[i]) return;

    const newHistory = history.slice(0, stepNumber + 1);
    const newCurrent = newHistory[newHistory.length - 1];
    const newSquares = [...newCurrent.squares];

    if (newSquares[i] || stepNumber !== newHistory.length - 1) {
      return; // Ignore if square is already filled or if not at the latest step
    }

    newSquares[i] = xIsNext ? 'X' : 'O';

    setHistory(newHistory.concat([{ squares: newSquares }]));
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };


  const status = winner ? `Winner: ${winner}` : stepNumber === 9 ? 'Tie' : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={handleClick} winningSquares={winningSquares} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={() => setSortDescending(!sortDescending)}>Sort {sortDescending ? 'Descending' : 'Ascending'}</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateLocation(prevSquares, currentSquares) {
  for (let i = 0; i < prevSquares.length; i++) {
    if (prevSquares[i] !== currentSquares[i]) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return `(${row}, ${col})`;
    }
  }
  return '';
}

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
