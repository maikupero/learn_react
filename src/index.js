import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// • Lets you play tic-tac-toe,
// • Indicates when a player has won the game,
// • Stores a game’s history as a game progresses,
// • Allows players to review a game’s history and see previous versions of a game’s board.

// Extra optional challenges to add on by myself:
// • Display the location for each move in the format (col, row) in the move history list.
// • Bold the currently selected item in the move list.
// • Rewrite Board to use two loops to make the squares instead of hardcoding them.
// • Add a toggle button that lets you sort the moves in either ascending or descending order.
// • When someone wins, highlight the three squares that caused the win.
// • When no one wins, display a message about the result being a draw.


// Some notes for me, learning:
// Since state is considered to be private to a component that defines it, we cannot update the Board’s state directly from Square.
// Since the Square components no longer maintain state, the Square components receive values from the Board component and inform 
// the Board component when they’re clicked. In React terms, the Square components are now controlled components. 
// The Board has full control over them.

// Two approaches to changing data. Mutate by directly changing values, or replace with a new copy which has the desired changes.
// In React, function components are a simpler way to write components that only contain a render method 
// and don’t have their own state. Instead of defining a class which extends React.Component, we can write a function 
// that takes props as input and returns what should be rendered.

function Square(props) {        
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return h(
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            position: []
        };
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];       
        const squares = current.squares.slice();

        const position = this.state.position.slice(0, this.state.stepNumber);
        const col = (i % 3) + 1;
        const row = Math.floor(i / 3) + 1;

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            position: position.concat([{
                col: col,
                row: row
            }])
        }); 
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const position = this.state.position;

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const coords = move ?
                `|| ${move % 2 != 0 ? 'X' : 'O'} at ${position[move-1]['col']}, ${position[move-1]['row']}` :
                '';

            if (move === this.state.stepNumber) {
                let lastmove = 'Move #'+move;
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}><b>{lastmove} {coords}</b></button>
                    </li>
                );
            } else {
                return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc} {coords}</button>
                </li>
                );
            };
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}
  
// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));

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
        return squares[a];
      }
    }
    return null;
  }
  