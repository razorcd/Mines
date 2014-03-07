//box.value = 'bomb' if bomb, '0' if empty, '1' if neighbour of bomb
//box.name  - 'dark' if not activated; if activated: '0' if clean, '1' if bomb neighbour, 'bomb' if bomb 
//box.checked - shows if the box has it's neighbours checked

var matrixLength=12;  			//numerb of rows
var maxBombs=16; 				//number of mines(bombs)
var i,j,matrix=[], bombs=[];    //bombs[] has the ID-s ofbombs
var lineBox; 					//line of boxes
var recursiveSteps=1;			//number of recursive steps to show empty field
var gameOn=true;   				//=true if game is in progress

var block = document.getElementById("block");
block.style.width=44*matrixLength + "px";   //set block width
block.innerHTML="";  //clean block

//creating the matrix
function createMatrix(){
	for (i=0; i<matrixLength; i++){
			matrix[i]=[];
			for (j=0; j<matrixLength; j++){ 
				var horizontal = i;
				if (horizontal<10) horizontal= "0" + horizontal;
				var vertical = j;
				if (vertical<10) vertical= "0" + vertical;
			
				matrix[i][j] = new box(horizontal+ ":" +vertical);
			}
	
	}
}

//create box object
function box(idnum) {
	this.node = document.createElement("a");
	this.node.className="box";
	this.node.value="0";
	this.node.name="dark";
	this.node.id=idnum;
	this.node.checked="0";
	this.node.innerHTML = "&nbsp";//this.node.id;//this.node.id; //temp
}

//display the matrix
function displayMatrix() {
    block.innerHTML = "";
	for ( i = 0; i < matrixLength; i++){
		lineBox = document.createElement("li");
		for ( j = 0; j < matrixLength; j++) 
			lineBox.appendChild(matrix[i][j].node);
		block.appendChild(lineBox);
	}
}

//check if game finished
function checkGame(){
	gameOn = false;
	for (var i = 0; i < matrixLength; i++){					//loop trough
		for (var j = 0; j < matrixLength; j++){				//matrix
			var h = i; var v = j;						//
			if (h<10) h = "0" + h.toString();			//set to 03:07
			if (v<10) v = "0" + v.toString();			//instead of 3:7
				var idtemp = h + ":" + v;				//
				var elem = document.getElementById(idtemp);
			
			if ((elem.checked=="1")&&(elem.value=="bomb")) {   //if boob was clicked stop game
				gameOn=false;
				return;
			}

			if ((elem.checked=="0")&&(elem.value!="bomb")) gameOn=true;  //if all clean boxes were clicked stop game
		}
	}
	if (gameOn == false) {
	    showAllBombs();
	    alert("You WON!");
	}
}

//activate clicked element
block.onclick = function(event){
	if (gameOn){ 
		if (event.target.name=="dark"){
			displayId(event.target);				//display it
			checkClickedBox(event.target.id);		//check it's neighbours
			//console.log("-------------------");
			//console.log("ClickedID:" + event.target.id);
			//console.log("ClickedValue:" + event.target.value);
			//console.log("ClickedName:" + event.target.name);
			//console.log("ClickedCecked:" + event.target.checked);
			//console.log("-------------------");
		}
		checkGame();  //check game for more clean boxes
	}
};

//displays one box
function displayId(box){
	var t = /[1-9]/;						//this means it is not 0 or bomb
	if (t.test(box.value)) {
	    if (box.value < 5) {
	        box.name = box.value;	//if not bomb or 0 then =1
	    }
	    else box.name = 5;
	    box.innerHTML = box.value;
	}
	else box.name = box.value;			//=0 or bomb
	//box.innerHTML="O";
}

//checks the clicked box
function checkClickedBox(id){
	recursiveSteps=1;
	var elem = document.getElementById(id);

	if (elem.value=="0"){ 
		//console.log("starting field");
		showEmptyField(elem.id);         //case box is clean ('0') - starting to show empty field
	}	
	elem.checked="1"; 								//set as checked
	if (elem.value == "bomb") {
	    showAllBombs();
	    //alert("BOOOOM!!!");
	}
}


function showAllBombs() {
    for (i = 0; i < maxBombs; i++) displayId(document.getElementById(bombs[i]));
}

//shows the empty field starting with one node
function showEmptyField(id){
	var temp = id.split(":");
	//console.log(temp[0]+":"+temp[1]);
	
	showNeighbourBomb( parseInt(temp[0])-1, parseInt(temp[1])-1 );
	showNeighbourBomb( parseInt(temp[0])-1, parseInt(temp[1]) );
	showNeighbourBomb( parseInt(temp[0])-1, parseInt(temp[1])+1 );
	showNeighbourBomb( parseInt(temp[0]),   parseInt(temp[1])-1 );
	showNeighbourBomb( parseInt(temp[0]),   parseInt(temp[1])+1 );
	showNeighbourBomb( parseInt(temp[0])+1, parseInt(temp[1])-1 );
	showNeighbourBomb( parseInt(temp[0])+1, parseInt(temp[1]));
	showNeighbourBomb( parseInt(temp[0])+1, parseInt(temp[1])+1 );
	
	function showNeighbourBomb(h,v){ 
		if ((h>=0)&&(v>=0)&&(h<=matrixLength-1)&&(v<=matrixLength-1)){ 
				if (h<10) h = "0" + h.toString();
				if (v<10) v = "0" + v.toString();
				var idtemp = h + ":" + v;
				var elem = document.getElementById(idtemp);
					
				if ((elem.checked=="0")){							//checking if the box was already checked				
					if (elem.value!="bomb") displayId(elem);        //display this neighbour box if not a bomb
					elem.checked="1"; 								//set as checked
					//console.log("FieldBox: " + idtemp + "  width value:" + elem.value);
					
					
					if (elem.value=="0") {			//if it's an empty field here we'll start next recursive neighbours of the current box
						if (recursiveSteps<10000) { //recursive steps safety check
							recursiveSteps++;
							//console.log("Starting recursive of " + elem.id);
							//console.log(" *** Recursive steps =" + recursiveSteps);
							showEmptyField(elem.id);
						}
					}
				}
				 
		}	
	}
}


