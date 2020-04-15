import React from 'react';
import './chess.css';

class ChessBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: [],
    };
  }

  componentDidMount() {
    const { dimension } = this.props;
    var board = new Array(dimension);
    for (let i = 0; i < board.length; i++) {
      board[i] = new Array(dimension);
    }
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        board[i][j] = (i + j) % 2 === 0 ? 'black' : 'white';
      }
    }
    console.log(board);
    this.setState({ squares: board });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dimension !== this.props.dimension) {
      const { dimension } = this.props;
      let board = new Array(dimension).fill(new Array(dimension).fill(''));
      for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
          const postion = i + j;
          if (postion % 2 === 0) {
            board[i][j] = 'black';
          } else {
            board[i][j] = 'white';
          }
        }
      }
      console.log(board);
      this.setState({ squares: board });
    }
  }

  render() {
    return (
      <div className="chess-board">
        {this.state.squares.length > 0 &&
          this.state.squares.map((row, index) => (
            <div className="chess-row" key={index}>
              {row.map((unit, index) => (
                <div className={`chess-unit ${unit}`} key={index}></div>
              ))}
            </div>
          ))}
      </div>
    );
  }
}

export default ChessBoard;
