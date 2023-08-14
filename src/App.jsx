import { useState } from "react";
import "./App.css";
// definindo o nome das props que serão passadas
function Square({ value, onSquareClick, linesWinner, dataIndex }) {
  // pegando o N° das linhas vencedoras
  const lines = linesWinner;
  // verificando se ja temos o vencedor
  if (lines.length > 0) {
    // se sim, separe o  N das linha em 3 variaveis.
    let [a, b, c] = lines;
    // se o dataIndex(numero da posição do square) for igual ao Numero de algum square Vencedor.
    if (a === dataIndex || b === dataIndex || c === dataIndex) {
      // retorna ele com uma class "winner"
      return (
        <button className={`square ${value} winner`} onClick={onSquareClick}>
          {value}
        </button>
      );
    } else { // caso não, retorne ele normal
      return (
        <button className={`square ${value}`} onClick={onSquareClick}>
          {value}
        </button>
      );
    }
  }
  // caso nao tenha um vencedor, renderize normal
  if (lines.length < 1) { 
    return (
      <button className={`square ${value}`} onClick={onSquareClick}>
        {value}
      </button>
    );
  }
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    // verifica se tme um ganhador
    // ou
    // se o squares[i], ja tem um valor.
    // caso alguma seja truthy, pare por aqui.
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
  const winner = calculateWinner(squares); // retorna um array [ com o vencedor "X/O" e um array com Numero das posiçoes vencedoras]
  let status;
  let linesWinner = [];
  if (winner) {
    status = "Winner: " + winner[0]; // winner[0]
    linesWinner = winner[1];
  }
  if (!winner) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // console.log(linesWinner);

  // using loop to make squares
  const rowGroups = [];
  let currentGroup = [];
  const currentSquares = squares;
  currentSquares.forEach((item, index, array) => {
    currentGroup.push(
      <Square
        key={`square-${index}`}
        dataIndex={index}
        linesWinner={[...linesWinner]}
        value={squares[index]}
        onSquareClick={() => handleClick(index)}
      />
    );

    if (currentGroup.length === 3 || index === array.length - 1) {
      rowGroups.push(
        <div className="board-row" key={`row-${rowGroups.length + 1}`}>
          {currentGroup}
        </div>
      );
      currentGroup = [];
    }
  });

  return (
    <>
      <div className="status">{status}</div>
      <div className=".board-container">{rowGroups}</div>
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
  let linesWinner;
  // passa por cada array de linhas
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]; // pega o valor de cada item da linha
    // verifica se tem algum valor e se estiver verifica se ele é igual aos outros valores.
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      linesWinner = lines[i];
      return [squares[a], linesWinner];
    }
  }
  // se tem um vencedor ou todos tem  estão preenchidos retorna null
  return null;
}

function Game() {
  // guarda o historico de açoes
  const [history, sethistory] = useState([Array(9).fill(null)]);

  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  // função para modificar estados do historico
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    sethistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // função para pular para alguma jogada, baseado no historico.
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // cria os botoes "go start" e "go to move"
  // baseado no historico
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

  // TODO: Add a toggle button that lets you sort the moves in either ascending or descending order.


  return (
    <>
      <h1 className="title">Tic Tac Toe</h1>
      <div className="game-container">
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
          <h2>Game history</h2>
          <button  className="sortButton" aria-label="Sort by Order">
            {`Sort Order`}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

export default Game;
