/*jslint browser:true */
/*jshint esversion: 6 */
var boxes = [];
var head = null;
var width = 0;
var height = 0;
var head = 0;
var tail = -1;
var path = [];
var resetPoint = 0;
var buttons = null;
var gridWidth = 500;
var gridHeight = 500;
var boxWidth = gridWidth/width - 2;
var boxHeight = gridHeight/height - 2;

function drawTiles(width, height) {
    this.width = width;
    this.height = height;
    var grid = document.querySelector("#grid"), i, div;
    var entire = document.querySelector(".entire")

    grid.style.width = gridWidth + "px";
    grid.style.height = gridHeight + "px";
    entire.style.width = (gridWidth+100) + "px";
    entire.style.height = (gridHeight+100) + "px";
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
            event.target.style.backgroundColor = "red";
          }, false);
        //mouse click to test color changing
        temp.push(div);
        if(i % width == 0){
            boxes.push(temp);
            temp = [];
        }

        //now i'd like to reverse it so that (0,0) is at the bottom left.
        boxes = boxes.reverse();

        grid.appendChild(div);
    }

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
        for(var p=0; p < height; p++){
            // path.push(boxes[p][0]);
            path.push(boxes[0][0]);
            path.push(boxes[0][1]);
            path.push(boxes[0][2]);
            path.push(boxes[0][3]);
        }
        // for(i=height-1; i >= 0; i = i-1){
        //     if(i % 2 == 0){
        //         for(var j=width-1; j >= 1; j = j-1){
        //             path.push(boxes[i][j]);
        //             console.log(i + " " + j);
        //         }
        //     }else{
        //         for(var j=1; j < width; j++){
        //             path.push(boxes[i][j]);
        //             console.log(i + " " + j);
        //         }
        //     }
        // }
    }
    

    //create start button
    var button = document.createElement("button");
    button.innerHTML = "Start";
    button.addEventListener("mousedown", event => {
        //functionality for start button


    }, false);
    entire.appendChild(button);
    button = document.createElement("button");
    button.innerHTML = "Step";
    button.addEventListener("mousedown", event => {
        //functionality for start button

        path[head].style.backgroundColor = "green";
        if(tail >= 0){
            path[tail].style.backgroundColor = "white";
        }
        head = head + 1;
        tail = tail + 1;
        if(head >= path.length){
            head = 0;
        }
        if(tail >= path.length){
            tail = 0;
        }


      }, false);


    entire.appendChild(button);
    button = document.createElement("button");
    button.innerHTML = "Animate";
    button.addEventListener("mousedown", event => {
        //functionality for start button

    }, false);
    entire.appendChild(button);
}