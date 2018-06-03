var open;
var help1;
var speedIn;
var start;
var gamepage;
var actualstart;
var pause;
var resume;
var textbox;
var wordbox;
var progress;
var timebox;
var scorebox;
var help2;
var reset;
var startNew1;
var increaseS;
var decreaseS;
var speedDisplay;
var helppage;
var back;
var end;
var startNew2;
var chart;
var successbox;
var totalbox;
var finalscorebox;

var numSpeed;
var tempTimer;
var tempWord;
var tempWidth;
var tempTyped;

const START_SPEED = 50;
const SPEED_FACTOR = 3;
const TIME = 60.0;
const SUCCESS = 1;
const FAILED = 0.25;

var words = [];
var numWordsSpeeds = [];
var usedIndex = [];
var NUM_WORDS;
var started = false;
var speed = START_SPEED;
var score = 0;
var success = 0;
var total = 0;
var barWidth = 0;
var timer;
var intervalTimer;

window.onload = init;

function init() {
    open = document.querySelector("#open");
    speedIn = document.querySelector("#speed");
    start = document.querySelector("#start");
    gamepage = document.querySelector("#gamepage");
    actualstart = document.querySelector("#actualstart");
    pause = document.querySelector("#pause");
    resume = document.querySelector("#resume");
    textbox = document.querySelector("#typed");
    wordbox = document.querySelector("#word");
    progress = document.querySelector("#progress");
    timebox = document.querySelector("#time");
    scorebox = document.querySelector("#score");
    help1 = document.querySelector("#help1");
    help2 = document.querySelector("#help2");
    reset = document.querySelector("#reset");
    startNew1 = document.querySelector("#startNew1");
    increaseS = document.querySelector("#increaseSpeed");
    decreaseS = document.querySelector("#decreaseSpeed");
    speedDisplay = document.querySelector("#speeddisplay");
    helppage = document.querySelector("#helppage");
    back = document.querySelector("#back");
    end = document.querySelector("#end");
    startNew2 = document.querySelector("#startNew2");
    chart = document.querySelector("#chart");
    successbox = document.querySelector("#successful");
    totalbox = document.querySelector("#total");
    finalscorebox = document.querySelector("#finalscore");

    speedIn.value = 8;
    speedIn.focus();
    addWords();
    fill(16);
    start.addEventListener("click", startSetup);
    document.addEventListener("keyup", initialStartShortcut);
    actualstart.addEventListener("click", startGame);
    pause.addEventListener("click", pauseGame);
    resume.addEventListener("click", resumeGame);
    help1.addEventListener("click", openHelp);
    help2.addEventListener("click", openHelp);
    back.addEventListener("click", backToGame);
    startNew1.addEventListener("click", newStart);
    startNew2.addEventListener("click", newStart);
    reset.addEventListener("click", endGame);
    increaseS.addEventListener("click", increaseSpeed);
    decreaseS.addEventListener("click", decreaseSpeed);
    textbox.addEventListener("keyup", checkWord);
}

function checkWord(evt) {
    let currentTextLen = textbox.value.length;
    if(currentTextLen === 0) {
        textbox.style.backgroundColor = "blanchedalmond";
    } else if(textbox.value === wordbox.innerHTML) {
        score += SUCCESS;
        success++;
        total++;
        (numWordsSpeeds[numSpeed]).success++;
        scorebox.innerHTML = score;
        loadNewWord();
    } else if(textbox.value === wordbox.innerHTML.substring(0, currentTextLen)) {
        textbox.style.backgroundColor = "lightgreen";
    } else {
        textbox.style.backgroundColor = "#f07060";
    }
}

function loadNewWord() {
    let newWord = words[getIndex()];
    textbox.style.backgroundColor = "blanchedalmond";
    wordbox.innerHTML = newWord;
    textbox.value = '';
    width = 0;
    changeProgress();
}

function changeProgress() {
    clearInterval(intervalTimer);
    intervalTimer = setInterval(changeBar, speed);
    width = 0;
}

function changeBar() {
    if(width >= 100) {
        clearInterval(intervalTimer);
        width = 0;
        score -= FAILED;
        total++;
        (numWordsSpeeds[numSpeed]).missed++;
        scorebox.innerHTML = score;
        loadNewWord();
    } else {
        width++;
        progress.style.width = width + "%";
    }
}

function pauseGame(evt) {
    pause.style.display = "none";
    resume.style.display = "initial";
    tempWord = wordbox.innerHTML;
    tempWidth = barWidth;
    tempTyped = textbox.value;

    textbox.value = '';
    wordbox.innerHTML = "";
    progress.style.width = "0.05%";
    clearInterval(timer);
    clearInterval(intervalTimer);
    resume.focus();
}

