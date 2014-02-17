var matrixLength=8;  //numerb of rows
var maxBombs=9; //number of mines(bombs)
var i,j,matrix=[], bombs=[];
var lineBox; //line of boxes

var block = document.getElementById("block");
block.style.width=44*matrixLength + "px";   //set block width
block.innerHTML="";  //clean block

//creating the matrix
for (i=0; i<matrixLength; i++){
		matrix[i]=[];
		for (j=0; j<matrixLength; j++) 
				matrix[i][j] = new box(i.toString()+j.toString());

}

//display the matrix
for ( i = 0; i < matrixLength; i++){
	lineBox = document.createElement("li");
	for ( j = 0; j < matrixLength; j++) 
		lineBox.appendChild(matrix[i][j].node);
	block.appendChild(lineBox);
}

//create box object
function box(idnum) {
	this.node = document.createElement("a");
	this.node.className="box";
	this.node.value="0";
	this.node.id=idnum;
	this.node.innerHTML=0;//this.node.id; //temp
}


//activate clicked element
block.onclick = function(){
	event.target.name="active";
	event.target.innerHTML="O";
	console.log("ClickedID:" +event.target.id);
	console.log("ClickedValue:" +event.target.value);
	displayNeighboursBomb(event.target.id);   //temp to display neighbours on click
	//neighboursBomb(event.target.id);
};

//checkNeighbours("55");

function neighboursBomb(id){
	if ((parseInt(id)<10)&&(parseInt(id)>=0)) id = "0" + id.toString();
	setNeighbourBomb(parseInt(id)-11);
	setNeighbourBomb(parseInt(id)-10);
	setNeighbourBomb(parseInt(id)-1);
	setNeighbourBomb(parseInt(id)+1);
	setNeighbourBomb(parseInt(id)+10);
	setNeighbourBomb(parseInt(id)+11);
	setNeighbourBomb(parseInt(id)+9);
	setNeighbourBomb(parseInt(id)-9);
	
	function setNeighbourBomb(idtemp){ 
		if ((parseInt(idtemp)<10)&&(parseInt(idtemp)>=0)) idtemp = "0" + idtemp.toString();
		if ((parseInt(idtemp.toString()[0])>=0)&&(parseInt(idtemp.toString()[0])<=(matrixLength-1)) && 
		(parseInt(idtemp.toString()[1])>=0)&&(parseInt(idtemp.toString()[1])<=(matrixLength-1))) {
				//alert(idtemp); 
				var elem = document.getElementById(idtemp);	
				if (elem.value!="bomb") elem.value = parseInt(elem.value) + 1;
				if (elem.value!="bomb") elem.innerHTML = parseInt(elem.innerHTML) + 1;
		}
	}
//console.log(elem.id +"=" +  elem.name + "!");
}





//temp to display neighbours on click
function displayNeighboursBomb(id){
	if ((parseInt(id)<10)&&(parseInt(id)>=0)) id = "0" + id.toString();
	setNeighbourBomb(parseInt(id)-11);
	setNeighbourBomb(parseInt(id)-10);
	setNeighbourBomb(parseInt(id)-1);
	setNeighbourBomb(parseInt(id)+1);
	setNeighbourBomb(parseInt(id)+10);
	setNeighbourBomb(parseInt(id)+11);
	setNeighbourBomb(parseInt(id)+9);
	setNeighbourBomb(parseInt(id)-9);
	
	function setNeighbourBomb(idtemp){ 
		if ((parseInt(idtemp)<10)&&(parseInt(idtemp)>=0)) idtemp = "0" + idtemp.toString();
		if ((parseInt(idtemp.toString()[0])>=0)&&(parseInt(idtemp.toString()[0])<=(matrixLength-1)) && 
		(parseInt(idtemp.toString()[1])>=0)&&(parseInt(idtemp.toString()[1])<=(matrixLength-1))) {
				//alert(idtemp); 
				var elem = document.getElementById(idtemp);	
				console.log("NeighbourID: " + elem.id + ";   value: " +elem.value);
				//if (elem.value!="bomb") elem.value = parseInt(elem.value) + 1;
				//if (elem.value!="bomb") elem.innerHTML = parseInt(elem.innerHTML) + 1;
		}
	}
//console.log(elem.id +"=" +  elem.name + "!");
}







//generatebombs
function generateBombs(){
	bombs[0]=randomID();							 //
	document.getElementById(bombs[0]).value="bomb";  //add 1 bomb to matrix
	document.getElementById(bombs[0]).innerHTML="*"; //
	
	for (i=1; i<maxBombs; i++){
			bombs[i]=randomID();
			for(temp=0; temp<i; temp++){							//check if already
				if (bombs[i]==bombs[temp]) {i--; break;}   //generated
			}
			document.getElementById(bombs[i]).value="bomb";  //add bomb to matrix
			document.getElementById(bombs[i]).innerHTML="*";		
	}
	
	for(i=0;i<maxBombs;i++) neighboursBomb(bombs[i]);
}


//generate an ID
function randomID(){
	return ((Math.floor(Math.random()*matrixLength)).toString() + 
			(Math.floor(Math.random()*matrixLength))).toString() ;
}

generateBombs();
for(i=0; i<maxBombs; i++) console.log(bombs[i]);
