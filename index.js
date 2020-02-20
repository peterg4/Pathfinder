import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
function Square(props) {
    return (
      <button className={props.value + ' square'} onClick={props.onClick} onMouseUp={props.onMouseUp} onMouseDown={props.onMouseDown} onMouseOver={props.onMouseOver}></button>
    );
  }

class Board extends React.Component {

    constructor(props) {
        super(props);
        var square_board = [[]];
        square_board.shift();
        for(var j = 0; j < 15; j++){  
            var row = [];
            for(var i = 0; i < 28; i++){
                if(i === 22 && j === 7)
                    row.push('green')
                else 
                    row.push(null);
            }
            square_board.push(row);
        }
        var xStart = 5;
        var yStart = 5;
        square_board[xStart][yStart] = 'start';
        this.state = {
            squares: square_board,
            xStart: xStart,
            yStart: yStart
        };
    }
    resetState(){
        var squares = [[]];
        for(var j = 0; j < 15; j++){  
            var row = [];
            for(var i = 0; i < 28; i++){
                if(i === 22 && j === 6)
                    row.push('green')
                else 
                    row.push(null);
            }
            squares.push(row);
        }
        this.setState({squares: squares, xStart: 5, yStart: 5});
    }

    BFS(i,j) {
        var queue = [[]];
        queue.push([i,j]);
        queue.shift();
        var paths = new Map();
        let y = queue[0][0];
        let x = queue[0][1]
        paths.set(y+','+x,[0,null]);
        console.log(queue[0]);
        var search = setInterval(() => {
            var squares = [];
            for (var o = 0; o < this.state.squares.length; o++)
                squares = this.state.squares.slice();
            try{
                y = queue[0][0];
                x = queue[0][1];
                if(queue.length !== 0 && !(y === 7 && x === 22)) {
                    if(squares[y][x] !== 'X') { 
                        let dist = paths.get(y+','+x)[0]+1;
                        if(x < 27 && squares[y][x+1] !== 'X' && squares[y][x+1] !== 'wall') {
                            queue.push([y,x+1]);
                            paths.set(y+','+(x+1),[dist, y+','+x]);
                        }
                        
                        if(x > 0 && squares[y][x-1] !== 'X' && squares[y][x-1] !== 'wall'){
                            queue.push([y,x-1]);
                            paths.set(y+','+(x-1),[dist, y+','+x]);
                        }

                        if(y < 14 && squares[y+1][x] !== 'X' && squares[y+1][x] !== 'wall'){
                            queue.push([y+1,x]);
                            paths.set((y+1)+','+x,[dist, y+','+x]);
                        }

                        if(y > 0 && squares[y-1][x] !== 'X' && squares[y-1][x] !== 'wall'){
                            queue.push([y-1,x]);
                            paths.set((y-1)+','+x,[dist, y+','+x]);
                        }
                        squares[y][x] = 'X';
                        squares[i][j] = 'start';
                        this.setState({squares: squares});
                    }
                    queue.shift();
                } else {
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
                        this.setState({squares: squares}); 
                        } else {
                        clearInterval(find_path);
                        }
                    clearInterval(search);
                    }, 10);
                }
            } catch {
                clearInterval(find_path);
                clearInterval(search);
                this.resetState();
            }
        }, 5);
    }
    addWall(i,j){
        console.log();
        if(this.isMouseDown){
            var squares = [];
            for (var o = 0; o < this.state.squares.length; o++)
                squares = this.state.squares.slice();
            if(squares[i][j] == 'green' || squares[i][j] == 'start'){

            } else {
                squares[i][j] = 'wall';
            }
            this.setState({squares: squares});
        }
    }
    toggleMouseDown(){
        this.isMouseDown = true;
    }
    toggleMouseUp(){
        this.isMouseDown = false;
    }
    moveStart(i,j){
        var squares = [];
        for (var o = 0; o < this.state.squares.length; o++)
            squares = this.state.squares.slice();
        var xStart = this.state.xStart;
        var yStart = this.state.yStart;
        squares[xStart][yStart] = null;
        squares[i][j] = 'start';
        xStart = i;
        yStart = j;
        this.setState({squares: squares, xStart: xStart, yStart: yStart})
    }   
    renderSquare(i,j) {
        return (
        <Square
            value={this.state.squares[i][j]}
            onClick={() => this.moveStart(i,j)}
            clas={this.state.class}
            onMouseOver={() => this.addWall(i,j)}
            onMouseDown={() => this.toggleMouseDown()}
            onMouseUp={() => this.toggleMouseUp()}
            isMouseDown ={this.isMouseDown}
        />
        );
    }

    render() {
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
        <nav className="navbar navbar-dark dark">
            <button className="navbar-toggler center reset"onClick={() => this.BFS(this.state.xStart,this.state.yStart)}> Start!</button>
            <button className="navbar-toggler center reset"onClick={() => this.resetState()}> Reset Board</button>
        </nav>
             
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
        </div>
    </div>
    );
}
}

// ========================================
const domContainer = document.querySelector('#root');
ReactDOM.render(<Game />,domContainer);
