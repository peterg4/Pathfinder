import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
const GLOBAL_XMAX = parseInt((window.innerWidth-100)/30);
const GLOBAL_YMAX = parseInt((window.innerHeight-100)/30);
const GLOBAL_YGOAL = 10;
const GLOBAL_XGOAL = 10;
console.log(GLOBAL_XMAX, GLOBAL_YMAX)
function Square(props) {
    if(props.y==GLOBAL_YGOAL && props.x == GLOBAL_XGOAL) {
        return (
            <button id={props.location} className={'green square'} onClick={props.onClick} onMouseUp={props.onMouseUp} onMouseDown={props.onMouseDown} onMouseOver={props.onMouseOver}></button>
        );
    } 
    if(props.y==5 && props.x ==5){
        return (
            <button id={props.location} className={'start square'} onClick={props.onClick} onMouseUp={props.onMouseUp} onMouseDown={props.onMouseDown} onMouseOver={props.onMouseOver}></button>
        );
    }
    return (
        <button id={props.location} className={'square'} onClick={props.onClick} onMouseUp={props.onMouseUp} onMouseDown={props.onMouseDown} onMouseOver={props.onMouseOver}></button>
    );
  }

class Board extends React.Component {

    constructor(props) {
        super(props);
        var square_board = [[]];
        square_board.shift();
        for(var j = 0; j < GLOBAL_YMAX; j++){  
            var row = [];
            for(var i = 0; i < GLOBAL_XMAX; i++){
                if(i === GLOBAL_XGOAL && j === GLOBAL_YGOAL)
                    row.push('green')
                else 
                    row.push(null);
            }
            square_board.push(row);
        }
        var xStart = 5;
        var yStart = 5;
        var isWalls = true;
        var isRunning = false;
        square_board[xStart][yStart] = 'start';
        this.state = {
            squares: square_board,
            xStart: xStart,
            yStart: yStart,
            isWalls: isWalls,
            isRunning: isRunning,
        };
    }
    resetState(){
        if(this.isRunning)
            return;
        console.log('clearing...');
        var squares = [[]];
        squares.shift();
        for(var j = 0; j < GLOBAL_YMAX; j++){  
            var row = [];
            for(var i = 0; i < GLOBAL_XMAX; i++){
                document.getElementById(j+','+i).className = 'square';
                if(i ===  GLOBAL_XGOAL && j ===  GLOBAL_YGOAL) {
                    row.push('green');
                    document.getElementById(j+','+i).className = 'green square';
                }
                if( i===5 && j ===5) {
                    document.getElementById(j+','+i).className = 'start square';
                    row.push('start');
                }
                else { 
                    row.push(null);
                }
            }
            
            squares.push(row);
        }
        this.setState({squares: squares, xStart: 5, yStart: 5});
    }
    resetWalls(){
        if(this.isRunning)
            return;
        console.log('clearing...');
        var squares = [];
        for (var o = 0; o < this.state.squares.length; o++)
         squares = this.state.squares.slice();
        for(var j = 0; j < GLOBAL_YMAX; j++){  
            var row = [];
            for(var i = 0; i < GLOBAL_XMAX; i++){
                if(squares[j][i] !== 'wall'){
                    squares[j][i] = null;
                    document.getElementById(j+','+i).className = 'square';
                    if(i ===  GLOBAL_XGOAL && j ===  GLOBAL_YGOAL) {
                        row.push('green');
                        document.getElementById(j+','+i).className = 'green square';
                    }
                    else { 
                        row.push(null);
                    }
                } else {
                    row.push(null);
                }
            }
            
            squares.push(row);
        }
        this.setState({squares: squares},);
    }

