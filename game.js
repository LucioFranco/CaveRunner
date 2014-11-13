var canvasElement = document.getElementById("game");
var canvas = canvasElement.getContext("2d");
canvas.fillStyle = "#ffffff";
canvas.fillRect(0, 0, 700, 394);


if (!window.console)
    console = {};
console.log = console.log || function () {};
console.warn = console.warn || function () {};
console.error = console.error || function () {};
console.info = console.info || function () {};


//cell element is 140 pixels wide allowing 5 cells on screen at once
var objectsArray = new Array(6);
var cells = {};
cells.redCell = function (x) {
    canvas.fillStyle = "#FF002F";
    canvas.fillRect(x, 0, 140, 394);
};

cells.blueCell = function (x) {
    canvas.fillStyle = "#2200FF";
    canvas.fillRect(x, 0, 140, 394);
};

cells.yellowCell = function (x) {
    canvas.fillStyle = "#DDFF00";
    canvas.fillRect(x, 0, 140, 394);
};

cells.greenCell = function (x) {
    canvas.fillStyle = "#009646";
    canvas.fillRect(x, 0, 140, 394);
};

cells.voidCell = function (x) {
    canvas.fillStyle = "#613F13";
    canvas.fillRect(x, 0, 140, 394);
    canvas.fillStyle = "#000000";
    canvas.fillRect(x, 330, 140, 64);
    canvas.fillRect(x, 0, 140, 30);
};

cells.stalagmiteCell = function (x) {
    canvas.fillStyle = "#613F13";
    canvas.fillRect(x, 0, 140, 394);
    canvas.fillStyle = "#000000";
    canvas.fillRect(x, 330, 140, 64);
    canvas.fillRect(x, 0, 140, 30);
    canvas.fillStyle = "#0CF2DB";
    canvas.beginPath();
    canvas.moveTo(x + 35, 330);
    canvas.lineTo(x + 70, 250);
    canvas.lineTo(x + 105, 330);
    canvas.fill();
    canvas.stroke();
};

cells.stalagtiteCell = function (x) {
    canvas.fillStyle = "#613F13";
    canvas.fillRect(x, 0, 140, 394);
    canvas.fillStyle = "#000000";
    canvas.fillRect(x, 330, 140, 64);
    canvas.fillRect(x, 0, 140, 30);
    canvas.fillStyle = "#0CF2DB";
    canvas.beginPath();
    canvas.moveTo(x + 30, 30);
    canvas.lineTo(x + 70, 250);
    canvas.lineTo(x + 105, 30);
    canvas.fill();
    canvas.stroke();
};

cells.pitCell = function (x) {
    canvas.fillStyle = "#613F13";
    canvas.fillRect(x + 0, 0, 140, 394);
    canvas.fillStyle = "#000000";
    canvas.fillRect(x + 0, 0, 140, 30);
    canvas.fillRect(x + 0, 330, 25, 64);
    canvas.fillRect(x + 115, 330, 25, 60);
    canvas.fillStyle = "#FF0000";
    canvas.fillRect(x + 25, 384, 90, 15);
};

//imageset
PersonImage = new Image();
PersonImage.src = 'standingMan.png';
JumpingImage = new Image();
JumpingImage.src = 'jumping-man.png';
SlidingImage = new Image();
SlidingImage.src = 'sliding-man.png';
JumpingtjImage = new Image();
JumpingtjImage.src = 'jumping-mantj.png';

var jump = false;
var counter = 0;
var moveBy = 0;
var velY = 0;
var y = 0;
var jumping = false;
var running = false;
var ducking = false;
var score = 0;
var gameSpeed = 3; //1.5 is normal speed. speed at how fast the screen changes
function gameloop() {
    if (moveBy < 140) {
        moveBy += gameSpeed;
    } else {
        moveBy = 0;
        moveArray();
    }

    for (var i = 0; i < 6; i++) {
        if (objectsArray[i] == 0) {
            cells.voidCell((i * 140) - moveBy);
        } else if (objectsArray[i] == 1) {
            cells.stalagmiteCell((i * 140) - moveBy);
        } else if (objectsArray[i] == 2) {
            cells.stalagtiteCell((i * 140) - moveBy);
        } else if (objectsArray[i] == 3) {
            cells.pitCell((i * 140) - moveBy);
        }
    }

    if (y > 0) {
        velY -= .16;
        jumping = false;
    } else if (jumping) {
        velY = 6.65;
        y = 0;
        jumping = false;
    }else if(ducking) {
        velY = 0;
        y = -90;
    }else {
        velY = 0;
        y = 0;
    }
    
    drawScore();
    drawPerson();
    collision();
    if (running)
        setTimeout(gameloop, 4);
}

function collision() {
    if(objectsArray[1] == 1 && y < 70 && (moveBy > 120 && moveBy < 125)) { 
        /*
         * collision for jumping over statlgmites
         */
        stop();
    }else if(objectsArray[1] == 2 && !ducking && moveBy > 95 && moveBy < 120) { 
        stop();
    }else if(objectsArray[1] == 3 && moveBy > 70 && moveBy < 115 && y < 1) {
        stop();
    }
}

function drawScore() {
    canvas.fillStyle = "#FFFFFF";
    canvas.fillText("Gamespeed = " + gameSpeed, 50, 20);
    canvas.fillText("Score = " + score, 550, 20);
}

function drown() {
    actualY -= 10;
    drawPerson();
    if(actualY < 394) {
        setTimeout(drown(), 200);
    }else {
        stop();
    }
}

