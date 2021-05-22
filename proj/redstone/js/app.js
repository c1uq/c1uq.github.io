//data
var data = {};
data.zoom = 1;
data.scroll = [0, 0];
data.gates = [];
data.typeData = [
    {name:"NOT", input:1, output:1, class:"gate", run: function (b) {
        return [!(b[0])];
    }},
    {name:"AND", input:2, output:1, class:"gate", run: function (b) {
        return [b[0] && b[1]];
    }},
    {name:"XAND", input:2, output:1, class:"gate", run: function (b) {
        return [(b[0] && b[1]) || (!(b[0]) && !(b[1]))];
    }},
    {name:"OR", input:2, output:1, class:"gate", run: function (b) {
        return [b[0] || b[1]];
    }},
    {name:"XOR", input:2, output:1, class:"gate", run: function (b) {
        return [(b[0] || b[1]) && !(b[0] && b[1])];
    }},
    {name:"Power", input:0, output:10, class:"control", run: function (b) {
        return [true, true, true, true, true, true, true, true, true, true];
    }},
    {name:"Switch", input:1, output:1, class:"control", status:true, run: function (b) {
        return [b[0] && this.status];
    }, click: function () {
        console.log(this.status);
        if (this.status === true) {
            this.status = false;
        } else {
            this.status = true;
        }
    }},
    {name:"Lamp", input:1, output:1, class:"control", status:false, run: function (b) {
        this.status = b[0];
        return [b[0]];
    }},
    {name:"Point", input:1, output:10, class:"control", run: function (b) {
        return [b[0], b[0], b[0], b[0], b[0], b[0], b[0], b[0], b[0], b[0]]; 
    }}
]

//units
function sz (num) {
    return num * data.zoom;
}
function sx (num) {
    return (num + data.scroll[0]) * data.zoom;
};
function sy (num) {
    return (num + data.scroll[1]) * data.zoom;
};

