import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={props.value + ' square'} onClick={props.onClick}>
        
      </button>
    );
  }

class Board extends React.Component {
    constructor(props) {
        super(props);
        var sqaure_board = [[]];
        sqaure_board.shift();
        for(var j = 0; j < 15; j++){  
            var row = [];
            for(var i = 0; i < 28; i++){
                if(i == 22 && j == 7)
                    row.push('green')
                else 
                    row.push(null);
            }
            sqaure_board.push(row);
        }
        var selected_board = [[]];
        var r = [];
        selected_board.shift();
        for(var i = 0; i < 15; i++){
            r.push('fill');
        }
        for(var j = 0; j < 28; j++){    
            selected_board.push(row);
        }
        this.state = {
            squares: sqaure_board,
            selected: selected_board,
            xIsNext: true,
        };
    }
    BFS(i,j) {
        var queue = [[]];
        queue.push([i,j]);
        queue.shift();
        var paths = new Map(); //arrays of index(string), distance, prev index(string) (for lookup too);
        let y = queue[0][0];
        let x = queue[0][1]
        paths.set(y+','+x,[0,null]);
        console.log(queue[0]);
        var search = setInterval(() => {
            if(queue.length !== 0 && !(y == 7 && x == 22)) {
                var squares = [];
                for (var o = 0; o < this.state.squares.length; o++)
                    squares = this.state.squares.slice();
                y = queue[0][0];
                x = queue[0][1];
     //           console.log(paths.get(y+','+x)[0]);
                if(squares[y][x] !== 'X') { 
                    let dist = paths.get(y+','+x)[0]+1;
                    if(x < 27 && squares[y][x+1] !== 'X') {
                        queue.push([y,x+1]);
                        paths.set(y+','+(x+1),[dist, y+','+x]);
                    }
                       
                    if(x > 0 && squares[y][x-1] !== 'X'){
                        queue.push([y,x-1]);
                        paths.set(y+','+(x-1),[dist, y+','+x]);
                    }

                    if(y < 14 && squares[y+1][x] !== 'X'){
                        queue.push([y+1,x]);
                        paths.set((y+1)+','+x,[dist, y+','+x]);
                    }

                    if(y > 0 && squares[y-1][x] !== 'X'){
                        queue.push([y-1,x]);
                        paths.set((y-1)+','+x,[dist, y+','+x]);
                    }
                    squares[y][x] = 'X';
                    squares[i][j] = 'start';
                    this.setState({squares: squares,});
                }
                queue.shift();
            } else {
                var squares = [];
                for (var o = 0; o < this.state.squares.length; o++)
                    squares = this.state.squares.slice();
                let y = queue[0][0];
                let x = queue[0][1];
             //   console.log(paths.get(y+','+x));
                let next = paths.get(7+','+22)[1].split(',');
                y = next[0];
                x = next[1];
                squares[y][x] = 'visited';
                var find_path = setInterval(() => { 
                    if(next !== null && !(x == j && y == i)) {
                    squares[y][x] = 'visited';
                    next = paths.get(y+','+x)[1];
                    if(next!=null){
                        next = next.split(',');
                        y = next[0];
                        x = next[1];
                    }
                    console.log(y+','+x);
                    this.setState({squares: squares,}); 
                } else {
                 clearInterval(find_path);
                }
                clearInterval(search);
                }, 10);
            }
        }, 5);
    }
    renderSquare(i,j) {
        return (
        <Square 
            value={this.state.squares[i][j]}
            onClick={() => this.BFS(i,j)}
            clas={this.state.class}
        />
        );
    }

    render() {
     //   const winner = calculateWinner(this.state.squares);
        let status;
        
        const items = [[]];
        for(var x = 0; x < 15; x++) {
            var row = [];
            for(var j = 0; j < 28; j++){
                row.push(this.renderSquare(x,j));
                if(j===8)
                    items.push(row);
            }
            
        }
        const board_ = [];
        for (const [index] of items.entries()) {
            board_.push(<div className="board-row">{items[index]}</div>);
        }
        return (
        <div>
        <div className="status">{status}</div>
            {board_}
        </div>
        );
    }
}

class Game extends React.Component {
render() {
    return (
    <div className="game">
        <div className="game-board">
        <Board />
        </div>
        <div className="game-info">
        <div>{/* status */}</div>
        <ol>{/* TODO */}</ol>
        </div>
    </div>
    );
}
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
