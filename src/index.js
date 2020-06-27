import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
let GLOBAL_XMAX = parseInt((window.innerWidth-100)/25);
GLOBAL_XMAX % 2 == 0 ? GLOBAL_XMAX++: GLOBAL_XMAX+=0;
let GLOBAL_YMAX = parseInt((window.innerHeight-100)/25);
GLOBAL_YMAX % 2 == 0 ? GLOBAL_YMAX++: GLOBAL_YMAX+=0;
const GLOBAL_XGOAL = parseInt(GLOBAL_XMAX*.70);
const GLOBAL_YGOAL = parseInt(GLOBAL_YMAX*(3/4));
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}
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
                if(squares[j][i] !== 'wall' && squares[j][i] !== 'weight real_weight'){
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
    async StartMaze(midx, midy, xmax, ymax, xmin, ymin) {
        if(this.isRunning) 
            return;
        await this.resetState();
        this.isRunning = true;
        var squares =[];
        for (var o = 0; o < this.state.squares.length; o++)
            squares = this.state.squares.slice();
        var i = 0;
        var j = 0;
        var initialize = setInterval(() => {
            if(i < xmax) {
                squares[0][i] = 'wall';
                squares[ymax-1][i] = 'wall';
                document.getElementById(0+','+i).className = 'wall square';
                document.getElementById((ymax-1)+','+i).className = 'wall square';
                i++;
            } else if(j < ymax) {
                squares[j][0] = 'wall';
                squares[j][xmax-1] = 'wall';
                document.getElementById(j+','+0).className = 'wall square';
                document.getElementById(j+','+(xmax-1)).className = 'wall square';
                j++;
            }else {
                var possible_xmids = [];
                var possible_ymids = [];
                clearInterval(initialize);
                for(let k = 2; k < GLOBAL_XMAX; k+=2) {
                    possible_xmids.push(k);
                }
                for(let k = 2; k < GLOBAL_YMAX; k+=2) {
                    possible_ymids.push(k);
                } 
                midx = possible_xmids[parseInt(possible_xmids.length/2)];
                midy = possible_ymids[parseInt(possible_ymids.length/2)];
                this.generateMaze(midx, midy, xmax, ymax, xmin, ymin, possible_xmids, possible_ymids);
            }
        }, 10)
    }
    async generateMaze(midx, midy, xmax, ymax, xmin, ymin, possible_xmids, possible_ymids) {
        var squares =[];
        for (var o = 0; o < this.state.squares.length; o++)
            squares = this.state.squares.slice();
        if(xmax-xmin < 3 || ymax - ymin < 3 || midy == ymin || midx == xmin)  {
            squares[GLOBAL_YGOAL][GLOBAL_XGOAL] = 'green';
            document.getElementById(GLOBAL_YGOAL+','+GLOBAL_XGOAL).className = 'green square';
            this.isRunning = false;
            return;
        }
        //upper left
        var new_midx = possible_xmids[parseInt((parseInt(xmin) + parseInt((midx-xmin)/2))/2)-1];
        var new_midy = possible_ymids[parseInt((parseInt(ymin) + parseInt((midy-ymin)/2))/2)-1];
        await this.generateMaze(new_midx, new_midy, midx, midy, xmin, ymin, possible_xmids, possible_ymids);

        //lower left
        new_midx = possible_xmids[parseInt((parseInt(xmin) + parseInt((midx-xmin)/2))/2)-1];
        new_midy = possible_ymids[parseInt((parseInt(midy) + parseInt((ymax-midy)/2))/2)-1];
        await this.generateMaze(new_midx, new_midy, midx, ymax, xmin, midy, possible_xmids, possible_ymids);
        var x = xmin;
        var y = ymin;
        var holex1 = possible_xmids[randomIntFromInterval(parseInt(xmin/2), parseInt((midx-2)/2))]-1;
        var holex2 = possible_xmids[randomIntFromInterval(parseInt(midx/2), parseInt((xmax-2)/2))]-1;
        var holey  = possible_ymids[randomIntFromInterval(parseInt(ymin/2), parseInt((midy-2)/2))]-1;
        var holey2  = possible_ymids[randomIntFromInterval(parseInt(midy/2), parseInt((ymax-2)/2))]-1;
        var divide = setInterval(async () => {
            if(x < xmax) {
                if(!(x == this.state.xStart && y == this.state.xStart) && !(x == GLOBAL_XGOAL && y == GLOBAL_YGOAL) && x != holex1 && x != holex2) {
                    squares[midy][x] = 'wall';
                    document.getElementById(midy+','+x).className = 'wall square';
                }
                x++;
            } else if(y < ymax) {
                if(!(x == this.state.xStart && y == this.state.xStart) && !(x == GLOBAL_XGOAL && y == GLOBAL_YGOAL) && y != holey && y != holey2) {
                    squares[y][midx] = 'wall';
                    document.getElementById(y+','+midx).className = 'wall square';
                }
                y++;
            } else {

                //upper right
                new_midx = possible_xmids[parseInt((parseInt(midx) + parseInt((xmax-midx)/2))/2)-1];
                new_midy = possible_ymids[parseInt((parseInt(ymin) + parseInt((midy-ymin)/2))/2)-1];
                await this.generateMaze(new_midx, new_midy, xmax, midy, midx, ymin, possible_xmids, possible_ymids);

                //lower right
                new_midx = possible_xmids[parseInt((parseInt(midx) + parseInt((xmax-midx)/2))/2)-1];
                new_midy = possible_ymids[parseInt((parseInt(midy) + parseInt((ymax-midy)/2))/2)-1];
                await this.generateMaze(new_midx, new_midy, xmax, ymax, midx, midy, possible_xmids, possible_ymids);
                clearInterval(divide)
            }
        }, 10);
    }
    
    checkPrims(squares, x, y, choice, walls) {
        switch(choice) {
            case 1:
                return  x+2 < GLOBAL_XMAX && squares[y][x+1] != null && squares[y][x+2] != null && !this.checkQueue(walls,y,x+2);
            case 2:
                return y+2 < GLOBAL_YMAX && squares[y+1][x] != null && squares[y+2][x] != null && !this.checkQueue(walls,y+2,x);
            case 3:
                return x-2 > 0 && squares[y][x-1] != null && squares[y][x-2] != null && !this.checkQueue(walls,y,x-2);
            case 4:
                return y-2 > 0 && squares[y-1][x] != null && squares[y-2][x] != null && !this.checkQueue(walls,y-2,x);
        }
        
    }
    async Prims() {
        if(this.isRunning) 
            return;
        await this.resetState();
        this.isRunning = true;
        var squares =[];
        for (var o = 0; o < this.state.squares.length; o++)
            squares = this.state.squares.slice();
        var i = 0;
        var j = 0;
        var initialize = setInterval(() => {
            if(i < GLOBAL_XMAX) {
                for(var j = 0; j < GLOBAL_YMAX; j++) {
                    if(!(i == GLOBAL_XGOAL && j == GLOBAL_YGOAL) && !(i==this.state.xStart && j == this.state.yStart)) {
                        squares[j][i] = 'wall';
                        document.getElementById((j)+','+i).className = 'wall square';
                    }
                }
                i++;
            }else {
                clearInterval(initialize);
                var walls = [];
                var x = 1;
                var y = 1;
                walls.push([y,x+2]);
                walls.push([y+2,x]);
                squares[y][x] = null;
                document.getElementById(y+','+x).className = 'square';
                var carveMaze = setInterval(() => {
                    if(walls.length != 0) {
                        var wall = randomIntFromInterval(0, walls.length-1);
                        x = walls[wall][1];
                        y = walls[wall][0];
                        squares[y][x] = null;
                        if(y-2 > 0 && squares[y-2][x] == null && squares[y-1][x] != null) {
                            squares[y][x] = null;
                            document.getElementById(y+','+x).className = 'square';
                            squares[y-1][x] = null;
                            document.getElementById(y-1+','+x).className = 'square';
                            if(this.checkPrims(squares,x,y,1,walls)) walls.push([y,x+2]);
                            if(this.checkPrims(squares,x,y,2,walls)) walls.push([y+2,x]);
                            if(this.checkPrims(squares,x,y,3,walls)) walls.push([y,x-2]);
                            if(this.checkPrims(squares,x,y,4,walls)) walls.push([y-2,x]);
                        } else if(x-2 > 0 && squares[y][x-2] == null && squares[y][x-1] != null) {
                            squares[y][x] = null;
                            document.getElementById(y+','+(x-1)).className = 'square';
                            squares[y][x-1] = null;
                            document.getElementById(y+','+x).className = 'square';
                            if(this.checkPrims(squares,x,y,1,walls)) walls.push([y,x+2]);
                            if(this.checkPrims(squares,x,y,2,walls)) walls.push([y+2,x]);
                            if(this.checkPrims(squares,x,y,3,walls)) walls.push([y,x-2]);
                            if(this.checkPrims(squares,x,y,4,walls)) walls.push([y-2,x]);
                        } else if(x+2 < GLOBAL_XMAX && squares[y][x+2] == null && squares[y][x+1] != null) {
                            squares[y][x] = null;
                            document.getElementById(y+','+(x+1)).className = 'square';
                            squares[y][x+1] = null;
                            document.getElementById(y+','+x).className = 'square';
                            if(this.checkPrims(squares,x,y,1,walls)) walls.push([y,x+2]);
                            if(this.checkPrims(squares,x,y,2,walls)) walls.push([y+2,x]);
                            if(this.checkPrims(squares,x,y,3,walls)) walls.push([y,x-2]);
                            if(this.checkPrims(squares,x,y,4,walls)) walls.push([y-2,x]);
                        } else if(y+2 < GLOBAL_YMAX && squares[y+2][x] == null && squares[y+1][x] != null) {
                            squares[y][x] = null;
                            document.getElementById(y+','+(x-1)).className = 'square';
                            squares[y][x-1] = null;
                            document.getElementById(y+','+x).className = 'square';
                            if(this.checkPrims(squares,x,y,1,walls)) walls.push([y,x+2]);
                            if(this.checkPrims(squares,x,y,2,walls)) walls.push([y+2,x]);
                            if(this.checkPrims(squares,x,y,3,walls)) walls.push([y,x-2]);
                            if(this.checkPrims(squares,x,y,4,walls)) walls.push([y-2,x]);
                        }
                        squares[this.state.yStart][this.state.xStart] = 'start'
                        document.getElementById(this.state.yStart+','+this.state.xStart).className = 'start square';
                        squares[GLOBAL_YGOAL][GLOBAL_XGOAL] = 'green';
                        document.getElementById(GLOBAL_YGOAL+','+GLOBAL_XGOAL).className = 'green square';
                        walls.splice(wall, 1);
                    } else {
                        this.isRunning = false;
                        clearInterval(carveMaze);
                    }
                }, 10)
            }
        },25);
    }
    checkQueue(queue, y, x) {
        for(var i = 0; i < queue.length; i++) {
            if(queue[i][0] == y && queue[i][1] == x)
                return true;
        }
        return false;
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
        var timer = 4;
        var search = setInterval(() => {
            for(var ii = 0; ii < timer; ii++) {
                var squares = [];
                for (var o = 0; o < this.state.squares.length; o++)
                    squares = this.state.squares.slice();
                try{
                    y = queue[0][0];
                    x = queue[0][1];
                    if(queue.length !== 0 && !(y ===  GLOBAL_YGOAL && x ===  GLOBAL_XGOAL)) {
                        let dist = 1;
                        var isSet=0;
                        //right
                        if(x < GLOBAL_XMAX-1 && squares[y][x+1] !== 'X' && squares[y][x+1] !== 'wall' && squares[y][x+1] !== 'weight real_weight' && !this.checkQueue(queue,y,x+1)) {
                            queue.push([y,x+1]);
                            paths.set(y+','+(x+1),[dist, y+','+x]);
                        }
                        //left
                        if(x > 0 && squares[y][x-1] !== 'X' && squares[y][x-1] !== 'wall' && squares[y][x-1] !== 'weight real_weight' && !this.checkQueue(queue,y,x-1)){
                            queue.push([y,x-1]);
                            paths.set(y+','+(x-1),[dist, y+','+x]);
                        }
                        //up
                        if(y < GLOBAL_YMAX-1 && squares[y+1][x] !== 'X' && squares[y+1][x] !== 'wall' && squares[y+1][x] !== 'weight real_weight' && !this.checkQueue(queue,y+1,x)){
                            queue.push([y+1,x]);
                            paths.set((y+1)+','+x,[dist, y+','+x]);
                        }
                        //down
                        if(y > 0 && squares[y-1][x] !== 'X' && squares[y-1][x] !== 'wall' && squares[y-1][x] !== 'weight real_weight' && !this.checkQueue(queue,y-1,x)){
                            queue.push([y-1,x]);
                            paths.set((y-1)+','+x,[dist, y+','+x]);
                        }
                        //weight right
                        if( x < GLOBAL_XMAX-1 && squares[y][x+1] === 'weight real_weight') {
                            squares[y][x+1] = null;
                            document.getElementById(y+","+x).className = squares[y][x+1] + " square";
                            queue.push([y,x]);
                        }
                        //weight left
                        if(x > 0 && squares[y][x-1] === 'weight real_weight'){
                            squares[y][x-1] = 'weight';
                            queue.push([y,x]);
                        }
                        //weight up
                        if(y < GLOBAL_YMAX-1 && squares[y+1][x] === 'weight real_weight'){
                            squares[y+1][x] = 'weight';
                            queue.push([y,x]);
                            document.getElementById(y+","+x).className = squares[y+1][x] + " square";
                        }
                        //weight down
                        if(y > 0 && squares[y-1][x] === 'weight real_weight'){
                            squares[y-1][x] = 'weight';
                            queue.push([y,x]);
                            document.getElementById(y+","+x).className = squares[y-1][x] + " square";
                        }
                        squares[y][x] = 'X';
                        squares[i][j] = 'start';
                        document.getElementById(y+","+x).className = squares[y][x] + " square";
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
                                this.isRunning = false;
                                clearInterval(find_path);
                            }
                        clearInterval(search);
                        }, 15);
                    }
                } catch {
                    clearInterval(find_path);
                    clearInterval(search);
                    this.isRunning = false;
                }
            }
        }, 50);
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
                for(var ii = 0; ii < timer/4; ii++) {
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
                            if(x < GLOBAL_XMAX-1 && squares[y][x+1] !== 'X' && squares[y][x+1] !== 'wall' && squares[y][x+1] !== 'weight real_weight' && !this.checkQueue(open_list,y,x+1)) {
                                dist_end = Math.abs( GLOBAL_YGOAL-y) + Math.abs(GLOBAL_XGOAL-(x+1));
                                dist = dist_origin + dist_end;
                                open_list.push([y,x+1,dist,dist_origin]);
                                paths.set(y+','+(x+1),[dist, y+','+x]);
                            }
                            if(x > 0 && squares[y][x-1] !== 'X' && squares[y][x-1] !== 'wall' && squares[y][x-1] !== 'weight real_weight' && !this.checkQueue(open_list,y,x-1)){
                                dist_end = Math.abs( GLOBAL_YGOAL-y) + Math.abs( GLOBAL_XGOAL-(x-1));
                                dist = dist_origin + dist_end;
                                open_list.push([y,x-1,dist,dist_origin]);
                                paths.set(y+','+(x-1),[dist, y+','+x]);
                            }
                            if(y < GLOBAL_YMAX-1 && squares[y+1][x] !== 'X' && squares[y+1][x] !== 'wall' && squares[y+1][x] !== 'weight real_weight' && !this.checkQueue(open_list,y+1,x)){
                                dist_end = Math.abs( GLOBAL_YGOAL-(y+1)) + Math.abs( GLOBAL_XGOAL-x);
                                dist = dist_origin + dist_end;
                                open_list.push([y+1,x,dist,dist_origin]);
                                paths.set((y+1)+','+x,[dist, y+','+x]);
                            }
                            if(y > 0 && squares[y-1][x] !== 'X' && squares[y-1][x] !== 'wall' && squares[y-1][x] !== 'weight real_weight' && !this.checkQueue(open_list,y-1,x)){
                                dist_end = Math.abs( GLOBAL_YGOAL-(y-1)) + Math.abs( GLOBAL_XGOAL-x);
                                dist = dist_origin + dist_end;
                                open_list.push([y-1,x,dist,dist_origin]);
                                paths.set((y-1)+','+x,[dist, y+','+x]);
                            }

                            if(x < GLOBAL_XMAX-1 && squares[y][x+1]  === 'weight real_weight') {
                                dist_end = Math.abs( GLOBAL_YGOAL-y) + Math.abs(GLOBAL_XGOAL-(x+1));
                                dist = dist_origin + dist_end + 2; //weight of 2
                                open_list.push([y,x+1,dist,dist_origin]);
                                paths.set(y+','+(x+1),[dist, y+','+x]);
                            }
                            if(x > 0 && squares[y][x-1] !== 'X'  === 'weight real_weight'){
                                dist_end = Math.abs( GLOBAL_YGOAL-y) + Math.abs( GLOBAL_XGOAL-(x-1));
                                dist = dist_origin + dist_end + 2;
                                open_list.push([y,x-1,dist,dist_origin]);
                                paths.set(y+','+(x-1),[dist, y+','+x]);
                            }
                            if(y < GLOBAL_YMAX-1 && squares[y+1][x]  === 'weight real_weight'){
                                dist_end = Math.abs( GLOBAL_YGOAL-(y+1)) + Math.abs( GLOBAL_XGOAL-x);
                                dist = dist_origin + dist_end + 2;
                                open_list.push([y+1,x,dist,dist_origin]);
                                paths.set((y+1)+','+x,[dist, y+','+x]);
                            }
                            if(y > 0 && squares[y-1][x] !== 'X'  === 'weight real_weight'){
                                dist_end = Math.abs( GLOBAL_YGOAL-(y-1)) + Math.abs( GLOBAL_XGOAL-x);
                                dist = dist_origin + dist_end + 2;
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
                                    this.isRunning = false;
                                    clearInterval(find_path);
                                }
                            clearInterval(search);
                            }, 15);
                        }
                    } catch {
                        clearInterval(find_path);
                        clearInterval(search);
                        this.isRunning = false;
                    }
                }
            }, 40);
    }
    toggleWall(){
        this.isWalls = true;
        document.getElementById("w").classList.add("active");
        document.getElementById("we").classList.remove("active");
    }
    toggleWeight(){
        this.isWalls = false;
        document.getElementById("w").classList.remove("active");
        document.getElementById("we").classList.add("active");
    }
    addWall(i,j){
        if(this.isMouseDown){
            var squares = [];
            for (var o = 0; o < this.state.squares.length; o++)
                squares = this.state.squares.slice();
            if(squares[i][j] == 'green' || squares[i][j] == 'start'){
            } else if (!this.isWalls && this.isWalls!=undefined){
                squares[i][j] = 'weight real_weight';
                document.getElementById(i+","+j).className = 'weight real_weight square';
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
            <div className="nav-center">
                <Button color="primary" id="w" className="navbar-toggler reset active"onClick={() => this.toggleWall()}> Add Walls</Button>
                <Button color="primary" id="we" className="navbar-toggler reset"onClick={() => this.toggleWeight()}> Add Weights</Button>
                <Button color="primary" className="navbar-toggler reset"onClick={() => this.BFS(this.state.xStart,this.state.yStart)}> Dijsktra's</Button>
                <Button color="primary" className="navbar-toggler reset"onClick={() => this.A_star(this.state.xStart,this.state.yStart)}> A*</Button>
                <Button color="primary" className="navbar-toggler reset"onClick={() => this.resetState()}> Reset Board</Button>
                <Button color="primary" className="navbar-toggler reset"onClick={() => this.StartMaze(parseInt(GLOBAL_XMAX/2), parseInt(GLOBAL_YMAX/2), GLOBAL_XMAX, GLOBAL_YMAX, 0, 0)}> Recursive Maze</Button>
                <Button color="primary" className="navbar-toggler reset"onClick={() => this.Prims()}> Prim's Maze</Button>
            </div>
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