//set neighbours values to +1 to indicate there is a bomb closeby
function setNeighbours(id){
	var temp = id.split(":");
//	console.log(temp[0]+":"+temp[1]);
	
	setNeighbourBomb( parseInt(temp[0])-1, parseInt(temp[1])-1 );
	setNeighbourBomb( parseInt(temp[0])-1, parseInt(temp[1]) );
	setNeighbourBomb( parseInt(temp[0])-1, parseInt(temp[1])+1 );
	setNeighbourBomb( parseInt(temp[0]), parseInt(temp[1])-1 );
	setNeighbourBomb( parseInt(temp[0]), parseInt(temp[1])+1 );
	setNeighbourBomb( parseInt(temp[0])+1, parseInt(temp[1])-1 );
	setNeighbourBomb( parseInt(temp[0])+1, parseInt(temp[1]));
	setNeighbourBomb( parseInt(temp[0])+1, parseInt(temp[1])+1 );
	
	function setNeighbourBomb(h,v){ 
		if ((h>=0)&&(v>=0)&&(h<=matrixLength-1)&&(v<=matrixLength-1)){ 
				if (h<10) h = "0" + h.toString();
				if (v<10) v = "0" + v.toString();
				var idtemp = h + ":" + v;
				//console.log("Neighbour: " + idtemp);
				var elem = document.getElementById(idtemp);	
				if (elem.value!="bomb") elem.value = parseInt(elem.value) + 1;
				//if (elem.value!="bomb") elem.innerHTML = elem.value;
//				console.log("Neighbour: " + idtemp + "  width value:" + elem.value);
		}	
	}
}


//generate bombs
function generateBombs(){
	i=0;
	var alreadyExists=false;
	
	while (i<maxBombs){
		alreadyExists=false;
		bombs[i]=randomID();
		
		if (i>0){																		 //if not first bomb 
			for(var temp=0; temp<i; temp++){											 //check if already
				if (bombs[i]===bombs[temp]) {											 //generated
					alreadyExists = true; 												 //
//					console.log("    Already exists:" + bombs[i] + " Regenerating...");	 //
				}	   																	 //
			}																			 //
		}																				 //
			
		if (!alreadyExists){																			//add the new bomb	
			document.getElementById(bombs[i]).value="bomb";												//to the matrix
			//document.getElementById(bombs[i]).innerHTML="*"; 											//
//			console.log("Generated Bomb nr." + i + " at ID: " + document.getElementById(bombs[i]).id);  //
			i++;																						//
		}																								//
	}
	for(i=0; i<maxBombs; i++) setNeighbours(bombs[i]);        //generating neighbours to indicate there is a bomb nearby
}


//generate a random ID
function randomID(){
	var tempVal1 = Math.floor(Math.random()*matrixLength).toString();
	var tempVal2 = Math.floor(Math.random()*matrixLength).toString();
	if(tempVal1<10) tempVal1 = "0" + tempVal1;
	if(tempVal2<10) tempVal2 = "0" + tempVal2;
	return (tempVal1+":"+tempVal2);
}

//regenerate a new clean matrix when resset is pressed

document.getElementById("reset").onclick = function(e) {
    matrixLength = document.getElementById("size").value;
    maxBombs = document.getElementById("maxBombs").value;
    createMatrix();
    displayMatrix();
    generateBombs();
    gameOn = true;
    //document.getElementById("block").style.width = 44 * matrixLength;
}

//size can't be more then 16
document.getElementById("size").onchange = function (e) {
    if ((document.getElementById("size").value > 16) ||
        (document.getElementById("size").value < 3) ||
        (isNaN(document.getElementById("size").value)))
    {
        document.getElementById("size").value = matrixLength;
        //document.getElementById("maxBombs").onchange.apply();
    }
    //document.getElementById("maxBombs").onchange.apply(document.getElementById("maxBombs"));
    if (document.getElementById("maxBombs").value > Math.pow(document.getElementById("size").value, 2))
        document.getElementById("maxBombs").value = Math.pow(document.getElementById("size").value, 2)-1;
}

//mines input can't be more then matrix boxes
var evnt = document.getElementById("maxBombs").onchange = function(e) {
    if ((document.getElementById("maxBombs").value > Math.pow(document.getElementById("size").value, 2)) ||
        (document.getElementById("maxBombs").value < 1) ||
        (isNaN(document.getElementById("maxBombs").value)))
        document.getElementById("maxBombs").value = maxBombs;
}

createMatrix();
displayMatrix();
generateBombs();