/*jslint browser:true */
/*jshint esversion: 6 */

//stores the speed of the snake
var speedUp = 2;

function drawTiles(width, height) {

    //defines relevant variables 
    var boxes = [];
    var path = [];

    //used to store position of snake head/tail in grid
    var head = 0;
    var tail = -1;

    //sets grid width and height, and width and height of boxes
    var gridWidth = 700;
    var gridHeight = 700;
    var boxWidth = gridWidth/width - 2;
    var boxHeight = gridHeight/height - 2;

    var curAnimation = null;
    //var snakelength=1;

    this.width = width;
    this.height = height;
    var grid = document.querySelector("#grid"), i, div;
    var entire = document.querySelector(".entire")

    //sets background image and formats it appropriately
    var body=document.querySelector("body");
    body.style.backgroundImage="url(Images/Space.jpeg";
    body.style.backgroundSize="100% 100%";
    body.style.backgroundRepeat="no-repeat";
    
    //sets width and height of the snake grid and of the div containing it
    grid.style.width = gridWidth + "px";
    grid.style.height = gridHeight + "px";
    entire.style.width = (gridWidth+200) + "px";
    entire.style.height = (gridHeight+420) + "px";
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

        //sets width and height of grid tiles
        div.setAttribute("style", "width:" + boxWidth + "px;height:" + boxHeight + "px;");
        div.style.border = "1px solid gray";  //creates grid lines
        div.style.backgroundColor = "white";  //sets grid background color
       
        //pushes div elements into temp[] array
        //once a row has been filled, pushes the array temp[] to the array of rows boxes[]
        temp.push(div);
        if(i % width == 0){
            boxes.push(temp);
            temp = [];
        }
        //appends the div element to the visualization
        grid.appendChild(div);
    }
    
    //reverse the order of the boxes array so that (0,0) is at the bottom left.
    boxes = boxes.reverse();

    //sets up what the correct path is algorithmically based on grid dimensions (number or tle per row/per column)
    if(width % 2 == 0){
        //case 1: even width and height
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
        //case 2: odd width but even height
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
        //case 3: odd width and odd height

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
        path.push(boxes[2][1]);
        path.push(boxes[1][1]);
        path.push(boxes[1][0]);
    }
    

    //adds functionality for reset button
    var button1 = document.getElementById("button1");
    button1.addEventListener("mousedown", event => {
        //resets the value of flags and head/tail positions
        isReset=true;
        head = 0;
        tail = -1;
        curAnimation = null;

        //resets the appearance of the game grid
        for(i = 0; i < height; i++){
            for(var j=0; j < width; j++){
                boxes[i][j].style.background="none";
                boxes[i][j].style.backgroundColor = "white";
            }
        }
        //clears the text input boxes
        const textInput0=document.getElementById("speed");
        const textInput1=document.getElementById("xCoord");
        const textInput2=document.getElementById("yCoord");
        textInput0.value="";
        textInput1.value="";
        textInput2.value="";
        return;
    }, false);

    //adds functionality for step button
    var button2 =document.getElementById("button2");
    button2.addEventListener("mousedown", event => {
        isReset=false;

        //edge case: check to see if game is completed, since we have strong insistence later to add white/red blocks:
        //if any tiles are not green, the snake still has room to grow and the game does not end
        var isComplete = true;
        for(i = 0; i<height; i++){
            for(var j=0; j < width; j++){
                if(boxes[i][j].style.backgroundColor != "green"){
                    isComplete = false;
                }
            }
        }
        //if the next tile in the path is the snake's tail, the snake self-intersects and the game ends
        if(path[head].style.backgroundColor == "green"){
            isComplete = true;
        }
        //completes the game
        if(isComplete){
            return;
        }

        //functionality for step button
        var isNotRed = true;
        if(path[((head+1) % path.length)].style.backgroundColor == "red"){
            isNotRed = false;
        }

        //if the snake head reaches an apple
        var activate = false;
        if(path[head].style.backgroundColor == "red"){
            activate = true;

            //removes the apple image
            path[head].style.background="none";
            path[head].style.backgroundColor="white";
            
            if(path[(head+1)%path.length].style.backgroundColor == "green"){
                //the apple generation code insists that an apple be generated
                //edge case game end condition: check to see if game is over.
                path[head].style.backgroundColor = "green";
                return;
            }
        }

        //resets the color of the most recently visited tile
        if(tail >= 0){    
            path[tail].style.backgroundColor = "white";
            
            //removes the background image after apple is eaten
            path[head].style.background="none"; 
        }

        //sets the head block to be green
        path[head].style.backgroundColor = "green";
        
        //if the game has just started or the snake reaches an apple
        if(tail == -1 || activate){

            //add apples at random tiles
            var randWidth = Math.floor(Math.random() * width);
            var randHeight = Math.floor(Math.random() * height);
            
            //ensures apples do not generate on the same tiles as the snake
            while(boxes[randHeight][randWidth].style.backgroundColor == "green"){
                randWidth = Math.floor(Math.random() * width);
                randHeight = Math.floor(Math.random() * height);
            }
            //adds an apple image to the randomly seected tiles and formats it appropriately
            //backgroundColor serves as a flag when accessing this tile in the future
            boxes[randHeight][randWidth].style.backgroundImage = "url(Images/Apple.jpeg)";
            boxes[randHeight][randWidth].style.backgroundSize="100% 100%";
            boxes[randHeight][randWidth].style.backgroundRepeat="no-repeat";
            boxes[randHeight][randWidth].style.backgroundColor="red";
            
        }

        //moves the head tile forwards
        head = head + 1;
        //updates the tail tile
        if(isNotRed){
            tail = tail + 1;
        }
        
        //resets coordinates of head once a cycle has been completed
        if(head >= path.length){
            head = 0;
        }
        //resets coordinates of tail once a cycle has been completed
        if(tail >= path.length){
            tail = 0;
        }

      }, false);


    //implements functionality for animate button
    var button3=document.getElementById("button3");
    button3.addEventListener("mousedown", event => {
        isReset=false;

        
        //creates an animation object and repeats the step action until either the 
        //game completes or the reset button is pressed
        var isComplete = false;
        if (curAnimation == null) {
            curAnimation = setInterval(() => {
                if(isReset==true){
                    isComplete=true;
                    return;
                }

        if(!isComplete){
        //edge case: check to see if game is completed, since we have strong insistence later to add white/red blocks:
        
                //edge case: check to see if game is completed, since we have strong insistence later to add white/red blocks:
        //if any tiles are not green, the snake still has room to grow and the game does not end
        isComplete = true;
        for(i = 0; i<height; i++){
            for(var j=0; j < width; j++){
                if(boxes[i][j].style.backgroundColor != "green"){
                    isComplete = false;
                }
            }
        }

        //if the next tile in the path is the snake's tail, the snake self-intersects and the game ends
        if(path[head].style.backgroundColor == "green"){
            isComplete = true;
        }
        //completes the game
        if(isComplete){
            return;
        }
                
        //functionality for step button
        var isNotRed = true;
        if(path[((head+1) % path.length)].style.backgroundColor == "red"){
            isNotRed = false;
        }

        //if the snake head reaches an apple
        var activate = false;
        if(path[head].style.backgroundColor == "red"){
            activate = true;

            //removes the apple image
            path[head].style.background="none";
            path[head].style.backgroundColor="white";

            if(path[(head+1)%path.length].style.backgroundColor == "green"){
                //the apple generation code insists that an apple be generated
                //edge case game end condition: check to see if game is over.
                path[head].style.backgroundColor = "green";
                return;
            }
        }

        //resets the color of the most recently visited tile
        if(tail >= 0){
            path[tail].style.backgroundColor = "white";

            //removes the background image after apple is eaten
            path[head].style.background="none";
        }
        //sets the head block to be green
        path[head].style.backgroundColor = "green";
        
        //if the game has just started or the snake reaches an apple
        if(tail == -1 || activate){
            //add apples.
            var randWidth = Math.floor(Math.random() * width);
            var randHeight = Math.floor(Math.random() * height);
            
            //ensures apples do not generate on the same tiles as the snake
            while(boxes[randHeight][randWidth].style.backgroundColor == "green"){
                randWidth = Math.floor(Math.random() * width);
                randHeight = Math.floor(Math.random() * height);
            }
            //adds an apple image to the randomly seected tiles and formats it appropriately
            //backgroundColor serves as a flag when accessing this tile in the future
            boxes[randHeight][randWidth].style.backgroundImage = "url(Images/Apple.jpeg)";
            boxes[randHeight][randWidth].style.backgroundSize="100% 100%";
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

    }
            }, 200/speedUp);
            //adds the delay, which is dependent on the user input speedUp factor.
        }
    }, false);

    //set new snake speed based on user input
    var button4 = document.getElementById("button4");
    button4.addEventListener("mousedown", event => {

     //retrieves text input element and stores user input
     const textInput=document.getElementById("speed");
     var newSpeed=textInput.value;
    
     //checks edge case and displays error message if input is outside of desired rage
     if(newSpeed<1){
         textInput.value="Invalid Input! Speed should be greater than 0";
         return;
     }
     speedUp=newSpeed;  //updates the speedUp factor of the program
    }, false);

    //retrieve new grid dimensions based on user input
    var button5 = document.getElementById("button5");
    button5.addEventListener("mousedown", event => {
    
    //retrieves text input elements and stores user input
     const textInput1=document.getElementById("xCoord");
     const textInput2=document.getElementById("yCoord");
     var newX=textInput1.value;
     var newY=textInput2.value;

     //checks edge case and displays error message if input is outside of desired range
     if(newX<2){
         textInput1.value="Invalid Input! Size should be greater than 1";
     }
     if(newY<2){
         textInput2.value="Invalid Input! Size should be greater than 1";;
     }

     //if new grid dimensions are valid, removes previously inserted divs from the grid
     //and calls draw again to fill in a new grid
     if(newX>=2 && newY>=2){
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        draw(newX,newY);
     }

    }, false);
    
}


function draw(width,height){
    ch = new drawTiles(width,height); 
}

//implement color schemes gradient for older vs newer blocks (color blindness palettes)
//make head distinct
//fix edge case when apple generates next to initial position
//buttons for determining the speed of the snake + the size of the grid DONE
//add detection of edge cases (width/heights of 0 or 1) DONE
//reset stops the animation DONE
//adds apple visualization instead of red block DONE
//greedy implementation? show that a greedy counterexample fails
//add lines to edges

//push Quality/exposition/design//functionality