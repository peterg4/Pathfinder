import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { ControlLabel } from 'react-bootstrap';
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
        var isWalls = true;
        square_board[xStart][yStart] = 'start';
        this.state = {
            squares: square_board,
            xStart: xStart,
            yStart: yStart,
            isWalls: isWalls,
        };
    }
    resetState(){
        var squares = [[]];
        squares.shift();
        for(var j = 0; j < 15; j++){  
            var row = [];
            for(var i = 0; i < 28; i++){
                if(i === 22 && j === 7)
                    row.push('green');
                if( i===5 && j ===5)
                    row.push('start');
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
                        let dist = 1;
                        var isSet=0;
                        //let dist = paths.get(y+','+x)[0]+1;
                        console.log(squares[y][x]);
                        if(squares[y][x] == 'weight') {
                            squares[y][x] = 'wasweight';
                            queue.push([y,x]);
                            this.setState({squares: squares}); 
                            return;
                        }
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        if(x < 27 && squares[y][x+1] !== 'X' && squares[y][x+1] !== 'wall' && squares[y][x+1] !== 'weight real_weight') {
                            queue.push([y,x+1]);
                            paths.set(y+','+(x+1),[dist, y+','+x]);
                        }
                        if(x > 0 && squares[y][x-1] !== 'X' && squares[y][x-1] !== 'wall' && squares[y][x-1] !== 'weight real_weight'){
                            queue.push([y,x-1]);
                            paths.set(y+','+(x-1),[dist, y+','+x]);
                        }

                        if(y < 14 && squares[y+1][x] !== 'X' && squares[y+1][x] !== 'wall' && squares[y+1][x] !== 'weight real_weight'){
                            queue.push([y+1,x]);
                            paths.set((y+1)+','+x,[dist, y+','+x]);
                        }

                        if(y > 0 && squares[y-1][x] !== 'X' && squares[y-1][x] !== 'wall' && squares[y-1][x] !== 'weight real_weight'){
                            queue.push([y-1,x]);
                            paths.set((y-1)+','+x,[dist, y+','+x]);
                        }
                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        if( x < 27 && squares[y][x+1] == 'weight real_weight') {
                            squares[y][x+1] = 'weight';
                            queue.push([y,x]);
                            squares[y][x] = null;
                            isSet =1;
                        //    paths.set(y+','+(x+1),[dist, y+','+x]); 
                        }
                        if(x > 0 && squares[y][x-1] == 'weight real_weight'){
                            squares[y][x-1] = 'weight';
                            queue.push([y,x]);
                            squares[y][x] = null;
                            isSet =1;
                      //      paths.set(y+','+(x-1),[dist, y+','+x]);
                        }
                        if(y < 14 && squares[y+1][x] == 'weight real_weight'){
                            squares[y+1][x] = 'weight';
                            queue.push([y,x]);
                            squares[y][x] = null;
                            isSet =1;
                        //    paths.set((y+1)+','+x,[dist, y+','+x]);
                        }
                        if(y > 0 && squares[y-1][x] == 'weight real_weight'){
                            squares[y-1][x] = 'weight';
                            queue.push([y,x]);
                            squares[y][x] = null;
                            isSet =1;
                        //    paths.set((y-1)+','+x,[dist, y+','+x]);
                        }
                        if(!isSet)
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
    A_star(i,j){
        var dist_origin;
        var dist_end = Math.abs(7-j) + Math.abs(22-i);
        var dist;
        var open_list = [[]];
        open_list.shift();
        open_list.push([i,j,dist_end]);
        var paths = new Map();
        paths.set(i+','+j,[0,null]);
        let x = i;
        let y = j;
        console.log(open_list[0])
        //for all the nodes next to the current node
            //if cur node is end node animate path back
            //calculate dist_origin + dist_end, add vals to open_list also insert paths into map like for 
            //sort open_list and choose lowest val for next node
            var search = setInterval(() => {
                var squares = [];
                for (var o = 0; o < this.state.squares.length; o++)
                    squares = this.state.squares.slice();
                try{
                    y = open_list[0][0];
                    x = open_list[0][1];
                    
                    if(open_list.length > 0 && !(y === 7 && x === 22)) {
                        open_list.shift();
                        if(squares[y][x] !== 'X') { 
                            if(x < 27 && squares[y][x+1] !== 'X' && squares[y][x+1] !== 'wall') {
                                dist_origin = Math.abs(y-j) + Math.abs(x+1-i);
                                dist_end = Math.abs(7-y) + Math.abs(22-(x+1));
                                dist = dist_origin + dist_end;
                                open_list.push([y,x+1,dist]);
                                paths.set(y+','+(x+1),[dist, y+','+x]);
                            }
                            
                            if(x > 0 && squares[y][x-1] !== 'X' && squares[y][x-1] !== 'wall'){
                                dist_origin = Math.abs(y-j) + Math.abs(x-1-i);
                                dist_end = Math.abs(7-y) + Math.abs(22-(x-1));
                                dist = dist_origin + dist_end;
                                open_list.push([y,x-1,dist]);
                                paths.set(y+','+(x-1),[dist, y+','+x]);
                            }
    
                            if(y < 14 && squares[y+1][x] !== 'X' && squares[y+1][x] !== 'wall'){
                                dist_origin = Math.abs(y+1-j) + Math.abs(x-i);
                                dist_end = Math.abs(7-(y+1)) + Math.abs(22-x);
                                dist = dist_origin + dist_end;
                                open_list.push([y+1,x,dist]);
                                paths.set((y+1)+','+x,[dist, y+','+x]);
                            }
    
                            if(y > 0 && squares[y-1][x] !== 'X' && squares[y-1][x] !== 'wall'){
                                dist_origin = Math.abs(y-1-j) + Math.abs(x-i);
                                dist_end = Math.abs(7-(y-1)) + Math.abs(22-x);
                                dist = dist_origin + dist_end;
                                open_list.push([y-1,x,dist]);
                                paths.set((y-1)+','+x,[dist, y+','+x]);
                            }
                            
                            open_list.sort(function(a,b){
                                return a[2]-b[2];
                            });
                            console.log(open_list[0]);
                            squares[y][x] = 'X';
                            squares[i][j] = 'start';
                            this.setState({squares: squares});
                        }
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
    toggleWall(){
        this.isWalls = true;
    }
    toggleWeight(){
        this.isWalls = false;
    }
    addWall(i,j){
        console.log(this.isWalls);
        if(this.isMouseDown){
            var squares = [];
            for (var o = 0; o < this.state.squares.length; o++)
                squares = this.state.squares.slice();
            if(squares[i][j] == 'green' || squares[i][j] == 'start'){
            } else if (!this.isWalls && this.isWalls!=undefined){
                squares[i][j] = 'weight real_weight';
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
            isWalls={this.isWalls}
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
            <button className="navbar-toggler center reset"onClick={() => this.toggleWall()}> Add Walls</button>
            <button className="navbar-toggler center reset"onClick={() => this.toggleWeight()}> Add Weights</button>
            <button className="navbar-toggler center reset"onClick={() => this.BFS(this.state.xStart,this.state.yStart)}> Dijsktra's</button>
            <button className="navbar-toggler center reset"onClick={() => this.A_star(this.state.xStart,this.state.yStart)}> A*</button>
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
