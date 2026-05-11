function createGrid() {
    const board = document.getElementById('game-board');
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.r = r; cell.dataset.c = c;
            cell.addEventListener('click', () => handlePlayerMove(r, c));
            board.appendChild(cell);
        }
    }
}

function updateCellView(r, c, count, owner) {
    const cell = document.querySelector(`[data-r="${r}"][data-c="${c}"]`);
    cell.innerHTML = "";
    cell.className = `cell ${owner ? 'player-'+owner : ''}`;
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('span');
        heart.innerHTML = "♥";
        cell.appendChild(heart);
    }
}