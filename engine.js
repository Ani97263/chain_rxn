const rows = 12, cols = 6;
let gameState = Array.from({ length: rows }, () => 
    Array.from({ length: cols }, () => ({ count: 0, owner: null })));

function getCapacity(r, c) {
    let n = 0;
    if (r > 0) n++; if (r < rows - 1) n++;
    if (c > 0) n++; if (c < cols - 1) n++;
    return n;
}

function getNeighbors(r, c) {
    let l = [];
    if (r > 0) l.push({r: r-1, c}); if (r < rows - 1) l.push({r: r+1, c});
    if (c > 0) l.push({r, c: c-1}); if (c < cols - 1) l.push({r, c: c+1});
    return l;
}
