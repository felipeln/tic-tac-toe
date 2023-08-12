import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick }) {
  // definindo o nome das props que serão passadas
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // se o square ja tiver um valor, retorne este mesmo valor e nao mude ele.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    // faz a logica para mudar entre X e O
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  // verificando se tem um ganhador
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {/* passando as props, 'value' e 'onSquareClick' */}
        {/* squares[0] é onde 'X' ou 'O' vai ser colocado */}
        {/* handleClick(0) é onde precisa ser clicado para que o 'X' ou 'O' seja colocado */}
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares) {
  // lines onde pode ter ganhador
  const lines = [
    //horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];
  // passa por cada array de linhas
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; // pega o valor de cada item da linha
    // verifica se tem algum valor e se estiver verifica se ele é igual aos outros valores.
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // se estiver um vencedor ou todos estiverem preenchidos retorna null
  return null;
}

function Game() {

  // guarda o historico de açoes
  const [history, sethistory] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    sethistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  const moves = history.map((squares, move) => {
    let desc;
    if (move > 0) {
      desc = `Go to move #${move}`;
    }
    if (move === 0) {
      desc = `Go to game Start`;
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </>
  );
}

export default Game;
