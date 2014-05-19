
//Object for every BOX
var NewBox = function(x,y){
	return {
		x: x,
		y: y,
		active: false,
		bomb: false,  //"Clean or Bomb"
		value: 0,
		//template: "<a id='" + x + ":" + y + "' class='box' href=''></a>",
		template: (function(){
			var a = document.createElement("a");
			a.className = "box";
			a.setAttribute("href","#");
			a.id = x + ":" + y;
			return a;
		}()),


		setXY: function (x,y){
			this.x=x;
			this.y=y;
		},
		setBomb: function(bool){
			this.bomb = bool;
		},
		setValue: function(value){
			this.value = value;
		},
		toggleActive: function(){
			this.active = !this.active;
		}
	}
}

var _maxSize = 12;
var _defaultSize = 6;


//Mines constructor
var Mines = function(elementId, width, height, nrOfMines){

	this.elementId = elementId;
	this.templateBlock = document.createElement("ul");
	this.templateBlock.className = "block";
	//this.templateBlock.appendChild(document.createElement("li"));

	//seting the size
	if ((typeof width === "number") && (width >=3) && (width < _maxSize)) this.boxWidth = Math.floor(width);
	else if (!this.boxWidth) this.boxWidth = _defaultSize;
	if ((typeof height === "number") && (height >=3) && (height < _maxSize)) this.boxHeight = Math.floor(height);
	else if (!this.boxHeight) this.boxHeight = _defaultSize;

	this.maze = [];
	this.nrOfMines = nrOfMines;
}

//reseting properties and generating a new game
Mines.prototype.startNewGame = function(width,height, nrOfMines){
	removeClickEvent(document.getElementById("minesid"), listener);
	this.maze=[];
	this.nrOfMines = nrOfMines;
	this.setMazeSize(width,height);
	this.generateMaze();
	this.drawMaze();
	clickEvent(document.getElementById("minesid"), listener);
}

//adding NewBox() to every element, generating bombs and calculating every box values.
Mines.prototype.generateMaze = function(){
	var i,j,bombPositionGood,t;

	//populate maze with NewBox objects
	for (i=0;i<this.boxWidth;i++){
		this.maze[i]=[];
		for(j=0;j<this.boxHeight;j++){
			this.maze[i][j]= NewBox(i,j);
		}
	}

	//set the bombs in the maze
	var bombs = _generateBomgsArray(this.boxWidth, this.boxHeight, this.nrOfMines);
	for(t=0;t<bombs.length;t++){
		this.maze[bombs[t].x][bombs[t].y].setBomb(true);
	}
	//calculate values (value = number of bombs around every box)
	this._calculateValues();
}

//calculates values for every box (value=number of bombs around every box)
Mines.prototype._calculateValues = function(){
	var i,j, ii,jj;
	for (i = 0; i < this.maze.length; i++) {
		for (j = 0; j < this.maze[i].length; j++) {
			//val=0;
			if(this.maze[i][j].bomb===true){

				if (i>0){
					if (j>0) this.maze[i-1][j-1].value += 1;
					this.maze[i-1][j  ].value += 1;
					if (j<this.maze[this.maze.length-1].length-1) this.maze[i-1][j+1].value += 1;
				}

				if (j>0) this.maze[i][j-1].value += 1;
				if (j<this.maze[this.maze.length-1].length-1) this.maze[i][j+1].value += 1;	

				if (i<this.maze.length-1){
					if (j>0) this.maze[i+1][j-1].value += 1;
					this.maze[i+1][j  ].value += 1;
					if (j<this.maze[this.maze.length-1].length-1) this.maze[i+1][j+1].value += 1;
				}
			};
		}
	};

	//clear values on bomb boxes
	for (i = 0; i < this.maze.length; i++) 
		for (j = 0; j < this.maze[i].length; j++) {
			if (this.maze[i][j].bomb) this.maze[i][j].value=-1;
		}
}


