/*jslint browser:true */
/*jshint esversion: 6 */
var boxes = []
var head = null;
var width = 0;
var height = 0;
var step = 0;
var path = [];

function drawTiles(width, height) {
    this.width = width;
    this.height = height;
    var grid = document.querySelector("#grid"), i, div;
    var entire = document.querySelector(".entire")

    var gridWidth = 500;
    var gridHeight = 500;

    grid.style.width = gridWidth + "px";
    grid.style.height = gridHeight + "px";
    entire.style.width = (gridWidth+100) + "px";
    entire.style.height = (gridHeight+100) + "px";
    //formats entire grid + gray background around it.

    var boxWidth = gridWidth/width - 2;
    var boxHeight = gridHeight/height - 2;
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

}

function start() {

}

function getPath(){

        for(var i=0; i < width; i++){
            path.push(boxes[0][i]);
        }
        for(var i=width-1; i >= 0; i = i-1){
            if(i % 2 == 0){
                for(var j=width-1; j >= 0; j = j-1){
                    path.push(boxes[j][i]);
                }
            }else{
                for(var j=0; j < width; j++){
                    path.push(boxes[j][i]);
                }
            }
        }

}

function step() {
    if(getPath == []){
        getPath();
    }
    path[0].style.backgroundColor = "green";
    step = step + 1;
}

function animate() {

}