var sketchProc = function(processingInstance) { with (processingInstance) {
    
    size(400, 400);
    background(0, 0, 0);
    
    //-----------------------------------------------------------------
    //=============================================================init
    //-----------------------------------------------------------------
    class Gate {
        constructor (type, x, y) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.typeData = JSON.parse(JSON.stringify(data.typeData[this.type]));
            this.typeData.run = data.typeData[this.type].run;
            if (this.type === 6) {
                this.typeData.click = data.typeData[this.type].click;
            }
            
            this.inputs = [];
            this.outputs = [];
        }
        
        runGate (bool) {
            console.log("-----", this.typeData.name);
            if (bool !== undefined) {
                this.inputs.push(bool);
            }
            console.log(bool, this.inputs.length, this.typeData.input);
            if (this.inputs.length === this.typeData.input) {
                let out = this.typeData.run(this.inputs);
                console.log(this.outputs, out);
                for (let i = 0; i < this.outputs.length; i++) {
                    this.outputs[i].runGate(out[i]);
                }
            }
        }
        
        draw () {
            //node
            strokeWeight(sz(2));
            stroke(0, 0, 0);
            if (this.typeData.class === "gate") {
                fill(255, 255, 255);
                ellipse(sx(this.x), sy(this.y), sz(60), sz(60));
            } else if (this.typeData.class === "control") {
                fill(214, 211, 28);
                ellipse(sx(this.x), sy(this.y), sz(60), sz(60));
            } 
            if (this.type === 7) {
                if (!(interactive)) {
                    if (this.typeData.status) {
                        fill(0, 255, 0);
                    } else {
                        fill(255, 0, 0);
                    }
                } else {
                    fill(84, 62, 0);
                }
                ellipse(sx(this.x), sy(this.y), sz(60), sz(60));
            } else if (this.type === 6) {
                if (this.typeData.status) {
                    fill(0, 99, 0)
                } else {
                    fill(99, 0, 0);
                }
                ellipse(sx(this.x), sy(this.y), sz(60), sz(60));
            }
        }
        
        drawLines () {
            for (let i = 0; i < this.outputs.length; i++) {
                if (data.gates.indexOf(this.outputs[i]) === -1) {
                    this.outputs.splice(i);
                } else {
                    strokeWeight(sz(8));
                    stroke(0, 128, 145);
                    line(sx(this.x), sy(this.y), sx(this.outputs[i].x), sy(this.outputs[i].y));

                    strokeWeight(0);
                    fill(0, 128, 145);
                    ellipse(sx(this.outputs[i].x), sy(this.outputs[i].y), sz(15), sz(15));

                    stroke(0, 61, 69);
                    line(
                        sx(this.x) - (sx(this.x) - sx(this.outputs[i].x)) * .6, 
                        sy(this.y) - (sy(this.y) - sy(this.outputs[i].y)) * .6,
                        sx(this.outputs[i].x) - (sx(this.outputs[i].x) - sx(this.x)) * .6, 
                        sy(this.outputs[i].y) - (sy(this.outputs[i].y) - sy(this.y)) * .6,
                    );
                    noStroke();
                    fill(0, 61, 69);
                    ellipse(
                        sx(this.x) - (sx(this.x) - sx(this.outputs[i].x)) * .6, 
                        sy(this.y) - (sy(this.y) - sy(this.outputs[i].y)) * .6,
                        10, 10
                    );
                }
            }
        }
        
        drawText () {
            textSize(sz(20));
            textAlign(CENTER, CENTER);
            fill(0, 0, 0);
            if (this.typeData.class === "gate") {
                text(this.typeData.name, sx(this.x), sy(this.y));
            } else if (this.typeData.class === "control") {
                if (this.type === 5) {
                    text("POW", sx(this.x), sy(this.y));
                } else if (this.type === 6) {
                    if (this.typeData.status) {
                        text("ON", sx(this.x), sy(this.y));
                    } else {
                        text("OFF", sx(this.x), sy(this.y));
                    }
                } else if (this.type === 7) {
                    text("LI", sx(this.x), sy(this.y));
                }
            }
        }
    }
    
    function run() {
        //start at power sources
        for (let i = 0; i < data.gates.length; i++) {
            if (data.gates[i] !== null) {
                if (data.gates[i].type === 5) {
                    data.gates[i].runGate();
                }
            }
        }
    }
    
    //-----------------------------------------------------------
    //========================================================run
    //-----------------------------------------------------------
    var selectedType = 5;
    var interactive = true;
    
    function create() {
        let canvas = document.getElementById("mycanvas");
        let wire = null;
        
        canvas.addEventListener("mouseup", function (e) { //----------------------------------------up
            if (wire !== null && interactive) {
                let mouse = [(mouseX + 205) / data.zoom - data.scroll[0], (mouseY + 205) / data.zoom - data.scroll[1]];
                let clickedOn = null;
                for (let i = 0; i < data.gates.length; i++) {
                    if (data.gates[i] !== null) {
                        let gate = data.gates[i];
                        if ((Math.abs(mouse[0] - gate.x) + Math.abs(mouse[1] - gate.y)) / 2 < 27) {
                            clickedOn = gate;
                        }
                    }
                }
                
                if (clickedOn !== null) {
                    if (wire === clickedOn) {
                        if (wire.type === 6) {
                            console.log(wire)
                            wire.typeData.click();
                        }
                    } else {
                        wire.outputs.push(clickedOn);
                    }
                }
                
                wire = null;
            }
        });
        
        canvas.addEventListener("mousedown", function(e) { //-----------------------------------------down
            let mouse = [(mouseX + 205) / data.zoom - data.scroll[0], (mouseY + 205) / data.zoom - data.scroll[1]];
            console.log(mouse);
            if (e.which === 1 && interactive) {
                let clickedOn = null;
                for (let i = 0; i < data.gates.length; i++) {
                    if (data.gates[i] !== null) {
                        let gate = data.gates[i];
                        if ((Math.abs(mouse[0] - gate.x) + Math.abs(mouse[1] - gate.y)) / 2 < 27) {
                            clickedOn = gate;
                        }
                    }
                }
                
                if (clickedOn === null) {
                    data.gates.push(new Gate(selectedType, mouse[0], mouse[1]));
                } else {
                    wire = clickedOn;
                }
            } else if (e.which === 3 && interactive) {
                let clickedOn = null;
                for (let i = 0; i < data.gates.length; i++) {
                    if (data.gates[i] !== null) {
                        let gate = data.gates[i];
                        if ((Math.abs(mouse[0] - gate.x) + Math.abs(mouse[1] - gate.y)) / 2 < 27) {
                            clickedOn = gate;
                        }
                    }
                }
                
                if (clickedOn !== null) {
                    data.gates[data.gates.indexOf(clickedOn)] = null;
                }
            }
        });
        
        //keyboard
        keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            z: false,
            x: false
        }
        document.addEventListener("keydown", function(e) { //----------------------------------------------key
            if (e.keyCode === 39 || e.keyCode === 81) {
                if (selectedType < data.typeData.length - 1) {
                    selectedType++;
                } else {
                    selectedType = 0;
                }
            } else if (e.keyCode === 37 || e.keyCode === 69) {
                if (selectedType > 0) {
                    selectedType--;
                } else {
                    selectedType = data.typeData.length - 1;
                }
            } else if (e.keyCode === 32) {
                if (interactive) {
                    interactive = false;
                    run();
                } else {
                    interactive = true;
                    for (let i = 0; i < data.gates.length; i++) {
                        if (data.gates[i] !== null) {
                            if (data.gates[i].type === 7) {
                                data.gates[i].typeData.status = false;
                            }
                            data.gates[i].inputs = [];
                        }
                    }
                }
            } else if (e.keyCode === 70) { //-----------------------------save
                let code = [];
                for (let ga = 0; ga < data.gates.length; ga++) {
                    let gate = data.gates[ga];
                    
                    let first = [
                        gate.x,
                        gate.y,
                        gate.type,
                    ];
                    if (gate.typeData.state == undefined) {
                        first.push('null');
                    } else {
                        first.push(gate.typeData.state);
                    }
                    
                    let second = [];
                    for (let i = 0; i < gate.outputs.length; i++) {
                        second.push(data.gates.indexOf(gate.outputs[i]));
                    }
                    code.push("[" + first.toString() + "]");
                    code.push("[" + second.toString() + "]");
                }
                console.log(code);
                alert("[" + code.toString() + "]");
            } else if (e.keyCode === 71) { //------------------------------------load
                let code = JSON.parse(window.prompt("Load"));
                console.log(code);
                data.gates = [];
                
                for (let i = 0; i < code.length; i += 2) {
                    let info = code[i];
                    data.gates.push(new Gate(info[2], info[0], info[1]));
                }
                for (let ga = 1; ga < code.length; ga += 2) {
                    let gate = data.gates[(ga - 1) / 2];
                    for (let i = 0; i < code[ga].length; i++) {
                        gate.outputs.push(data.gates[code[ga][i]]);
                        console.log(code[ga], code[ga][i]);
                    }
                }
            }
            
            if (e.repeat === false) {
                if (e.keyCode === 87) {
                    keys.w = true;
                } else if (e.keyCode === 65) {
                    keys.a = true;
                } else if (e.keyCode === 83) {
                    keys.s = true;
                } else if (e.keyCode === 68) {
                    keys.d = true;
                } else if (e.keyCode === 90) {
                    keys.z = true;
                } else if (e.keyCode === 88) {
                    keys.x = true;
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
            } else if (e.keyCode === 90) {
                keys.z = false;
            } else if (e.keyCode === 88) {
                keys.x = false;
            }
        });
        
        function animate() {
            //back
            background(0, 0, 0)

            //temporary wire
            if (wire !== null) {
                let mouse = [(mouseX + 205) / data.zoom - data.scroll[0], (mouseY + 205) / data.zoom - data.scroll[1]];
                
                strokeWeight(sz(8));
                stroke(0, 128, 145);
                line(sx(wire.x), sy(wire.y), sx(mouse[0]), sy(mouse[1]));
                
                strokeWeight(0);
                fill(0, 128, 145);
                ellipse(sx(mouse[0]), sy(mouse[1]), sz(15), sz(15));
                
                stroke(0, 61, 69);
                line(
                    sx(wire.x) - (sx(wire.x) - sx(mouse[0])) * .6, 
                    sy(wire.y) - (sy(wire.y) - sy(mouse[1])) * .6,
                    sx(mouse[0]) - (sx(mouse[0]) - sx(wire.x)) * .6, 
                    sy(mouse[1]) - (sy(mouse[1]) - sy(wire.y)) * .6,
                );
                noStroke();
                fill(0, 61, 69);
                ellipse(
                    sx(wire.x) - (sx(wire.x) - sx(mouse[0])) * .6, 
                    sy(wire.y) - (sy(wire.y) - sy(mouse[1])) * .6,
                    10, 10
                );
            }

            //points
            for (let i = 0; i < data.gates.length; i++) {
                if (data.gates[i] !== null) {
                    data.gates[i].draw();
                }
                
            }
            for (let i = 0; i < data.gates.length; i++) {
                if (data.gates[i] !== null) {
                    data.gates[i].drawLines();
                }
                
            }
            for (let i = 0; i < data.gates.length; i++) {
                if (data.gates[i] !== null) {
                    data.gates[i].drawText();
                }

            }
            
            //type text
            fill(255, 255, 255);
            textAlign(TOP, LEFT);
            textSize(30);
            text(data.typeData[selectedType].name, 15, 385);
            
            if (keys.w) {
                data.scroll[1] += 10;
            } if (keys.a) {
                data.scroll[0] += 10;
            } if (keys.s) {
                data.scroll[1] -= 10;
            } if (keys.d) {
                data.scroll[0] -= 10;
            } if (keys.z) {
                data.zoom /= 1.03;
                
            } if (keys.x) {
                data.zoom *= 1.03;
            }
            
            //run text
            if (!(interactive)) {
                textAlign(RIGHT, BOTTOM);
                fill(255, 0, 0)
                text("RUNNING", 385, 390);
            }
            
            //animate
            requestAnimationFrame(animate);
        }
        animate();
    }
    create();
    
}}; //sketchProc


//finalize
var canvas = document.getElementById("mycanvas"); 
document.getElementById("load").addEventListener("click", () => {
    var processingInstance = new Processing(canvas, sketchProc); 
    document.getElementById("load").remove();
        
})