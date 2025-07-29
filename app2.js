let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "green", "purple"];

let started = false;
let level = 0;
let isBotMode = false;
let botInterval = null;
let botSpeed = 500;

let h2 = document.querySelector("h2");
const speedSlider = document.getElementById("speedSlider");
const speedDisplay = document.getElementById("speedDisplay");

speedSlider.addEventListener("input", () => {
    botSpeed = parseInt(speedSlider.value);
    speedDisplay.textContent = botSpeed;
});

document.getElementById("botModeToggle").addEventListener("change", function () {
    isBotMode = this.checked;

    if (!isBotMode) {
        if (botInterval) {
            clearInterval(botInterval);
            botInterval = null;
        }
        h2.innerText = `AI stopped at Level ${level}. You can continue manually.`;
    }

    if (isBotMode && !started) {
        started = true;
        levelUp();
    }
});

document.addEventListener("keypress", function () {
    if (started == false && !isBotMode) {
        started = true;
        levelUp();
    }
});

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 100);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function () {
        btn.classList.remove("userflash");
    }, 100);
}

function levelUp() {
    if (!isBotMode) {
        h2.innerText = `Level ${level}`;
    }

    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    gameFlash(randBtn);

    if (isBotMode) {
        setTimeout(() => {
            if (isBotMode) botPlay();
        }, 600);
    }
}

function botPlay() {
    let i = 0;
    botInterval = setInterval(() => {
        if (!isBotMode) {
            clearInterval(botInterval);
            botInterval = null;
            return;
        }

        if (i >= gameSeq.length) {
            clearInterval(botInterval);
            botInterval = null;
            setTimeout(() => {
                if (isBotMode) levelUp();
            }, 800);
            return;
        }

        let color = gameSeq[i];
        let btn = document.getElementById(color);
        userFlash(btn);
        userSeq.push(color);
        checkAns(userSeq.length - 1);
        i++;
    }, botSpeed);
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length == gameSeq.length && !isBotMode) {
            setTimeout(levelUp, 300);
        }
    } else {
        h2.innerHTML = `Game Over!<br>Your score was <b>${level}</b> <br> Press any key to start`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "white";
        }, 100);
        reset();
    }
}

function btnPress() {
    if (isBotMode) return;
    let btn = this;
    userFlash(btn);
    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    level = 0;
    gameSeq = [];
    userSeq = [];
    if (botInterval) {
        clearInterval(botInterval);
        botInterval = null;
    }
}
