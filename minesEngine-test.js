var TEST = {
	equal : function(a,b,message){
		return this._output((a===b) , message);
	},
	elementExists : function(elemid, message){
		return this._output(document.getElementById(elemid), message);

	},

	_output: function(result, message){
		console[result ? "log" : "error"]((result ? "PASS: " : "FAIL: ") + message);
		return result;
	}
}

var sizeXX = 11; sizeYY=11; bombz=10;
var mine1 = new Mines("minesid", sizeXX,sizeYY,bombz);

//constructor
TEST.equal(typeof mine1 , "object", "mine1 should be an object");
TEST.equal(mine1.boxWidth, sizeXX ,  "mine1.boxWidth("+mine1.boxWidth+") should be " + sizeXX);
TEST.equal(mine1.boxHeight, sizeYY ,  "mine1.boxHeight("+mine1.boxHeight+")  should be " + sizeYY);
TEST.equal(typeof mine1.elementId , "string", "mine1.elementId should be a string. mine1.elementId = " + mine1.elementId);
TEST.elementExists(mine1.elementId, "Element should exit in DOM. ID: " + mine1.elementId);
//TEST.equal(mine1.template.getAttribute("href"), " ", "Href should be ' ' on this.template");
//console.log( mine1.template)



//setMazeSize()
mine1.setMazeSize(sizeXX,sizeYY);
TEST.equal(mine1.boxWidth, sizeXX ,  "mine1.boxWidth("+mine1.boxWidth+") should be " + sizeXX);
TEST.equal(mine1.boxHeight, sizeYY ,  "mine1.boxHeight should be 5");
// TEST.equal (mine1.setMazeSize(-1,2), false, "mine1.setMazeSize(-1,2)  should return false");
// TEST.equal (mine1.setMazeSize(4,50), false, "mine1.setMazeSize(4,50)  should return false");
// TEST.equal (mine1.setMazeSize(null,5), false, "mine1.setMazeSize(null,5)  should return false");
// TEST.equal (mine1.setMazeSize(9, "4"), false, "mine1.setMazeSize(9,'4')  should return false");

//test NewBox
var box=NewBox(0,0,"Clean");
//console.dir(box);
TEST.equal(box.x, 0, "Box x should be 0");
TEST.equal(box.y, 0, "Box y should be 0");

box.setXY(7,3);
TEST.equal(box.x, 7, "Box x should be 7");
TEST.equal(box.y, 3, "Box y should be 3");

TEST.equal(box.active, false,"Box active should be false");
box.toggleActive();
TEST.equal(box.active, true,"Box active should be true");


//generateBomgsArray

TEST.equal(_generateBomgsArray(5,9,8).length,8,"Bomb array length should be 8");
var bombs= _generateBomgsArray(5,9,8);
for (var i=0;i<8;i++){
	TEST.equal((bombs[i].x<5), true, "Bombs.x should be less then 5");
	TEST.equal((bombs[i].y<9), true, "Bombs.y should be less then 9");
}




//genertemaze
console.log("SIZE IS: " + mine1.boxWidth + " x " + mine1.boxHeight);
mine1.generateMaze();
TEST.equal(typeof mine1.maze[mine1.boxWidth-1][mine1.boxHeight-1], "object", "mine1.maze last element should be an object")

//counting bombs in maze and maze elements
var nrOfBombs=0, mazeElem=0;
for(var i=0; i<sizeXX;i++)
	for(var j=0; j<sizeYY; j++){
		TEST.equal(typeof mine1.maze[i][j], "object", "Element mine1.maze["+ i + "][" + j + "] should be an object" );
		mazeElem +=1;
		if (mine1.maze[i][j].bomb === true) nrOfBombs += 1;
	}

TEST.equal(nrOfBombs, bombz, "Nr of bombs should be 10. nrOfBombs=" + nrOfBombs);
TEST.equal(mazeElem, sizeXX*sizeYY, "Nr of maze elements("+mazeElem+") should be " + sizeXX*sizeYY);



for (i = 0; i < mine1.maze.length; i++) {
	for (j = 0; j < mine1.maze[i].length; j++) {
		//console.log(mine1.maze[i][j]);
		if (mine1.maze[i][j].bomb) continue;
		var val = 0;
		try {  if (mine1.maze[i-1][j-1].bomb === true) val += 1;  } catch(e){}
		try {  if (mine1.maze[i-1][j  ].bomb === true) val += 1;  } catch(e){}
		try {  if (mine1.maze[i-1][j+1].bomb === true) val += 1;  } catch(e){}
		try {  if (mine1.maze[i  ][j-1].bomb === true) val += 1;  } catch(e){}
		//try {  if (mine1.maze[i  ][j  ].bomb === true) val += 1;  } catch(e){}
		try {  if (mine1.maze[i  ][j+1].bomb === true) val += 1;  } catch(e){}
		try {  if (mine1.maze[i+1][j-1].bomb === true) val += 1;  } catch(e){}
		try {  if (mine1.maze[i+1][j  ].bomb === true) val += 1;  } catch(e){}
		try {  if (mine1.maze[i+1][j+1].bomb === true) val += 1;  } catch(e){}
		TEST.equal(mine1.maze[i][j].value, val, "Value("+mine1.maze[i][j].value+") of " + i + "," + j + " should be equal to the nr of bombs around it:" + val);
	}
}


mine1.drawMaze();



mine1.startNewGame(10,8,35);