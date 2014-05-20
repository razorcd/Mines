function M(mid){

	var _maxSize = 15;
	var _defaultSize = 6;


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
				a.innerHTML = "&nbsp";
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

	//Mines constructor
	var Mines = function(elementId){

		this.elementId = elementId;
		this.gameOverEl = document.getElementById("gameover");
		this.elementSizeX = document.getElementById("sizeX");
		this.elementSizeY = document.getElementById("sizeY");
		this.elementMaxBombs = document.getElementById("maxBombs");
		this.elementNewGame = document.getElementById("reset");
		this.templateBlock = document.createElement("ul");
		this.templateBlock.className = "block";

		//seting the size
		this.boxWidth = _defaultSize;
		this.boxHeight = _defaultSize;

		this.maze = [];
		this.nrOfMines = 6;

	}

	//reseting properties and generating a new game
	Mines.prototype.startNewGame = function(width,height, nrOfMines){
		removeClickEvent(document.getElementById("minesid"), listener);
		this.gameOverEl.innerHTML = "";
		this.maze=[];

		width = validate(width, 3, _maxSize);
		height = validate(height, 3, _maxSize);
		this.nrOfMines = validate(nrOfMines, 3, width*height/1.5);

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

	function validate(val, min, max){
		if (isNaN(val)) val =_defaultSize;
		if(val<min) return min;
		if(val>max) return max;
		return val;
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

		this.elementSizeX.value = this.boxWidth;
		this.elementSizeY.value = this.boxHeight;
		this.elementMaxBombs.value = this.nrOfMines;

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
				//this.maze[i][j].template.innerHTML=this.maze[i][j].value;   //add value on innerHTML
				li.appendChild(this.maze[i][j].template);
			}

			ul.appendChild(li);
			div.appendChild(ul);
		}
	}

	//used on click event, function actives a box
	Mines.prototype.setActiveBox = function(id,e){

		var x,y;
		x=Math.floor(id.split(":")[0]);
		y=Math.floor(id.split(":")[1]);
		//console.log(x,y);
		if(this.maze[x][y].active === false && this.maze[x][y].bomb === true) {
			// console.log ("GAME OVER !!!");
			this.setGameOver("GAME OVER, YOU LOST", "red");
		}
		else this._activateField(x,y);
		this.checkGameWon();
	}

	//game over fuctionality
	Mines.prototype.setGameOver = function(message, color){
		removeClickEvent(document.getElementById("minesid"), listener);
		this.drawAllBombs();
		this.gameOverEl.innerHTML = message;
		this.gameOverEl.className = color;
	}


	//Check maze if all clean fields are found
	Mines.prototype.checkGameWon = function(){
		var i,j;
		for (i = 0; i < this.maze.length; i++) 
			for (j = 0; j < this.maze[i].length; j++) {
				if (!this.maze[i][j].active && !this.maze[i][j].bomb) return;  //if clean unclicked field still exists exit function
			}
		//if all clean fields are active the game is over and player won.
		this.setGameOver("YOU WON !!!", "green");
	}

	//recursive func to activate a field of "clean" boxes 
	Mines.prototype._activateField = function(x,y){
		x=Math.floor(x); y=Math.floor(y);
		// console.log("checking: " + x +" x " + y);
		if (this.maze[x][y].active === false && this.maze[x][y].bomb === false){		
				this.maze[x][y].active =true;
				if (this.maze[x][y].value > 0 )this.maze[x][y].template.innerHTML=this.maze[x][y].value;   //add value on innerHTML
				//this.maze[x][y].template.setAttribute("name",this.maze[x][y].value);
				this.maze[x][y].template.className = "box " + "v" + this.maze[x][y].value;
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
				if (this.maze[i][j].bomb) {
					//this.maze[i][j].template.setAttribute("name","bomb");
					this.maze[i][j].template.className = "box bomb";
				}
			}
	}



	//click event ie8 compatible
	clickEvent = function(el, func){
		if (el.addEventListener) {
			el.addEventListener("click",func,false);
		}
		else {
			el.attachEvent("onclick", func);
		}
	}

	removeClickEvent = function(el, listener){
		if (el.removeEventListener) {
			el.removeEventListener("click", listener, false);
		}
		else {
			el.detachEvent ("onclick", listener);
		}
	}



	//connecting the reset button
	clickEvent(document.getElementById("reset"),  function(e){
		if( e.preventDefault ) { e.preventDefault(); }
		e.returnValue = false;
		 	mine2.startNewGame(Math.floor(document.getElementById("sizeX").value),
		 					   Math.floor(document.getElementById("sizeY").value),
		 					   Math.floor(document.getElementById("maxBombs").value));
	})



	//click event function
	function listener(e){

		if( e.preventDefault ) { e.preventDefault(); }
		e.returnValue = false;

		var theTarget = e.target ? e.target : e.srcElement;
		if( theTarget && ( theTarget.nodeType == 3 || theTarget.nodeType == 4 ) ) {
	  			theTarget = theTarget.parentNode;
		}
		if (theTarget.id && theTarget.className==="box") mine2.setActiveBox(theTarget.id,e);
	};


	//starting game
	var mine2 = new Mines(mid);
	mine2.startNewGame(6,6,12);

	//start testing functions
	//testing(mine2,NewBox);

};


M("minesid");