function resumeGame(evt) {
    pause.style.display = "initial";
    resume.style.display = "none";

    wordbox.innerHTML = tempWord;
    progress.style.width = tempWidth + "%";
    textbox.value = tempTyped;
    textbox.focus();

    timer = setInterval(gameTimer, 100);
    intervalTimer = setInterval(changeBar, speed);
    tempWord = undefined;
    tempWidth = undefined;
    tempTyped = undefined;
}

function openHelp(evt) {
    gamepage.style.display = "none";
    helppage.style.display = "block";
    open.style.display = "none";
}

function backToGame(evt) {
    open.style.display = "block";
    helppage.style.display = "none";
}

function check(evt) {
    if(isNaN(parseInt(evt.target.value, 10))) {
        evt.target.value = 0;
    } else if(evt.target.value < 0) {
        evt.target.value = 0;
    } else if(evt.target.value > 15) {
        evt.target.value = 15;
    } else if(evt.target.value % 1 !== 0) {
        evt.target.value = Math.floor(evt.target.value);
    }
}

function increaseSpeed(evt) {
    if(started) {
        textbox.focus();
    } else {
        actualstart.focus();
    }

    if(numSpeed < 15) {
        numSpeed++;
        speed -= SPEED_FACTOR;
        if(numSpeed === 15) {
            increaseS.style.backgroundColor = "lightgray";
        } else {
            increaseS.style.backgroundColor = "floralwhite";
            decreaseS.style.backgroundColor = "floralwhite";
        }
        speedDisplay.innerHTML = numSpeed;
    }
}

function decreaseSpeed(evt) {
    if(started) {
        textbox.focus();
    } else {
        actualstart.focus();
    }

    if(numSpeed > 0) {
        numSpeed--;
        speed += SPEED_FACTOR;
        if(numSpeed === 0) {
            decreaseS.style.backgroundColor = "lightgray";
        } else {
            increaseS.style.backgroundColor = "floralwhite";
            decreaseS.style.backgroundColor = "floralwhite";
        }
        speedDisplay.innerHTML = numSpeed;
    }
}

function startSetup(evt) {
    numSpeed = speedIn.value;
    speed = START_SPEED - (SPEED_FACTOR * numSpeed);
    //I know speed value is correct!
    open.style.display = "none";
    gamepage.style.display = "block";
    actualstart.focus();
    timebox.innerHTML = TIME;
    scorebox.innerHTML = "0";
    textbox.readOnly = true;

    //using == instead of === as numspeed is initially a string
    if(numSpeed == 15) {
        increaseS.style.backgroundColor = "lightgray";
    } else if(numSpeed == 0) {
        decreaseS.style.backgroundColor = "lightgray";
    }
    speedDisplay.innerHTML = numSpeed;
    document.removeEventListener("keyup", initialStartShortcut);
    document.addEventListener("keyup", speedShortcuts);
}

function startGame(evt) {
    started = true;
    textbox.readOnly = false;
    textbox.focus();
    pause.style.display = "initial";
    actualstart.style.display = "none";
    timer = setInterval(gameTimer, 100);
    document.addEventListener("keyup", pauseResumeShortcuts);
    document.addEventListener("click", bringBackFocus);
    loadNewWord();
}

function newStart(evt) {
    started = false;
    clearInterval(intervalTimer);
    clearInterval(timer);
    document.removeEventListener("click", bringBackFocus);
    document.removeEventListener("keyup", speedShortcuts);
    document.removeEventListener("keyup", pauseResumeShortcuts);
    document.addEventListener("keyup", initialStartShortcut);

    speedIn.focus();
    resetValues();
    open.style.display = "block";
    gamepage.style.display = "none";
    end.style.display = "none";
}

function endGame() {
    started = false;
    clearInterval(intervalTimer);
    clearInterval(timer);
    end.style.display = "block";
    gamepage.style.display = "none";

    chart.innerHTML = "";
    for(let i = 0; i < numWordsSpeeds.length; i++) {
        let wordsSpeedMiss = numWordsSpeeds[i].missed;
        let wordsSpeedSucc = numWordsSpeeds[i].success;
        if((wordsSpeedMiss + wordsSpeedSucc) !== 0) {
            let pInner = "S: " + i;
            pInner += "<br>M: " + wordsSpeedMiss;
            pInner += "<br>G: " + wordsSpeedSucc;

            chart.innerHTML += "<div><p>" + pInner + "</p><div class=\"top\" id=\"speedTop" + i + "\"></div><div class=\"middle\" id=\"speedMid" + i + "\"></div><div class=\"bottom\" id=\"speedBot" + i + "\"></div></div>"
            let divT = document.querySelector("#speedTop" + i);
            let divM = document.querySelector("#speedMid" + i);
            let divB = document.querySelector("#speedBot" + i);
            
            let divBval = wordsSpeedSucc / total * 100;
            let divMval = wordsSpeedMiss / total * 100;

            divT.style.height = 100 - (divBval + divMval) + "%";
            divM.style.height = divMval + "%";
            divB.style.height = divBval + "%";
        }
    }

    document.removeEventListener("click", bringBackFocus);
    document.removeEventListener("keyup", speedShortcuts);
    document.removeEventListener("keyup", pauseResumeShortcuts);

    finalscorebox.innerHTML = score;
    successbox.innerHTML = success;
    totalbox.innerHTML = total;
    
    resetValues();

    startNew2.focus();
}

