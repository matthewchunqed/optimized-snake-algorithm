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
    var noModHead=0;
    var noModHead=-1;

    //sets grid width and height, and width and height of boxes
    var gridWidth = 700;
    var gridHeight = 700;
    var boxWidth = gridWidth/width - 2;
    var boxHeight = gridHeight/height - 2;

    var curAnimation = null;
    var snakelength=0;

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
        //case 1: even width and height (refer to documentation for associated path)
        //creates the specified path by pushing divs into the path array
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
        //case 2: odd width but even height (refer to documentation for associated path)
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
        //case 3: odd width and odd height (refer to documentation for associated path)

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
    
    this.reset = function() {

        //resets the value of flags and head/tail positions
        isReset=true;
        head = 0;
        tail = -1;
        snakelength=0;
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
    }

    //adds functionality for step button
    this.step = function(){
        //sets the isReset flag to false
        isReset=false;

        //edge case: check to see if game is completed, since we have strong insistence later to add white/red blocks:
        //if any tiles are red(apples) or white(unnocupied), then the snake still has room to grow and the game does not end
        var isComplete = true;
        for(i = 0; i<height; i++){
            for(var j=0; j < width; j++){
                if(boxes[i][j].style.backgroundColor == "white" || boxes[i][j].style.backgroundColor != "red"){
                    isComplete=false;
                    break;
                }
            }
            if(isComplete==false){
                break;
            }
        }
        //if the next tile in the path is the snake's tail, the snake self-intersects and the game ends
        if(path[head].style.backgroundColor != "white" && path[head].style.backgroundColor != "red"){
            isComplete = true;
        }
        //ends the game
        if(isComplete){
            return;
        }


        //if the snake head reaches an apple
        var activate = false;
        if(path[head].style.backgroundColor == "red"){
            activate = true;

            //removes the apple image
            path[head].style.background="none";
            path[head].style.backgroundColor="white";
            
            //the apple generation code insists that an apple be generated
            //edge case game end condition: check to see if game is over.
            //if the next tile is neither an apple not whitespace, the snake has intersected itself.
            var nextColor=path[(head+1)%path.length].style.backgroundColor;
            if(nextColor!="red" && nextColor!="white"){

                var h=head;
                var a=0;
                var offset=1;   //offset between the head and tail

                //case 1: head>tail (normal case)
                if(head>tail){
                    offset=head-tail;   //calculates the snake length
                    }
                //case 2: tail>head
                //the head and tail are set to 0 when they cross the origin, so it is possible for tail>head if the head has crossed the origin (lower-left tile) but the tail has not
                else{
                    offset=(path.length)-tail+head; //calculates the snake length
                }

                //this section ensures snake coloring stays consistent for the final movement
                //moves from the head to the tail, setting each tile of the snake to be an incrementally lighter shade of green
                //this addresses the issue of the snake's movement seeming to disappear as it fills the grid (when it is a single color, the impression of movement disappears)
                while(a<offset){
                    //if the h "pointer" crosses back across the starting tile, correct to ensure positive path index
                    if(h<0){
                        h+=path.length;
                    }
                    //set snake green shade to vary based on length and position of each tile in the snake body
                    var changeFactor=150/(path.length);
                    path[h].style.backgroundColor="rgb(0,"+(100+changeFactor*a)+",0)";
                    h-=1;   //move down the snake
                    a++;   //tracks the progress of the pointer h: when a==offset, the pointer has reached the tail and the loop terminates
                }
                //sets color of snake head to black
                path[head].style.backgroundColor="black";

                //ends the game since no new apples can be generated
                return;
            }
        }

        //resets the color of the most recently visited tile
        if(tail >= 0){    
            path[tail].style.backgroundColor = "white";
            
            //removes the background image after apple is eaten
            path[head].style.background="none"; 
        }

        //sets the head block to be black
        path[head].style.backgroundColor = "black";
        
        //if the game has just started or the snake reaches an apple
        if(tail == -1 || activate){

            //add apples at random tiles
            var randWidth = Math.floor(Math.random() * width);
            var randHeight = Math.floor(Math.random() * height);
            
            //ensures apples do not generate on the same tiles as the snake
            while(boxes[randHeight][randWidth].style.backgroundColor != "white"){
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

        var h=head;
        var a=0;
        var offset=1;   //offset between the head and tail

        //case 1: head>tail (normal case)
        if(head>tail){
            offset=head-tail;   //calculates the snake length
            }
        //case 2: tail>head
        //the head and tail are set to 0 when they cross the origin, so it is possible for tail>head if the head has crossed the origin (lower-left tile) but the tail has not
        else{
            offset=(path.length)-tail+head; //calculates the snake length
        }

        //this section ensures snake coloring stays consistent for the final movement
        //moves from the head to the tail, setting each tile of the snake to be an incrementally lighter shade of green
        //this addresses the issue of the snake's movement seeming to disappear as it fills the grid (when it is a single color, the impression of movement disappears)
        while(a<offset){
            //if the h "pointer" crosses back across the starting tile, correct to ensure positive path index
            if(h<0){
                h+=path.length;
            }
            //set snake green shade to vary based on length and position of each tile in the snake body
            var changeFactor=150/(path.length);
            path[h].style.backgroundColor="rgb(0,"+(100+changeFactor*a)+",0)";
            h-=1;   //move down the snake
            a++;   //tracks the progress of the pointer h: when a==offset, the pointer has reached the tail and the loop terminates
        }
        //sets color of snake head to black
        path[head].style.backgroundColor="black";

        //functionality for step button: checks whether the next grid tile contains an apple
        var isNotRed = true;
        if(path[((head+1) % path.length)].style.backgroundColor == "red"){
            isNotRed = false;
            }

        //updates the tail tile and decrements snakelength
        if(isNotRed){
            tail = tail + 1;
            snakelength-=1;
        }
        //increments snakelength: when isNotRed==false and the peviosu conditional does not execute, this increases the total snake length by 1
        snakelength+=1;
        
        //moves the head tile forwards
        head = head + 1;

        //handles edge case (second tile contains an apple)
        if(head==2 && snakelength==2 && !isNotRed){
            boxes[0][0].style.backgroundColor="green";
            tail-=1;
        }
        
        //resets coordinates of head once a cycle has been completed
        if(head >= path.length){
            head = 0;
        }
        //resets coordinates of tail once a cycle has been completed
        if(tail >= path.length){
            tail = 0;
        }
    }

        //implements functionality for animate button

    this.animate = function() {
        //sets the status of the isReset flag
        //calling reset after the animate function has been called changes the flag value and interrupts the execution
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

        //as long as the game has not completed/ repeatedly runs the step() code
        //the code contained in this loop is the same as previously defined in step()
        if(!isComplete){
        
        //edge case: check to see if game is completed, since we have strong insistence later to add white/red blocks:
        //if any tiles are red(apples) or white(unnocupied), then the snake still has room to grow and the game does not end
        isComplete = true;
        for(i = 0; i<height; i++){
            for(var j=0; j < width; j++){
                if(boxes[i][j].style.backgroundColor == "white" || boxes[i][j].style.backgroundColor != "red"){
                    isComplete=false;
                    break;
                }
            }
            if(isComplete==false){
                break;
            }
        }

        //if the next tile in the path is the snake's tail, the snake self-intersects and the game ends
        if(path[head].style.backgroundColor != "white" && path[head].style.backgroundColor != "red"){
            isComplete = true;
        }
        //ends the game
        if(isComplete){
            return;
        }


        //if the snake head reaches an apple
        var activate = false;
        if(path[head].style.backgroundColor == "red"){
            activate = true;

            //removes the apple image
            path[head].style.background="none";
            path[head].style.backgroundColor="white";
            
            //the apple generation code insists that an apple be generated
            //edge case game end condition: check to see if game is over.
            //if the next tile is neither an apple not whitespace, the snake has intersected itself.
            var nextColor=path[(head+1)%path.length].style.backgroundColor;
            if(nextColor!="red" && nextColor!="white"){

                var h=head;
                var a=0;
                var offset=1;   //offset between the head and tail

                //case 1: head>tail (normal case)
                if(head>tail){
                    offset=head-tail;   //calculates the snake length
                    }
                //case 2: tail>head
                //the head and tail are set to 0 when they cross the origin, so it is possible for tail>head if the head has crossed the origin (lower-left tile) but the tail has not
                else{
                    offset=(path.length)-tail+head; //calculates the snake length
                }

                //this section ensures snake coloring stays /istent for the final movement
                //moves from the head to the tail, setting each tile of the snake to be an incrementally lighter shade of green
                //this addresses the issue of the snake's movement seeming to disappear as it fills the grid (when it is a single color, the impression of movement disappears)
                while(a<offset){
                    //if the h "pointer" crosses back across the starting tile, correct to ensure positive path index
                    if(h<0){
                        h+=path.length;
                    }
                    //set snake green shade to vary based on length and position of each tile in the snake body
                    var changeFactor=150/(path.length);
                    path[h].style.backgroundColor="rgb(0,"+(100+changeFactor*a)+",0)";
                    h-=1;   //move down the snake
                    a++;   //tracks the progress of the pointer h: when a==offset, the pointer has reached the tail and the loop terminates
                }
                //sets color of snake head to black
                path[head].style.backgroundColor="black";
                
                //ends the game since no new apples can be generated
                return;
            }
        }

        //resets the color of the most recently visited tile
        if(tail >= 0){    
            path[tail].style.backgroundColor = "white";
            
            //removes the background image after apple is eaten
            path[head].style.background="none"; 
        }

        //sets the head block to be black
        path[head].style.backgroundColor = "black";
        
        //if the game has just started or the snake reaches an apple
        if(tail == -1 || activate){

            //add apples at random tiles
            var randWidth = Math.floor(Math.random() * width);
            var randHeight = Math.floor(Math.random() * height);
            
            //ensures apples do not generate on the same tiles as the snake
            while(boxes[randHeight][randWidth].style.backgroundColor != "white"){
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

        var h=head;
        var a=0;
        var offset=1;   //offset between the head and tail

        //case 1: head>tail (normal case)
        if(head>tail){
            offset=head-tail;   //calculates the snake length
            }
        //case 2: tail>head
        //the head and tail are set to 0 when they cross the origin, so it is possible for tail>head if the head has crossed the origin (lower-left tile) but the tail has not
        else{
            offset=(path.length)-tail+head; //calculates the snake length
        }

        //this section ensures snake coloring stays consistent for the final movement
        //moves from the head to the tail, setting each tile of the snake to be an incrementally lighter shade of green
        //this addresses the issue of the snake's movement seeming to disappear as it fills the grid (when it is a single color, the impression of movement disappears)
        while(a<offset){
            //if the h "pointer" crosses back across the starting tile, correct to ensure positive path index
            if(h<0){
                h+=path.length;
            }
            //set snake green shade to vary based on length and position of each tile in the snake body
            var changeFactor=150/(path.length);
            path[h].style.backgroundColor="rgb(0,"+(100+changeFactor*a)+",0)";
            h-=1;   //move down the snake
            a++;   //tracks the progress of the pointer h: when a==offset, the pointer has reached the tail and the loop terminates
        }
        //sets color of snake head to black
        path[head].style.backgroundColor="black";

        //functionality for step button: checks whether the next grid tile contains an apple
        var isNotRed = true;
        if(path[((head+1) % path.length)].style.backgroundColor == "red"){
            isNotRed = false;
            }

        //updates the tail tile and decrements snakelength
        if(isNotRed){
            tail = tail + 1;
            snakelength-=1;
        }
        //increments snakelength: when isNotRed==false and the peviosu conditional does not execute, this increases the total snake length by 1
        snakelength+=1;
        
        //moves the head tile forwards
        head = head + 1;

        //handles edge case (second tile contains an apple)
        if(head==2 && snakelength==2 && !isNotRed){
            boxes[0][0].style.backgroundColor="green";
            tail-=1;
        }
        
        //resets coordinates of head once a cycle has been completed
        if(head >= path.length){
            head = 0;
        }
        //resets coordinates of tail once a cycle has been completed
        if(tail >= path.length){
            tail = 0;
        }

    }
            }, 200/speedUp);
            //adds the delay, which is dependent on the user input speedUp factor.
        }
    }


    //set new snake speed based on user input
    this.speedChange = function() {

    var animateAfter = false;
    if(curAnimation != null){
        animateAfter = true;
    }

    //resets current animation first:
    isReset=true;
    head = 0;
    tail = -1;
    snakelength=0;
    curAnimation = null;

    //resets the appearance of the game grid
    for(i = 0; i < height; i++){
        for(var j=0; j < width; j++){
            boxes[i][j].style.background="none";
            boxes[i][j].style.backgroundColor = "white";
        }
    }
    //clears the text input boxes
    const textInput1=document.getElementById("xCoord");
    const textInput2=document.getElementById("yCoord");
    textInput1.value="";
    textInput2.value="";

     //retrieves text input element and stores user input
     const textInput=document.getElementById("speed");
     var newSpeed=textInput.value;
    
     //checks whether input is a numbr
     if(isNaN(newSpeed)==false){
        //checks edge case and displays error message if input is outside of desired rage
        if(newSpeed<1){
            textInput.value="Invalid Input! Speed should be greater than 0";
            return;
        }
        speedUp=newSpeed;  //updates the speedUp factor of the program
        if(animateAfter){
            this.animate();
        }

        }
        //if input is not a number, show an error message
    else{
        textInput.value="Invalid Input! This is not a number";
        }
        textInput.value="";

    }


    //retrieve new grid dimensions based on user input
    this.gridChange = function() {

    //retrieves text input elements and stores user input
     const textInput1=document.getElementById("xCoord");
     const textInput2=document.getElementById("yCoord");
     var newX=textInput1.value;
     var newY=textInput2.value;
    
     //checks whether inputs are numbers or not
     if(isNaN(newX)==false&&isNaN(newY)==false){

        //checks edge case and displays error message if input is a number but is outside of desired range
        if(newX<2){
            textInput1.value="Invalid Input! Size should be greater than 1";
        }
        if(newY<2){
            textInput2.value="Invalid Input! Size should be greater than 1";
        }

        //if new grid dimensions are valid, removes previously inserted divs from the grid
        //and calls draw again to fill in a new grid
        if(newX>=2 && newY>=2){
            while(grid.firstChild){
                grid.removeChild(grid.firstChild)
            }
            draw(newX,newY);
            }
        }
    //if input is not a number, displays error message
    else{
        if(isNaN(newX)==true){
            textInput1.value="Invalid Input! This is not a number";
            }
        if(isNaN(newY)==true){
            textInput2.value="Invalid Input! This is not a number";
            }
        }
    }

}

//calls the drawTiles method which creates certain page elements and manages interactive and algorithmic components
function draw(width,height){
    ch = new drawTiles(width,height); 
}