//generating unique bombs positions array
function _generateBomgsArray(x,y,nrOfMines){
	
	var bombs = [];
	for (i=0;i<nrOfMines;i++){

		//generating bomb and checking if already exists
		do{  
			var temp = {
				x : Math.floor(Math.random()*x),
				y : Math.floor(Math.random()*y)
			};
			bombPositionGood=true;
			for (t=0;t<i;t++) if ((bombs[t].x === temp.x) && (bombs[t].y === temp.y)) { bombPositionGood=false;} //checking if bombs position already generated
		} while (bombPositionGood === false);

			bombs.push(temp);
	}

	return bombs;
}

//sets the maze width and height properties
Mines.prototype.setMazeSize = function(width, height){
	//seting the size
	if ((typeof width === "number") && (width >=3) && (width < _maxSize)) this.boxWidth = Math.floor(width);
	else if (!this.boxWidth) this.boxWidth = _defaultSize;
	if ((typeof height === "number") && (height >=3) && (height < _maxSize)) this.boxHeight = Math.floor(height);
	else if (!this.boxHeight) this.boxHeight = _defaultSize;

	return true;
}

//draws the maze on the DOM
Mines.prototype.drawMaze = function(){
	var div = document.getElementById(this.elementId);
	div.innerHTML = "";
	
	//ul.appendChild(document.createElement("li"));
	for (j=0;j<this.maze[0].length;j++){
		var ul = document.createElement("ul");
		ul.className = "block";
		var li = document.createElement("li");
		for (i=0;i<this.maze.length;i++){
			this.maze[i][j].template.innerHTML=this.maze[i][j].value;   //add value on innerHTML
			li.appendChild(this.maze[i][j].template);
		}
		//var tempUl = ul;
		//li.appendChild(tempUl);
		ul.appendChild(li);
		div.appendChild(ul);
	}
}

//used on click event, function actives a box
Mines.prototype.serActiveBox = function(id,e){
	var x,y;
	x=Math.floor(id.split(":")[0]);
	y=Math.floor(id.split(":")[1]);
	//console.log(x,y);
	if(this.maze[x][y].active === false && this.maze[x][y].bomb === true) {
		// console.log ("GAME OVER !!!");
		removeClickEvent(document.getElementById("minesid"), listener);
		this.drawAllBombs();
	}
	else this._activateField(x,y)
}

//recursive func to activate a field of "clean" boxes 
Mines.prototype._activateField = function(x,y){
	x=Math.floor(x); y=Math.floor(y);
	// console.log("checking: " + x +" x " + y);
	if (this.maze[x][y].active === false && this.maze[x][y].bomb === false){		
			this.maze[x][y].active =true;
			this.maze[x][y].template.setAttribute("name",this.maze[x][y].value);
			if (y>0) this._activateField(x  ,y-1);
			if (y<this.maze[0].length-1) {this._activateField(x  ,y+1); /*console.log(this.maze[0].length-1)*/}
			if (x>0) this._activateField(x-1,y  );
			if (x<this.maze.length-1) this._activateField(x+1,y  );
	}
}

//draw all bombs on DOM
Mines.prototype.drawAllBombs = function(){
	var i,j;
	for (i = 0; i < this.maze.length; i++) 
		for (j = 0; j < this.maze[i].length; j++) {
			if (this.maze[i][j].bomb) this.maze[i][j].template.setAttribute("name","bomb");
		}
}


//NEW GAME EVENTS
clickEvent(document.getElementById("reset"),  function(){
	mine1.startNewGame(Math.floor(document.getElementById("sizeX").value),
					   Math.floor(document.getElementById("sizeY").value),
					   Math.floor(document.getElementById("maxBombs").value));
})

var listener = function(e){
	e.preventDefault();
	if (e.target.id && e.target.className==="box") mine1.serActiveBox(e.target.id,e);
};
clickEvent(document.getElementById("minesid"), listener);

//click event ie8 compatible
function clickEvent(el, func){
	if (el.addEventListener) {
		el.addEventListener("click",func,false);
	}
	else {
		el.attachEvent("onclick", func);
	}
}

function removeClickEvent(el, listener){
	if (el.removeEventListener) {
		el.removeEventListener("click", listener, false);
	}
	else {
		el.detachEvent ("onclick", listener);
	}
}