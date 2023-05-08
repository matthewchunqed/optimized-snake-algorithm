/*jslint browser:true */
/*jshint esversion: 6 */

var speedUp = 2;

function drawTiles(width, height) {
    var boxes = [];
//var width = 0;
//var height = 0;
var head = 0;
var tail = -1;
var path = [];
var gridWidth = 800;
var gridHeight = 800;
var curAnimation = null;
var boxWidth = gridWidth/width - 2;
var boxHeight = gridHeight/height - 2;




    this.width = width;
    this.height = height;
    var grid = document.querySelector("#grid"), i, div;
    var entire = document.querySelector(".entire")

    grid.style.width = gridWidth + "px";
    grid.style.height = gridHeight + "px";
    entire.style.width = (gridWidth+150) + "px";
    entire.style.height = (gridHeight+150) + "px";
    //formats entire grid + gray background around it.

    //size of cells
    
    var s = "auto";
    for(i = 1; i < width; i = i + 1){
        s = s + " auto"
    }
    grid.style.gridTemplateColumns = s;
    //define grid format
    var temp = []
    for (i = 1; i <= width*height; i = i + 1) {
        //grid format already set
        div = document.createElement("div");
        div.style.display = "inline";
        div.setAttribute("style", "width:" + boxWidth + "px;height:" + boxHeight + "px;");
        div.style.border = "1px solid gray";
        //creates grid lines
        div.style.backgroundColor = "white";
        //adds colors
        div.addEventListener("mousedown", event => {
            //event.target.style.backgroundColor = "red";
          }, false);
        //mouse click to test color changing
        temp.push(div);
        if(i % width == 0){
            boxes.push(temp);
            temp = [];
        }

        grid.appendChild(div);
    }
    
    //now i'd like to reverse it so that (0,0) is at the bottom left.
    boxes = boxes.reverse();

    //sets up what the correct path is algorithmically.
    if(width % 2 == 0){
        //case 1: even length
        for(i=0; i < width; i++){
            path.push(boxes[0][i]);
        }
        for(i=width-1; i >= 0; i = i-1){
            if(i % 2 == 0){
                for(var j=height-1; j >= 1; j = j-1){
                    path.push(boxes[j][i]);
                }
            }else{
                for(var j=1; j < height; j++){
                    path.push(boxes[j][i]);
                }
            }
        }
    }else if(height % 2 == 0){
        //case 2: odd length but even height
        for(i=0; i < height; i++){
            path.push(boxes[i][0]);
       }
        for(i=height-1; i >= 0; i = i-1){
            if(i % 2 == 0){
                for(var j=width-1; j >= 1; j = j-1){
                    path.push(boxes[i][j]);
                }
            }else{
                for(var j=1; j < width; j++){
                    path.push(boxes[i][j]);
                }
            }
        }
    }else{

        for(i=0; i < width; i++){
            path.push(boxes[0][i]);
        }
        for(i=width-1; i >= 2; i = i-1){
            if(i % 2 == 0){
                for(var j=1; j < height; j++){
                    path.push(boxes[j][i]);
                }
            }else{
                for(var j=height-1; j >= 1; j = j-1){
                    path.push(boxes[j][i]);
                }
            }
        }
        for(i = height-1; i> 1; i = i-1){
            if(i % 2 == 0){
                path.push(boxes[i][1]);
                path.push(boxes[i][0]);
            }else{
                path.push(boxes[i][0]);
                path.push(boxes[i][1]);
            }
        }
        path.push(boxes[1][0]);

        for(i=0; i < width; i++){
            path.push(boxes[0][i]);
        }
        for(i=width-1; i >= 2; i = i-1){
            if(i % 2 == 0){
                for(var j=1; j < height; j++){
                    path.push(boxes[j][i]);
                }
            }else{
                for(var j=height-1; j >= 1; j = j-1){
                    path.push(boxes[j][i]);
                }
            }
        }
        for(i = height-1; i> 2; i = i-1){
            if(i % 2 == 0){
                path.push(boxes[i][1]);
                path.push(boxes[i][0]);
            }else{
                path.push(boxes[i][0]);
                path.push(boxes[i][1]);
            }
        }
        //path.push(boxes[3][0]);
        path.push(boxes[2][1]);
        path.push(boxes[1][1]);
        path.push(boxes[1][0]);
    }
    

    //create start button
    var button1 = document.getElementById("button1");
    //button1.innerHTML = "Reset";
    button1.addEventListener("mousedown", event => {
        isReset=true;
        head = 0;
        tail = -1;
        curAnimation = null;
        for(i = 0; i < height; i++){
            for(var j=0; j < width; j++){
                boxes[i][j].style.background="none";
                boxes[i][j].style.backgroundColor = "white";
            }
        }
        return;
    }, false);

    var pointer1=0;
    var pointer2=0;

    var button2 =document.getElementById("button2");
    //entire.appendChild(button);
    //button = document.createElement("button");
    //button2.innerHTML = "Step";
    button2.addEventListener("mousedown", event => {
        isReset=false;

        //edge case: check to see if game is completed, since we have strong insistence later to add white/red blocks:
        var isComplete = true;
        for(i = 0; i<height; i++){
            for(var j=0; j < width; j++){
                if(boxes[i][j].style.backgroundColor != "green"){
                    isComplete = false;
                }
            }
        }
        if(path[head].style.backgroundColor == "green"){
            isComplete = true;
        }
        if(isComplete){
            return;
        }

        //functionality for step button
        var isNotRed = true;
        if(path[((head+1) % path.length)].style.backgroundColor == "red"){
            isNotRed = false;
        }

        var activate = false;
        if(path[head].style.backgroundColor == "red"){
            activate = true;

            path[head].style.background="none";
            path[head].style.backgroundColor="white";
            
            if(path[(head+1)%path.length].style.backgroundColor == "green"){
                //the apple generation code insists that an apple be generated
                //edge case game end condition: check to see if game is over.
                path[head].style.backgroundColor = "green";
                return;
            }
        }

        
        if(tail >= 0){    //resets the color of the most recently visited squares
            path[tail].style.backgroundColor = "white";
            
            path[head].style.background="none"; //removes the background image
        }

        path[head].style.backgroundColor = "green";
        
        if(tail == -1 || activate){
            //add apples.
            var randWidth = Math.floor(Math.random() * width);
            var randHeight = Math.floor(Math.random() * height);
            
            while(boxes[randHeight][randWidth].style.backgroundColor == "green"){
                randWidth = Math.floor(Math.random() * width);
                randHeight = Math.floor(Math.random() * height);
            }
            pointer1=randHeight;
            pointer2=randWidth;
            boxes[randHeight][randWidth].style.backgroundImage = "url(Images/Apple.jpeg)";
            boxes[randHeight][randWidth].style.backgroundSize="100%";
            boxes[randHeight][randWidth].style.backgroundRepeat="no-repeat";
            boxes[randHeight][randWidth].style.backgroundColor="red";
            
        }

        head = head + 1;
        if(isNotRed){
            tail = tail + 1;
        }
        
        if(head >= path.length){
            head = 0;
        }
        if(tail >= path.length){
            tail = 0;
        }


      }, false);


        var button3=document.getElementById("button3");
    //entire.appendChild(button);
    //button = document.createElement("button");
    //button.innerHTML = "Animate";

    button3.addEventListener("mousedown", event => {
        isReset=false;

        
        //functionality for animate button
        var isComplete = false;
        if (curAnimation == null) {
            curAnimation = setInterval(() => {
                if(isReset==true){
                    isComplete=true;
                    return;
                }

        if(!isComplete){
        //edge case: check to see if game is completed, since we have strong insistence later to add white/red blocks:

        isComplete = true;
        for(i = 0; i<height; i++){
            for(var j=0; j < width; j++){
                if(boxes[i][j].style.backgroundColor != "green"){
                    isComplete = false;
                }
            }
        }
        if(path[head].style.backgroundColor == "green"){
            isComplete = true;
        }
        if(isComplete){
            return;
        }
                
                //functionality for step button
        var isNotRed = true;
        if(path[((head+1) % path.length)].style.backgroundColor == "red"){
            isNotRed = false;
        }

        var activate = false;
        if(path[head].style.backgroundColor == "red"){
            activate = true;

            path[head].style.background="none";
            path[head].style.backgroundColor="white";

            if(path[(head+1)%path.length].style.backgroundColor == "green"){
                //the apple generation code insists that an apple be generated
                //edge case game end condition: check to see if game is over.
                path[head].style.backgroundColor = "green";
                return;
            }
        }

        
        if(tail >= 0){
            path[tail].style.backgroundColor = "white";

            path[head].style.background="none";
        }
        path[head].style.backgroundColor = "green";
        
        if(tail == -1 || activate){
            //add apples.
            var randWidth = Math.floor(Math.random() * width);
            var randHeight = Math.floor(Math.random() * height);
            
            while(boxes[randHeight][randWidth].style.backgroundColor == "green"){
                randWidth = Math.floor(Math.random() * width);
                randHeight = Math.floor(Math.random() * height);
            }
            pointer1=randHeight;
            pointer2=randWidth;
            boxes[randHeight][randWidth].style.backgroundImage = "url(Images/Apple.jpeg)";
            boxes[randHeight][randWidth].style.backgroundSize="100%";
            boxes[randHeight][randWidth].style.backgroundRepeat="no-repeat";
            boxes[randHeight][randWidth].style.backgroundColor="red";
            boxes[randHeight][randWidth].style.backgroundColor="red";
            
        }

        head = head + 1;
        if(isNotRed){
            tail = tail + 1;
        }
        
        if(head >= path.length){
            head = 0;
        }
        if(tail >= path.length){
            tail = 0;
        }

    }

            }, 200/speedUp);
            //adds the delay.
        }

    }, false);

    //set new snake speed based on user input
    var button4 = document.getElementById("button4");
    button4.addEventListener("mousedown", event => {
     const textInput=document.getElementById("myName");
     var newSpeed=textInput.value;
     console.log(newSpeed);
     if(newSpeed<1){
         textInput.value="Invalid Input! Speed should be greater than 0"
     }
     speedUp=newSpeed;
    }, false);

    //retrieve desired array size in x direction based on user input
    var button5 = document.getElementById("button5");
    button5.addEventListener("mousedown", event => {
     const textInput1=document.getElementById("xCoord");
     const textInput2=document.getElementById("yCoord");
     var newX=textInput1.value;
     var newY=textInput2.value;
     while(grid.firstChild){
         grid.removeChild(grid.firstChild)
     }
     //grid.innerHTML="";
    draw(newX,newY);
        //location.reload();

    }, false);


    
}
    //entire.appendChild(button);


function draw(width,height){
    ch = new drawTiles(width,height); 
}

//implement color schemes gradient for older vs newer blocks (color blindness palettes)
//buttons for determining the speed of the snake + the size of the grid
//add detection of edge cases (width/heights of 0 or 1)
//reset stops the animation DONE
//adds apple visualization instead of red block DONE
//make head distinct
//greedy implementation? show that a greedy counterexample fails
//add lines to edges
