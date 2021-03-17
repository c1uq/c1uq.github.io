//-------------------------------------init var
var matrix = [];
var frame;
var screen;
var settings = {
    mouseScrollingEnabled: true,
    debuggerEnabled: true
};
var data = {
    
};

var sketchProc = function(processingInstance) { with (processingInstance) {
    //=================================================================================
    //----------------------------init-------------------------------------------------
    //=================================================================================
    size(401, 401);
    
    //----------------------------------------------pjs mouse functions
    let mouseInCanvas = true;
    mouseOver = function () {
        mouseInCanvas = true;
    };
    mouseOut = function () {
        mouseInCanvas = false;
    }
    //----------------------------------------------scroll
    screen = {
        x: 1600,
        y: 1600,
        zoom: 1
    };
    
    //----------------------------------------------class
    let blockTypes = ["Empty Square", "Wall"];
    //0: empty, 1: dirt, 2: wall
    let floorTypes = ["Dirt", "Concrete"];
    //0: empty, 1: concrete
    
    let block = function (cx, cy, x, y) {
        this.chunkX = cx;
        this.chunkY = cy;
        this.x = x;
        this.y = y;
        this.type = 0;
        this.floor = 0;
        this.owned = false;
        this.draw = function () {
            stroke(0, 0, 0)
            strokeWeight(3);
            //floor
            if (this.floor == 0) {
                fill(117, 70, 43);
                rRect(this.chunkX, this.chunkY, this.x * 80, this.y * 80, 80, 80);
                fill(130, 76, 46);
                noStroke();
                rEllipse(this.chunkX, this.chunkY, this.x * 80 + 20, this.y * 80 + 50, 10, 10);
                rEllipse(this.chunkX, this.chunkY, this.x * 80 + 60, this.y * 80 + 20, 10, 10);
                rEllipse(this.chunkX, this.chunkY, this.x * 80 + 15, this.y * 80 + 34, 10, 10);
                rEllipse(this.chunkX, this.chunkY, this.x * 80 + 55, this.y * 80 + 72, 10, 10);
            } else if (this.floor == 1) {
                fill(189, 189, 189);
                rRect(this.chunkX, this.chunkY, this.x * 80, this.y * 80, 80, 80);
            }
            
            //type
            if (this.type == 1) { //wall
                fill(82, 81, 81);
                rRect(this.chunkX, this.chunkY, this.x * 80, this.y * 80, 80, 80);
            }
        }
    };
    
    //---------------------------------------------matrix
    //matrix[chunkX][chunkY][squareX][squareY]
    for(let i = 0; i < 9; i++){
        matrix.push([]);
        for(let i2 = 0; i2 < 5; i2++){
            matrix[i].push([]);
            for(let i3 = 0; i3 < 5; i3++){
                matrix[i][i2].push([]);
                for(let i4 = 0; i4 < 5; i4++){
                    matrix[i][i2][i3].push(new block(i, i2, i3, i4));
                }
            }
        }
    }
    console.log("matrix:--", matrix);
    
    //----------------------------create starting point
    for (let i = 0; i < 5; i++) {
        for(let i2 = 0; i2 < 5; i2++) {
            matrix[4][4][i][i2].type = 1;
            matrix[4][4][i][i2].floor = 1;
            matrix[4][4][i][i2].owned = true;
        }
    }
    for (let i = 1; i < 4; i++) {
        for(let i2 = 1; i2 < 4; i2++) {
            matrix[4][4][i][i2].type = 0;
        }
    }
    matrix[4][4][2][4].type = 0;
    
    //----------------------------loaded chunks
    let currChunk = [0, 0]
    let adjChunks = [];
    let findChunks = function () {
        if (!(Math.floor(screen.x / 400) === currChunk[0] && Math.floor(screen.y / 400) === currChunk[1])) {
            currChunk = [
                Math.floor(screen.x / 400),
                Math.floor(screen.y / 400)
            ];
            adjChunks = [];
            adjArrayX = [1, -1, 0, 0, 1, -1, 1, -1];
            adjArrayY = [0, 0, 1, -1, 1, -1, -1, 1];
            
            for(let i = 0; i < 8; i++) {
                adjChunks.push([currChunk[0] + adjArrayX[i], currChunk[1] + adjArrayY[i]]);
            }
        }
    };
    findChunks();
    
    //----------------------------------------------relative drawing
    //chunk x, chunk y, x in px, y in px, width in px, height in px;
    let rRect = function (cx, cy, x, y, w, h) {
        if (
            (cx * 400 + x) + w > screen.x &&
            (cy * 400 + y) + h > screen.y &&
            (cx * 400 + x) < screen.x + 400 &&
            (cy * 400 + y) < screen.y + 400
        ) {
            rect((cx * 400 + x) - screen.x, (cy * 400 + y) - screen.y, w, h);
        }
    };
    let rEllipse = function (cx, cy, x, y, w, h) {
        if (
            (cx * 400 + (x - w/2)) + w > screen.x &&
            (cy * 400 + (y - w/2)) + h > screen.y &&
            (cx * 400 + (x - w/2)) < screen.x + 400 &&
            (cy * 400 + (y - w/2)) < screen.y + 400
        ) {
            ellipse((cx * 400 + x) - screen.x, (cy * 400 + y) - screen.y, w, h);
        }
    };
    
    //=================================================================================
    //----------------------------startup----------------------------------------------
    //=================================================================================
    
    //-----------------------------------------------------command terminal
    let commandFunction;
    document.body.addEventListener("keydown", function (e) {
        if(e.key == 'r' && e.ctrlKey == true) {
            e.preventDefault();
            commandFunction(window.prompt("Run command inside tick:", "console.log('hello world')"));
        }
    })
    
    //------------------------------------------------------ticks
    
    //----------------------------------------tick setup
    //mouse
    let mouse = {
        chunk: [0, 0],
        block: [0, 0],
        display: false
    };
    
    //debug
    let debugNodes = {
        scrollX: document.getElementById("scrollX"),
        scrollY: document.getElementById("scrollY"),
        currChunk: document.getElementById("currChunk"),
        adjChunks: document.getElementById("adjChunks"),
        keys: document.getElementById("keys"),
        mouse: document.getElementById("mouse")
    };
    
    //keyboard
    keys = {
        w: false,
        a: false,
        s: false,
        d: false
    }
    document.body.addEventListener("keydown", function (e) {
        if (e.repeat === false) {
            if (e.keyCode === 87) {
                keys.w = true;
            } else if (e.keyCode === 65) {
                keys.a = true;
            } else if (e.keyCode === 83) {
                keys.s = true;
            } else if (e.keyCode === 68) {
                keys.d = true;
            }
        }
    });
    document.body.addEventListener("keyup", function (e) {
        if (e.keyCode === 87) {
            keys.w = false;
        } else if (e.keyCode === 65) {
            keys.a = false;
        } else if (e.keyCode === 83) {
            keys.s = false;
        } else if (e.keyCode === 68) {
            keys.d = false;
        }
    });
    document.getElementById("mycanvas").addEventListener("mousedown", function (e) {
        if (e.which === 3) {
            if (mouse.display) {
                mouse.display = false;
            } else {
                mouse.display = true;
            }
        }
    });
    
    let slowDown = 0;
    
    //----------------------------------------tick
    tick = function () {
        //--------------------------command
        commandFunction = function (codeLine) {
            Function(codeLine)();
        };
        
        //---------------------------scrolling
        if(settings.mouseScrollingEnabled) { //mouse
            if(mouseY < 100) {
                if(mouseInCanvas) {
                    screen.y += mouseY/20 - 5;
                    slowDown = 0;
                } else {
                    if(slowDown < 100) {
                        slowDown += 1;
                        screen.y += slowDown/20 - 5;
                    }
                }
            }
            if(mouseY > 300) {
                if(mouseInCanvas) {
                    screen.y += mouseY/20 - 15;
                    slowDown = 400;
                } else {
                    if(slowDown > 300) {
                        slowDown -= 1;
                        screen.y += slowDown/20 - 15;
                    }
                }
            }
            if(mouseX < 100) {
                if(mouseInCanvas) {
                    screen.x += mouseX/20 - 5;
                    slowDown = 0;
                } else {
                    if(slowDown < 100) {
                        slowDown += 1;
                        screen.x += slowDown/20 - 5;
                    }
                }
            }
            if(mouseX > 300) {
                if(mouseInCanvas) {
                    screen.x += mouseX/20 - 15;
                    slowDown = 400;
                } else {
                    if(slowDown > 300) {
                        slowDown -= 1;
                        screen.x += slowDown / 20 - 15;
                    }
                }
            }
        }
        if (keys.w === true) {
            screen.y += -2;
        } 
        if (keys.a === true) {
            screen.x += -2;
        } 
        if (keys.s === true) {
            screen.y += 2;
        }
        if (keys.d === true) {
            screen.x += 2;
        }
        
        
        //---------------------------debug
        if (settings.debuggerEnabled) {
            debugNodes.scrollX.textContent = "Total X:-- " + screen.x;
            debugNodes.scrollY.textContent = "Total Y:-- " + screen.y;
            debugNodes.currChunk.textContent = "Current Chunk:-- " + currChunk.toString();
            debugNodes.adjChunks.textContent = "Loaded Chunks:-- " + adjChunks.toString() + "," + currChunk.toString();
            debugNodes.keys.textContent = "Held Keys:-- " + JSON.stringify(keys);
            debugNodes.mouse.textContent = "Mouse:-- " + JSON.stringify(mouse);
        }
        
        //---------------------------mouse
        mouse.chunk = [Math.floor((mouseX + screen.x) / 400), Math.floor((mouseY + screen.y) / 400)];
        mouse.block = [Math.floor((mouseX + screen.x - (Math.floor((mouseX + screen.x) / 400) * 400)) / 80), Math.floor((mouseY + screen.y - (Math.floor((mouseY + screen.y) / 400) * 400)) / 80)];
        
    }; //tick();
    
    //---------------------------------------frame setup
    //-----------------------------draw
    let preDraw = function () {
        background(0, 255, 0);
        
        //easter eggs ;)
        strokeWeight(3);
        fill(0, 0, 0);
        rRect(0, 0, 1795, 4500, 10, 100)
        rEllipse(0, 0, 1800, 4500, 50, 50);
    };
    
    //----------------------------------------frame
    frame = function () {
        preDraw();
        
        //loadChunks 
        findChunks();
        let drawChunk = function (cx, cy) {
            if(matrix[cx] !== undefined) {
                if(matrix[cx][cy] !== undefined) { 
                    for(let i = 0; i < 5; i++) {
                        for(let i2 = 0; i2 < 5; i2++) {
                            matrix[cx][cy][i][i2].draw();
                        }
                    }
                }
            }
        };
        drawChunk(currChunk[0], currChunk[1]);
        for(let i = 0; i < 8; i++) {
            drawChunk(adjChunks[i][0], adjChunks[i][1]);
        }
        
        //mouse display
        if (mouse.display && matrix[mouse.chunk[0]] !== undefined){
            if (matrix[mouse.chunk[0]][mouse.chunk[1]] !== undefined) {
                stroke(255, 255, 255);
                strokeWeight(2);
                fill(0, 0, 0)
                triangle(mouseX, mouseY, mouseX - 60, mouseY - 50, mouseX + 60, mouseY - 50);
                rect(mouseX - 60, mouseY - 110, 120, 60);

                fill(255, 255, 255);
                
                let mouseSquare = matrix[mouse.chunk[0]][mouse.chunk[1]][mouse.block[0]][mouse.block[1]]
                textSize(15);
                textAlign(CENTER, CENTER);
                text(blockTypes[mouseSquare.type], mouseX, mouseY - 100); //type
                textSize(10);
                textAlign(LEFT, CENTER)
                text(floorTypes[mouseSquare.floor] + " floor", mouseX - 55, mouseY - 85);
                if (mouseSquare.owned) {
                    text("Owned", mouseX - 55, mouseY - 75);
                } else {
                    text("Un-owned", mouseX - 55, mouseY - 75);
                }
            }
        }
    }; frame();
    
    //--------------------------------------------------------intervals
    setInterval(function () {
        tick();
    }, 5);
    setInterval(function () {
        frame();
    }, 10)
    
    
    /*setInterval(function () {
        scroll.x += 1;
        tick();
    }, 20)*/
    
}}; //sketchProc






//finalize
var canvas = document.getElementById("mycanvas"); 
document.getElementById("load").addEventListener("click", () => {
    var processingInstance = new Processing(canvas, sketchProc); 
    document.getElementById("load").remove();
        
})