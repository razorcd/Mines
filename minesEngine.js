
var NewBox = function(x,y,boxType){
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
			a.setAttribute("href"," ");
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



var Mines = function(elementId, width, height, nrOfMines){


	this.elementId = elementId;
	this.templateBlock = document.createElement("ul");
	this.templateBlock.className = "block";
	//this.templateBlock.appendChild(document.createElement("li"));

	//seting the size
	if ((typeof width === "number") && (width >=3) && (width < _maxSize)) this.boxWidth = Math.floor(width);
	else if (!this.boxWidth) this.boxWidth = _defaultSize;
	if ((typeof height === "number") && (height >=3) && (height < _maxSize)) this.boxHeight = Math.floor(height);
	
	this.maze = [];
	this.nrOfMines = nrOfMines;
}

Mines.prototype.generateMaze = function(){
	var i,j,bombPositionGood,t;

	//populate maze with NewBox objects
	for (i=0;i<this.boxWidth;i++){
		this.maze[i]=[];
		for(j=0;j<this.boxHeight;j++){
			this.maze[i][j]= NewBox(i,j,"Clean");
		}
	}


	var bombs = generateBomgsArray(this.boxWidth, this.boxHeight, this.nrOfMines);
	for(t=0;t<bombs.length;t++){
		this.maze[bombs[t].x][bombs[t].y].setBomb(true);
	}
	this._calculateValues();
	
}

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
}


//generating unique bombs positions array
function generateBomgsArray(x,y,nrOfMines){
	
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


Mines.prototype.setMazeSize = function(width, height){
	if ((typeof height !== "number") ||
		(typeof width !== "number") ||
		(height < 3) || (height > _maxSize) ||
		(width < 3) || (width > _maxSize)
	 ) return false;

	this.boxHeight = height;
	this.boxWidth = width;

	return true;
}

Mines.prototype.drawMaze = function(){
	var div = document.getElementById(this.elementId);
	div.innerHTML = "";
	
	//ul.appendChild(document.createElement("li"));
	

	for (j=0;j<this.maze[0].length;j++){
		var ul = document.createElement("ul");
		ul.className = "block";
		var li = document.createElement("li");
		for (i=0;i<this.maze.length;i++){
				
			li.appendChild(this.maze[i][j].template);
		}
		//var tempUl = ul;
		//li.appendChild(tempUl);
		ul.appendChild(li);
		div.appendChild(ul);
	}

}