function bringBackFocus(evt) {
    if(evt.target.nodeName !== "BUTTON") {
        textbox.focus();
    }
}

function initialStartShortcut(evt) {
    if(evt.ctrlKey && evt.code === "Enter") {
        startSetup(evt);
    }
}

function speedShortcuts(evt) {
    if(evt.ctrlKey && evt.altKey && evt.code === "KeyK") {
        increaseSpeed(evt);
    } else if(evt.ctrlKey && evt.altKey && evt.code === "KeyM") {
        decreaseSpeed(evt);
    }
}

function pauseResumeShortcuts(evt) {
    if(evt.ctrlKey && evt.code === "Period") {
        evt.preventDefault();
        pauseGame(evt);
    } else if(evt.ctrlKey && evt.code === "Semicolon") {
        evt.preventDefault();
        resumeGame(evt);
    }
}

function resetValues() {
    textbox.value = "";
    wordbox.innerHTML = "";
    score = 0;
    numSpeed = 0;
    speed = START_SPEED;
    missed = 0;
    success = 0;
    barWidth = 0;
    timebox.innerHTML = TIME;
    scorebox.innerHTML = "0.0";
    progress.style.width = "0.05%";
    score = 0;
    success = 0;
    total = 0;
    fill(16);
    usedIndex = [];

    actualstart.style.display = "initial";
    pause.style.display = "none";
    resume.style.display = "none";
    textbox.style.backgroundColor = "white";
}

function addWords() {
    words.push("random", "peacock", "attention", "phone", "mobile", "tablet",
    "marriage", "child", "shirt", "glasses", "clock", "bottle", "famous", "bag",
    "black", "tiger", "watch", "army", "best", "catch", "cover", "fan", "handle",
    "suitcase", "baggage", "printer", "scanner", "machine", "computer", "hanger",
    "light", "napkin", "brush", "comb", "switch", "door", "rod", "cooler", "attic",
    "C.D.", "moisture", "laptop", "charger", "pillow", "socket", "adapter", "pen", 
    "time", "bulb", "photo", "globe", "woofer", "telephone", "telescope", "award",
    "cupboard", "cushion", "ladder", "sofa", "human", "feet", "W.M.", "grill",
    "file", "wind-chime", "heart", "curtain", "Suhas", "blanket", "USA", "bedsheet",
    "India", "granite", "marble", "double", "vessel", "dishes", "laundry", "bonus",
    "bathtub", "shower", "toilet", "cursor", "television", "monitor", "dining",
    "kitchen", "living", "oven", "microwave", "stove", "floor", "building", "array",
    "cloud", "rain", "monsoon", "weather", "sunrise", "sunset", "woohoo", "moonlight",
    "hello", "magazine", "bullet", "blood", "knob", "plastic", "yellow", "yolo",
    "crazy", "queen", "trunk", "clothes", "blob", "swoosh", "batter", "cake",
    "birthday", "touche", "spaghetti", "noodle", "spongebob", "word", "promise",
    "oops spill", "short", "a", "so many", "button", "input", "swindle", "money",
    "xzqvw", "Try this?", "I'm laughing at you");
    NUM_WORDS = words.length;
}

function getIndex() {
    let index = Math.floor(Math.random() * NUM_WORDS);
    while(done(index)) {
        index = Math.floor(Math.random() * NUM_WORDS);
    }
    usedIndex.push(index);

    return index;
}

function done(index) {
    for(let i = 0; i < usedIndex.length; i++) {
        if(usedIndex[i] === index) {
            return true;
        }
    }

    return false;
}

function fill(val) {
    numWordsSpeeds = [];
    for(let i = 0; i < val; i++) {
        let obj = {missed:0, success:0};
        numWordsSpeeds.push(obj);
    }
}

function gameTimer() {
    if(timebox.innerHTML === '0.0') {
        endGame();
    } else {
        timebox.innerHTML = (timebox.innerHTML - 0.1).toFixed(1);
    }
}