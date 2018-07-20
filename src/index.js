import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square (props) {
    return (
        <button className={props.classes} onClick={props.onClick}>
          {props.value}
        </button>
    );
}

function isDraw(squares) {
    return !calculateWinner(squares) && squares.every(sq => sq);
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i += 1) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], squares[b], squares[c], lines[i]];
        }
    }
    return null;
}

class Board extends React.Component {
    renderSquare(i, row, col, win) {
        return <Square key={i} winner={win} classes={`square ${win ? "bold" : ""}`} value={this.props.squares[i]} onClick={() => this.props.onClick(i, row, col)} />;
    }
    render() {
        let squares = [];
        let num = 0;
        let row = [];
        let win = false;

        for (let x = 1; x <= 3; x += 1) {
            row = [];
            for (let y = 1; y <= 3; y += 1) {
                if (this.props.squares.winSquares) {
                    win = this.props.squares.winSquares.indexOf(num) !== -1 ? true : false;
                }
                row.push(this.renderSquare(num, x, y, win));
                num += 1;
            }
            squares.push(<div key={num} className="board-row">{row}</div>);
        }
        return (
            <div>
                {squares}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null)}],
            stepNumber: 0,
            clicked: null,
            ascendingOrder: true,
            xIsNext: true
        };
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }
    handleClick(i, row, col) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares,
                clicked: [row, col]
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }
    toggleOrder() {
        this.setState({
            ascendingOrder: !this.state.ascendingOrder
        });
    }
    render() {
        const {history} = this.state;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            let desc = "Go to game start";
            let row = null;
            let col = null;

            if (move) {
                desc = `Go to move #${move}`
                row = `(${this.state.history[move].clicked[0]},`;
                col = `${this.state.history[move].clicked[1]})`;
            }
            let bold = (move === this.state.stepNumber ? "bold" : "");
            return (
                <li key={move} >
                    <button className={bold} onClick={() => this.jumpTo(move)}>{desc} {row}{col}</button>
                </li>
            );
        });

        let status;

        if (winner) {
            current.squares.winSquares = winner[3];
            status = `Winner: ${winner[0]} `;
        } else if (isDraw(current.squares)) {
            status = "It's a draw";
        } else {
            status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
        }

        if (!this.state.ascendingOrder) {
            moves.sort(function(a, b) {
                return b.key - a.key;
            });
        }

        return (
            <div className="game">
              <div className="game-board">
              <Board squares={current.squares} onClick={(i, row, col) => this.handleClick(i, row, col)} />
              </div>
              <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
              <button onClick={() => this.toggleOrder()}>Change order</button>
              </div>
            </div>
        );
    }
}

ReactDOM.render(<Game />, document.getElementById("root"));