    BFS(i,j) {
        if(this.isRunning)
            return;
        this.resetWalls();
        this.isRunning = true;
        var queue = [[]];
        queue.push([i,j]);
        queue.shift();
        var paths = new Map();
        let y = queue[0][0];
        let x = queue[0][1]
        paths.set(y+','+x,[0,null]);
        var timer = 8;
        var search = setInterval(() => {
            for(var ii = 0; ii < timer/8; ii++) {
                var squares = [];
                for (var o = 0; o < this.state.squares.length; o++)
                    squares = this.state.squares.slice();
                try{
                    y = queue[0][0];
                    x = queue[0][1];
                    if(queue.length !== 0 && !(y ===  GLOBAL_YGOAL && x ===  GLOBAL_XGOAL)) {
                        if(squares[y][x] !== 'X') { 
                            let dist = 1;
                            var isSet=0;
                            if(squares[y][x] == 'X'){
                                queue.shift();
                                return;
                            }
                            if(squares[y][x] == 'weight') {
                                squares[y][x] = 'wasweight';
                                queue.push([y,x]);
                                this.setState({squares: squares}); 
                                return;
                            }
                        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            if(x < GLOBAL_XMAX-1 && squares[y][x+1] !== 'X' && squares[y][x+1] !== 'wall' && squares[y][x+1] !== 'weight real_weight') {
                                queue.push([y,x+1]);
                                paths.set(y+','+(x+1),[dist, y+','+x]);
                            }
                            if(x > 0 && squares[y][x-1] !== 'X' && squares[y][x-1] !== 'wall' && squares[y][x-1] !== 'weight real_weight'){
                                queue.push([y,x-1]);
                                paths.set(y+','+(x-1),[dist, y+','+x]);
                            }

                            if(y < GLOBAL_YMAX-1 && squares[y+1][x] !== 'X' && squares[y+1][x] !== 'wall' && squares[y+1][x] !== 'weight real_weight'){
                                queue.push([y+1,x]);
                                paths.set((y+1)+','+x,[dist, y+','+x]);
                            }

                            if(y > 0 && squares[y-1][x] !== 'X' && squares[y-1][x] !== 'wall' && squares[y-1][x] !== 'weight real_weight'){
                                queue.push([y-1,x]);
                                paths.set((y-1)+','+x,[dist, y+','+x]);
                            }
                        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                            if( x < 36 && squares[y][x+1] == 'weight real_weight') {
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
                            if(y < 19 && squares[y+1][x] == 'weight real_weight'){
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
                            document.getElementById(y+","+x).className = squares[y][x] + " square";
                        }
                        timer = queue.length;
                        queue.shift();
                    } else {
                        timer = 1;
                        let next = paths.get( GLOBAL_YGOAL+','+ GLOBAL_XGOAL)[1].split(',');
                        y = next[0];
                        x = next[1];
                        squares[y][x] = 'visited';
                        var find_path = setInterval(() => { 
                            if(next !== null && !(x == j && y == i)) {
                            squares[y][x] = 'visited';
                            document.getElementById(y+","+x).className = squares[y][x]+' square';
                            next = paths.get(y+','+x)[1];
                            if(next!=null){
                                next = next.split(',');
                                y = next[0];
                                x = next[1];
                            }
                            
                            } else {
                            clearInterval(find_path);
                            }
                        clearInterval(search);
                        }, 30);
                        this.isRunning = false;
                    }
                } catch {
                    clearInterval(find_path);
                    clearInterval(search);
                    this.isRunning = false;
                    this.resetState();
                }
            }
        //    timer++;
        },1);
    }
    A_star(i,j){
        if(this.isRunning)
            return;
        this.resetWalls();
        this.isRunning = true;
        var dist_origin = 0;
        var dist_end = Math.abs(GLOBAL_YGOAL-j) + Math.abs(GLOBAL_XGOAL-i);
        var dist;
        var open_list = [[]];
        open_list.shift();
        open_list.push([i,j,0,0]);
        var paths = new Map();
        paths.set(i+','+j,[0,null]);
        let x = i;
        let y = j;
        var timer = 1;
            var search = setInterval(() => {
                for(var ii = 0; ii < timer; ii++) {
                    var squares = [];
                    for (var o = 0; o < this.state.squares.length; o++)
                        squares = this.state.squares.slice();
                        
                    try{
                        y = open_list[0][0];
                        x = open_list[0][1];
                        if(squares[y][x] == 'X'){
                            open_list.shift();
                            return;
                        }
                        dist_origin = open_list[0][3];
                        dist_origin++;
                        if(open_list.length > 0 && !(y === GLOBAL_YGOAL && x === GLOBAL_XGOAL)) {
                            open_list.shift();
                            if(squares[y][x] !== 'X') { 
                                if(x < GLOBAL_XMAX-1 && squares[y][x+1] !== 'X' && squares[y][x+1] !== 'wall') {
                                //    dist_origin = Math.abs(y-j) + Math.abs(x+1-i)+1;
                                    dist_end = Math.abs( GLOBAL_YGOAL-y) + Math.abs(GLOBAL_XGOAL-(x+1));
                                    dist = dist_origin + dist_end;
                                    open_list.push([y,x+1,dist,dist_origin]);
                                    paths.set(y+','+(x+1),[dist, y+','+x]);
                                }
                                
                                if(x > 0 && squares[y][x-1] !== 'X' && squares[y][x-1] !== 'wall'){
                            //      dist_origin = Math.abs(y-j) + Math.abs(x-1-i)+1;
                                    dist_end = Math.abs( GLOBAL_YGOAL-y) + Math.abs( GLOBAL_XGOAL-(x-1));
                                    dist = dist_origin + dist_end;
                                    open_list.push([y,x-1,dist,dist_origin]);
                                    paths.set(y+','+(x-1),[dist, y+','+x]);
                                }
        
                                if(y < GLOBAL_YMAX-1 && squares[y+1][x] !== 'X' && squares[y+1][x] !== 'wall'){
                            //      dist_origin = Math.abs(y+1-j) + Math.abs(x-i)+1;
                                    dist_end = Math.abs( GLOBAL_YGOAL-(y+1)) + Math.abs( GLOBAL_XGOAL-x);
                                    dist = dist_origin + dist_end;
                                    open_list.push([y+1,x,dist,dist_origin]);
                                    paths.set((y+1)+','+x,[dist, y+','+x]);
                                }
        
                                if(y > 0 && squares[y-1][x] !== 'X' && squares[y-1][x] !== 'wall'){
                                //    dist_origin = Math.abs(y-1-j) + Math.abs(x-i)+1;
                                    dist_end = Math.abs( GLOBAL_YGOAL-(y-1)) + Math.abs( GLOBAL_XGOAL-x);
                                    dist = dist_origin + dist_end;
                                    open_list.push([y-1,x,dist,dist_origin]);
                                    paths.set((y-1)+','+x,[dist, y+','+x]);
                                }
                                
                                open_list.sort(function(a,b){
                                    return a[2]-b[2];
                                });
                                squares[y][x] = 'X';
                                squares[i][j] = 'start';
                                document.getElementById(y+","+x).className = squares[y][x] + " square";
                                timer = open_list.length;
                            }
                        } else {
                            timer = 1;
                            let next = paths.get(GLOBAL_YGOAL+','+GLOBAL_XGOAL)[1].split(',');
                            y = next[0];
                            x = next[1];
                            squares[y][x] = 'visited';
                            var find_path = setInterval(() => { 
                                if(next !== null && !(x == j && y == i)) {
                                squares[y][x] = 'visited';
                                document.getElementById(y+","+x).className = squares[y][x] + " square";
                                next = paths.get(y+','+x)[1];
                                if(next!=null){
                                    next = next.split(',');
                                    y = next[0];
                                    x = next[1];
                                }
                                } else {
                                clearInterval(find_path);
                                }
                            clearInterval(search);
                            }, 30);
                            this.isRunning = false;
                        }
                    } catch {
                        clearInterval(find_path);
                        clearInterval(search);
                        this.isRunning = false;
                        this.resetState();
                    }
                }
            }, 1);
    }
    toggleWall(){
        this.isWalls = true;
    }
    toggleWeight(){
        this.isWalls = false;
    }
    addWall(i,j){
        if(this.isMouseDown){
            var squares = [];
            for (var o = 0; o < this.state.squares.length; o++)
                squares = this.state.squares.slice();
            if(squares[i][j] == 'green' || squares[i][j] == 'start'){
            } else if (!this.isWalls && this.isWalls!=undefined){
                squares[i][j] = 'weight real_weight';
            } else if (squares[i][j] == 'wall'){
                squares[i][j] = null;
                document.getElementById(i+","+j).className = 'square';
            } else {
                squares[i][j] = 'wall';
                document.getElementById(i+","+j).className = 'wall square';
            }
           // this.setState({squares: squares});
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
        document.getElementById(xStart+","+yStart).className = "square";
        squares[i][j] = 'start';
        document.getElementById(i+","+j).className = squares[i][j] + " square";
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
            location ={[i]+','+[j]}
            y = {i}
            x ={j}
        />
        );
    }

    render() {
        let status;
        
        const items = [[]];
        for(var x = 0; x < GLOBAL_YMAX; x++) {
            var row = [];
            for(var j = 0; j < GLOBAL_XMAX; j++){
                row.push(this.renderSquare(x,j));
                if(j===GLOBAL_XMAX-1)
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
            <a className="navbar-brand" href="#"><img src="path.png"></img> <div className="logo">Pathfinder</div></a>
            <button className="navbar-toggler reset first"onClick={() => this.toggleWall()}> Add Walls</button>
            <button className="navbar-toggler reset"onClick={() => this.toggleWeight()}> Add Weights</button>
            <button className="navbar-toggler reset"onClick={() => this.BFS(this.state.xStart,this.state.yStart)}> Dijsktra's</button>
            <button className="navbar-toggler reset"onClick={() => this.A_star(this.state.xStart,this.state.yStart)}> A*</button>
            <button className="navbar-toggler reset"onClick={() => this.resetState()}> Reset Board</button>
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
