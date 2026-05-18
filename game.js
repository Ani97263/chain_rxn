let currentPlayer = 1, isProcessing = false, timeLeft = 180;
let hasPlaced = { 1: false, 2: false };
let timerStarted = false;
let timerInterval;
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(timerInterval);
            checkWinCondition(true);
        }
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        document.getElementById('timer-display').textContent = `Time: ${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}
function updateTurnDisplay() {
    const indicator = document.getElementById('turn-indicator');
    const nameSpan = document.getElementById('player-name');
    
    if (currentPlayer === 1) {
        nameSpan.innerText = "Pink";
        nameSpan.style.color = "#FF69B4";
        indicator.className = "turn-pink";
    } else {
        nameSpan.innerText = "Orange";
        nameSpan.style.color = "#FF8C00";
        indicator.className = "turn-orange";
    }
}
async function handlePlayerMove(r, c) {
    if (isProcessing || (gameState[r][c].owner !== null && gameState[r][c].owner !== currentPlayer)) return;
    
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    isProcessing = true;
    hasPlaced[currentPlayer] = true;
    gameState[r][c].count++;
    gameState[r][c].owner = currentPlayer;
    updateCellView(r, c, gameState[r][c].count, currentPlayer);
    
    if (gameState[r][c].count >= getCapacity(r, c)) {
        await processExplosion(r, c);
        
    }
    isProcessing=false;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateTurnDisplay();
    checkWinCondition();
}
async function processExplosion(r, c) {
    let q = [{r, c}];
    while (q.length > 0) {
        let {r, c} = q.shift();
        if (gameState[r][c].count === 0) continue;
        gameState[r][c].count = 0;
        gameState[r][c].owner = null;
        updateCellView(r, c, 0, null);
        await new Promise(res => setTimeout(res, 250));
        
        for (let n of getNeighbors(r, c)) {
            gameState[n.r][n.c].count++;
            gameState[n.r][n.c].owner = currentPlayer;
            let displayCount = Math.min(gameState[n.r][n.c].count, capacity);
            updateCellView(n.r, n.c, displayCount, currentPlayer);
            if (gameState[n.r][n.c].count >= getCapacity(n.r, n.c)) q.push(n);
        }
    }
}

function checkWinCondition(isTimeUp = false) {
    let p1 = 0, p2 = 0;
    gameState.forEach(row => row.forEach(cell => { 
        if(cell.owner === 1) p1++; if(cell.owner === 2) p2++; 
    }));
    
    if (hasPlaced[1] && hasPlaced[2]) {
        if (isTimeUp) {
            if (p1 > p2) 
                endGame("Time Up: Pink Wins! ");
            else if (p2 > p1) 
                endGame("Time Up: Orange Wins! ");
            else 
                endGame("It's a Draw! ");
        } 
        else if (p1 === 0 || p2 === 0) {
            endGame((p1 > 0 ? "Pink" : "Orange") + " wins by wipeout! ");
        }
    }
}

function endGame(msg) {
    clearInterval(timerInterval);
    const overlay = document.getElementById('result-overlay');
    const message = document.getElementById('result-message');
    const box = document.getElementById('result-box');
    message.innerText = msg;
    if (msg.includes("Draw")) box.classList.add('draw-theme');
    else box.classList.remove('draw-theme');
    overlay.classList.remove('hidden');
    isProcessing = true;
}
function stopGame() {
    document.getElementById('result-overlay').classList.add('hidden');
    const hud = document.querySelector('.hud-container');
    if (hud) hud.style.display = 'none';
    document.getElementById('game-board').style.display = 'none';
    document.querySelector('h1').innerText = "Thanks for playing! ";
}
document.addEventListener("DOMContentLoaded", createGrid);
