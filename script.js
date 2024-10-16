document.getElementById('solveForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const N = parseInt(formData.get('N'));

    if (isNaN(N) || N <= 0) {
        alert('Please enter a positive integer for board size.');
        return;
    }

    solveNQueens(N);
});

async function solveNQueens(N) {
    let board = [];
    for (let i = 0; i < N; i++) {
        board[i] = [];
        for (let j = 0; j < N; j++) {
            board[i][j] = 0;
        }
    }

    await solveNQueensHelper(board, 0, N);
}

async function solveNQueensHelper(board, row, N) {
    const solutionElement = document.getElementById('solution');
    solutionElement.innerHTML = '';

    if (row >= N) {
        displayBoard(board);
        return true; // All queens are placed
    }

    for (let col = 0; col < N; col++) {
        board[row][col] = 1;
        displayBoard(board);

        await new Promise(resolve => setTimeout(resolve, 500));

        if (isSafe(board, row, col) && await solveNQueensHelper(board, row + 1, N)) {
            markCorrectCell(row, col);
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        } else {
            if (!isSafe(board, row, col)) {
                blinkCell(row, col);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        board[row][col] = 0;
        displayBoard(board);
    }

    return false; // No solution exists for current configuration
}

function isSafe(board, row, col) {
    const N = board.length;

    for (let i = 0; i < row; i++) {
        if (board[i][col]) return false; // Check column
        if (board[i][col - (row - i)] || board[i][col + (row - i)]) return false; // Check diagonals
    }

    return true;
}

function displayBoard(board) {
    const boardSize = board.length;
    const solutionElement = document.getElementById('solution');
    solutionElement.innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
        const boardRow = document.createElement('div');
        boardRow.classList.add('board-row');
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if ((i + j) % 2 === 0) {
                cell.style.backgroundColor = '#61dafb'; // Light square color
            } else {
                cell.style.backgroundColor = '#21a1f1'; // Dark square color
            }
            if (board[i][j]) {
                cell.classList.add('queen');
                cell.textContent = 'Q';
            }
            boardRow.appendChild(cell);
        }
        solutionElement.appendChild(boardRow);
    }
}

function markCorrectCell(row, col) {
    const cells = document.querySelectorAll('.board-row')[row].querySelectorAll('.cell');
    const cell = cells[col];
    cell.style.backgroundColor = '#5cb85c'; // Green color for correct position
}

function blinkCell(row, col) {
    const cells = document.querySelectorAll('.board-row');

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i].children[col];
        if (cell.classList.contains('queen')) {
            cell.style.backgroundColor = '#d9534f'; // Red color for blinking
        }
    }

    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells.length; j++) {
            if (i !== row && (j === col || Math.abs(row - i) === Math.abs(col - j))) {
                const cell = cells[i].children[j];
                if (cell.classList.contains('queen')) {
                    cell.style.backgroundColor = '#d9534f'; // Red color for diagonal conflicts
                }
            }
        }
    }

    setTimeout(() => {
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i].children[col];
            if (cell.classList.contains('queen')) {
                cell.style.backgroundColor = ((row + col) % 2 === 0) ? '#61dafb' : '#21a1f1'; // Revert to original background color
            }
        }

        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells.length; j++) {
                if (i !== row && (j === col || Math.abs(row - i) === Math.abs(col - j))) {
                    const cell = cells[i].children[j];
                    if (cell.classList.contains('queen')) {
                        cell.style.backgroundColor = ((i + j) % 2 === 0) ? '#61dafb' : '#21a1f1'; // Revert to original background color for diagonal conflicts
                    }
                }
            }
        }
    }, 500);
}
