let currentPlayer = 1, isProcessing = false, timeLeft = 180;
let hasPlaced = { 1: false, 2: false };

let timerInterval; 

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        document.getElementById('timer-display').textContent = 
            `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) checkWinCondition(true);
    }, 1000);
}
async function handlePlayerMove(r, c) {
    if (isProcessing || (gameState[r][c].owner !== null && gameState[r][c].owner !== currentPlayer)) return;
    
    hasPlaced[currentPlayer] = true;
    gameState[r][c].count++; gameState[r][c].owner = currentPlayer;
    updateCellView(r, c, gameState[r][c].count, currentPlayer);
    
    if (gameState[r][c].count >= getCapacity(r, c)) {
        isProcessing = true;
        await processExplosion(r, c);
        isProcessing = false;
    }
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    checkWinCondition();
}

async function processExplosion(r, c) {
    let q = [{r, c}];
    while (q.length > 0) {
        let {r, c} = q.shift();
        gameState[r][c].count = 0; gameState[r][c].owner = null;
        updateCellView(r, c, 0, null);
        await new Promise(r => setTimeout(r, 300));
        getNeighbors(r, c).forEach(n => {
            gameState[n.r][n.c].count++; gameState[n.r][n.c].owner = currentPlayer;
            updateCellView(n.r, n.c, gameState[n.r][n.c].count, currentPlayer);
            if (gameState[n.r][n.c].count >= getCapacity(n.r, n.c)) q.push(n);
        });
    }
}

function checkWinCondition(isTimeUp = false) {
    let p1 = 0, p2 = 0;
    gameState.forEach(row => row.forEach(cell => { if(cell.owner === 1) p1++; if(cell.owner === 2) p2++; }));
    
    // Only check win if both have moved, or if time has run out
    if (hasPlaced[1] && hasPlaced[2]) {
        if (isTimeUp) {
            endGame(p1 > p2 ? "Time Up: Pink Wins!" : "Time Up: Orange Wins!");
        } else if (p1 === 0 || p2 === 0) {
            endGame((p1 > 0 ? "Pink" : "Orange") + " wins by wipeout!");
        }
    }
}

function endGame(msg) {
    // Stop the timer
    clearInterval(timerInterval);
    
    // Get the elements
    const overlay = document.getElementById('result-overlay');
    const message = document.getElementById('result-message');
    
    // Set the message and show the box
    message.innerText = msg;
    overlay.classList.remove('hidden');
    
    // Stop any further clicking
    isProcessing = true;
}

document.addEventListener("DOMContentLoaded", () => { createGrid(); startTimer(); });