document.onkeypress = function () {
    var e = window.event || e;
    if (e.keyCode == 'w'.charCodeAt(0)) {
        jumping = true;
        ducking = false;
    }else if(e.keyCode == 's'.charCodeAt(0) && !ducking) {
        ducking = true;
        jumping = false;
    }
    
    if(e.keyCode == "d".charCodeAt(0) || e.keyCode == "e".charCodeAt(0)) {
        gameSpeed += .25;
    }else if(e.keyCode == "a".charCodeAt(0) || e.keyCode == "q".charCodeAt(0)) {
        gameSpeed -= .25;
    }else if(e.keyCode == " ".charCodeAt(0)) {
        if(gameSpeed == 0) {
            gameSpeed = 3;
        }else  {
            gameSpeed = 0;
        }
    }
};


document.onkeyup = function () {
  var e = window.event || e;
  if(e.keyCode == 83) {
      ducking = false;
      jumping = false;
  }
};
var actualY;

function drawPerson() {
    y += velY;
    
    actualY = 165 - y;
    if(y > 0) {
        canvas.drawImage(JumpingtjImage, 50, actualY);
    }else if(y < -10) { 
        canvas.drawImage(SlidingImage, 50, actualY + 30);
    }else if(velY == 0){
        canvas.drawImage(PersonImage, 50, actualY);
    }
    
    
}

function moveArray() {
    for (var i = 1; i < 6; ++i) {
        objectsArray[i - 1] = objectsArray[i ];
    }

    if (objectsArray[4] == 0) {
        objectsArray[5] = randomNumber(0, 3);
        score++;
    } else {
        objectsArray[5] = 0;
    }
}

function endGameScreen() {
    var fun = function () {
        endgame = true;

        if (score > 100) {

            canvas.fillStyle = "#60EB10";

        } else {
            canvas.fillStyle = "#FC0808";
        }

        canvas.fillRect(0, 0, 700, 394);

        if (score > 100) {
            canvas.fillStyle = "#000000";
            canvas.fillText("GOOD JOB!", 300, 100);
        } else {
            canvas.fillStyle = "#000000";
            canvas.fillText("Bad luck, Try again!", 250, 100);
        }

        var texty = 60;
        var textx = 58;
        canvas.fillStyle = "#000000";
        canvas.fillText("Score = " + score, 300, 130);
        canvas.fillStyle = 'black';
        canvas.font = '24px Times';
        canvas.fillText('Retry', 225 + textx + 30, 130 + texty);
        canvas.rect(213 + textx, 100 + texty, 150, 50);
        canvas.fillText('Back to Menu', 220 + textx, 200 + texty);
        canvas.rect(213 + textx, 170 + texty, 150, 50);
        canvas.stroke();
        score = 0;
    }
    setTimeout(fun, 500);

}


function start() {
    for (var i = 0; i < 6; i++) {
        objectsArray[i] = 0;
    }

    running = true;
    gameloop();
}

function stop() {
    running = false;
    endGameScreen();
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var mouseX, mouseY;
var endgame = false;
var ismenuscreen = false;
canvasElement.onclick = function (e) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;

    if(ismenuscreen && mouseX>=314 && mouseX<=486 && mouseY>=117 && mouseY<=183) {
        ismenuscreen = false;
        start();      
    }else if(endgame && mouseX >= 315 && mouseY >= 188 && mouseX <= 485 && mouseY <= 240) {
        endgame = false;
        start();
    }else if(endgame && mouseX >= 315 && mouseY >= 265 && mouseX <= 485 && mouseY <=325) {
        endgame = false;
        menuscreen();
    }else if(ismenuscreen && mouseY <= 312 && mouseX <= 481 && mouseY >= 194 && mouseX >= 250) {
        leaderboard();
    }else if(isleaderboard && mouseX <= 100 && mouseY <= 45) {
        isleaderboard = false;
        menuscreen();
    }
};

function menuscreen()
{
    canvas.clearRect(0, 0, canvas.width, canvas.height);
    ismenuscreen = true;
    canvas.fillStyle='red';
    canvas.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    canvas.fillStyle = 'black';
    canvas.font = '48px Times';
    canvas.fillText("Cave Runner", 170+60, 50);
    
    canvas.fillStyle = 'black';
    canvas.font = '24px Times';
    canvas.fillText('Click to start', 225+60, 130);
    canvas.rect(213+60,100,150,50);
    canvas.fillText('Leaderboard', 225+60, 200);
    canvas.rect(213+60,170,150,50);
    canvas.stroke();
    

}

//Jason's Code
var isleaderboard = false;
function leaderboard(){
    isleaderboard = true;
    var names =["Jason","Lucio","Jacob","John"];
    var score= [70,11,23,26]; 
    var count=50;
    canvas.fillStyle="#FF0000";
    canvas.clearRect(0, 0, 700, 394);
    canvas.fillRect(0,0,700,394);
    //canvas.rect(10,35,150,150);
     canvas.fillStyle='black';
    canvas.fillText("Back",20,30);
    for(var i=0; i<names.length;i++){
       
       // canvas.rect(320,count,150,150);
        //canvas.rect(400,count,150,150);
        canvas.fillText(names[i],265,count);
        canvas.fillText(score[i],400,count);
        count+=50; 
    }
    
}
function Write(message)
{
var Scr = new ActiveXObject("Scripting.FileSystemObject");
var CTF = Scr.CreateTextFile("C:\\leaderboard.txt", true);
CTF.WriteLine(message);
CTF.Close();
}

function main() {
    menuscreen();
}
main();