/*
Author: Adrian Andersson
Date: 2019-03-13
Title: Aptitude test, problem B, Node.JS
Notes: Finds the shortest path between composite integers in the ulam spiral, 
with prime numbers are obstacles. Does not work for out-of-boundary cases. I 
should have used a more object-oriented mindset.
*/
const readline = require('readline');
var counter = 0;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    
    //Get line
    var nums = line.split(' ');
    counter++;

    //Create grid
    var gridInts = createGrid(); //gridCells contains all integers

    //Find indices for start and goal integer
    var startCoord = findCoords(parseInt(nums[0]), gridInts);
    var goalCoord = findCoords(parseInt(nums[1]), gridInts);

    //course contains 'Obstacle' for indexes of primes, 'Empty' else, aswell as 'Start' and 'Goal'
    var course = createCourse(gridInts, startCoord, goalCoord); 

    //print shortest possible path
    console.log('Case ' + counter + ': ' + findShortestPath(startCoord, course));

    //End scenario - REMOVE LATER
    //process.exit();
});

function findCoords(num, grid){
    for(var i = 0; i < 101; ++i){
        for(var j = 0; j < 101; ++j){
            if(grid[i][j] === num){
                return ([i, j]);
            } 
        }
    }
}

//***************************************************************************//
//Algorithm found at: http://gregtrowbridge.com/a-basic-pathfinding-algorithm//
//***************************************************************************//
function findShortestPath(startCoord, course){
    var row = startCoord[0];
    var col = startCoord[1];

    //Each "location" will store its coordinates
    //And the shortest path required to arrive there
    var location = {
        row: row,
        col: col,
        path: 0,//[],
        status: 'Start'
    };

    //Initialize the queue with the start location already inside
    var Q = [location];

    //Loop through the grid searching for the goal
    while(Q.length > 0){
        //Take the first location off the queue
        var currentLocation = Q.shift();

        //Explore up
        var newLocation = exploreDirection(currentLocation, 'up', course);
        if(newLocation.status === 'Goal'){
            return newLocation.path;
        }
        else if(newLocation.status === 'Valid'){
            Q.push(newLocation);
        }

        //Explore right
        var newLocation = exploreDirection(currentLocation, 'right', course);
        if(newLocation.status === 'Goal'){
            return newLocation.path;
        }
        else if(newLocation.status === 'Valid'){
            Q.push(newLocation);
        }

        //Explore down
        var newLocation = exploreDirection(currentLocation, 'down', course);
        if(newLocation.status === 'Goal'){
            return newLocation.path;
        }
        else if(newLocation.status === 'Valid'){
            Q.push(newLocation);
        }

        //Explore left
        var newLocation = exploreDirection(currentLocation, 'left', course);
        if(newLocation.status === 'Goal'){
            return newLocation.path;
        }
        else if(newLocation.status === 'Valid'){
            Q.push(newLocation);
        }
    }

    //No valid path available
    return 'impossible';
}

function locationStatus(location, course){
    var courseSize = course.length;
    var row = location.row;
    var col = location.col;

    //console.log(course[row][col] + ' ' + row + ' ' + col);

    if(col < 0 || col >= courseSize || row < 0 || row >= courseSize){
        //Location is outside grid
        return 'Invalid';
    }
    else if(course[row][col] === 'Goal'){
        return 'Goal';
    }
    else if(course[row][col] !== 'Empty'){
        //Obstacle or visited
        return 'Blocked';
    }
    else{
        return 'Valid';
    }
}

function exploreDirection(currentLocation, direction, course){
    var newPath = currentLocation.path;//.slice();
    newPath += 1;//.push(direction);

    var row = currentLocation.row;
    var col = currentLocation.col;

    if(direction === 'up'){
        row -= 1; 
    }
    else if(direction === 'right'){
        col += 1; 
    }
    else if(direction === 'down'){
        row += 1; 
    }
    else if(direction === 'left'){
        col -= 1; 
    }

    var newLocation = {
        row: row,
        col: col,
        path: newPath,
        status: 'Unknown'
    };
    newLocation.status = locationStatus(newLocation, course);

    //If this new location is valid, mark it as Visited
    if(newLocation.status === 'Valid'){
        course[newLocation.row][newLocation.col] = 'Visited';
    }

    return newLocation;
}
//***************************************************************************//
//Algorithm found at: http://gregtrowbridge.com/a-basic-pathfinding-algorithm//
//***************************************************************************//

//Create a large Ulam spiral containing numbers  < 10 000
function createGrid(){
    
    //Grid size is 101x101
    //Each cells contains a number
    var gridCells = new Array(101);
    for(var i = 0; i < 101; ++i){
        gridCells[i] = new Array(101);//.fill({value: 1, prime: 0});
    }


    //Define start cell, right of middle cell
    var row = 50;
    var col = 51;
    gridCells[50][50] = 1;

    //Integer, starting from 1
    var currInt = 2;

    for(var n = 1; n < 51; ++n){
        
        //Spiral upwards
        for(var m = 0; m < 2*n; ++m){
            gridCells[row-m][col] = currInt;
            currInt += 1;
        };
        row = row-(2*n-1);
        col = col-1;
        
        //Spiral left
        for(var m = 0; m < 2*n; ++m){
            gridCells[row][col-m] = currInt;
            currInt += 1;
        }
        col = col-(2*n-1);
        row = row+1;

        //Spiral downwards
        for(var m = 0; m < 2*n; ++m){
            gridCells[row+m][col] = currInt;
            currInt += 1;
        }
        row = row+(2*n-1);
        col = col+1;
        
        //Spiral right
        for(var m = 0; m < 2*n; ++m){
            gridCells[row][col+m] = currInt;
            currInt += 1;
        } 
        col = col+(2*n);
    }
    
    //For performance purposes
    //console.log('Done!');
    return gridCells;
}

function createCourse(grid, startCoord, goalCoord){
    var course = new Array(101);
    for(var i = 0; i < 101; ++i){
        course[i] = new Array(101).fill('Empty');
    }

    //Fill in wether cells contain prime or non-prime number
    for(var i = 0; i < 101; ++i){
        for(var j = 0; j < 101; ++j){
            if(i === startCoord[0] && j === startCoord[1]){
                course[i][j] = 'Start';
            }
            else if(i === goalCoord[0] && j === goalCoord[1]){
                course[i][j] = 'Goal';
            }
            else{
                course[i][j] = isPrime(grid[i][j]);
            }
        }
    }

    return course;
}

//Checks if input is a prime number, returns 'Empty' if not, 'Obstacle' else
function isPrime(num) {
    var str = 'Obstacle';
    for(var i = 2; i < num; ++i){
        if(num % i === 0){
            str = 'Empty';
            break;
        }
    }
    if(num === 1){
        str = 'Empty';
    }
    
    return str;
}

//Prints entire grid for debugging purposes
function printGrid(grid){
    console.table(grid);
}