const boardEl = document.getElementById('board');
const msgEl = document.getElementById('message');
const playerEl = document.getElementById('current-player');
const resetBtn = document.getElementById('reset');

let currentPlayer = 'X';
let rows = 15, cols = 15;
let boardState;

function initGame() {
  // центрируем начальное поле
  rows = cols = 15;
  boardState = Array.from({ length: rows }, () => Array(cols).fill(null));
  currentPlayer = 'X';
  playerEl.textContent = currentPlayer;
  msgEl.textContent = 'Ходит: ';
  renderBoard();
}

function renderBoard() {
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  boardEl.style.gridTemplateRows = `repeat(${rows}, 30px)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.textContent = boardState[r][c] || '';
      cell.addEventListener('click', onCellClick);
      boardEl.appendChild(cell);
    }
  }
}

function onCellClick(e) {
  const r = +e.target.dataset.r;
  const c = +e.target.dataset.c;
  if (boardState[r][c] || checkWin) return;

  boardState[r][c] = currentPlayer;
  expandIfNeeded(r, c);
  renderBoard();
  if (checkVictory(r, c)) {
    msgEl.textContent = `Победа: ${currentPlayer}!`;
    checkWin = true;
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  playerEl.textContent = currentPlayer;
}

let checkWin = false;

function expandIfNeeded(r, c) {
  const margin = 2;
  let expanded = false;

  if (r < margin) {
    // добавить строки сверху
    for (let i = 0; i < margin; i++) boardState.unshift(Array(cols).fill(null));
    rows += margin;
    r += margin;
    expanded = true;
  }
  if (r >= rows - margin) {
    // добавить снизу
    for (let i = 0; i < margin; i++) boardState.push(Array(cols).fill(null));
    rows += margin;
    expanded = true;
  }
  if (c < margin) {
    // добавить слева
    boardState.forEach(row => row.unshift(...Array(margin).fill(null)));
    cols += margin;
    c += margin;
    expanded = true;
  }
  if (c >= cols - margin) {
    // добавить справа
    boardState.forEach(row => row.push(...Array(margin).fill(null)));
    cols += margin;
    expanded = true;
  }
  if (expanded) {
    // ничего дополнительно не делаем: renderBoard учтёт новые размеры
  }
}

// проверка 5 подряд из точки (r,c)
function checkDirection(r, c, dr, dc) {
  let count = 1;
  // в прямом направлении
  for (let i = 1; i < 5; i++) {
    const nr = r + dr * i;
    const nc = c + dc * i;
    if (boardState[nr] && boardState[nr][nc] === currentPlayer) count++;
    else break;
  }
  // в обратном
  for (let i = 1; i < 5; i++) {
    const nr = r - dr * i;
    const nc = c - dc * i;
    if (boardState[nr] && boardState[nr][nc] === currentPlayer) count++;
    else break;
  }
  return count >= 5;
}

function checkVictory(r, c) {
  return (
    checkDirection(r, c, 1, 0) || // вертикаль
    checkDirection(r, c, 0, 1) || // горизонталь
    checkDirection(r, c, 1, 1) || // диагональ \ 
    checkDirection(r, c, 1, -1)   // диагональ /  
  );
}

resetBtn.addEventListener('click', () => {
  checkWin = false;
  initGame();
});

// старт
initGame();