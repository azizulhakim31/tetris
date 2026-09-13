const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COLUMNS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const colors = [
    null,
    "rgb(34, 211, 238)",
    "rgb(253, 224, 71)",
    "rgb(167, 139, 250)",
    "rgb(52, 211, 153)",
    "rgb(251, 113, 133)",
    "rgb(96, 165, 250)",
    "rgb(251, 146, 60)"
];

const pieces = [
    [[1, 1, 1, 1]],
    [[2, 2], [2, 2]],
    [[0, 3, 0], [3, 3, 3]],
    [[0, 4, 4], [4, 4, 0]],
    [[5, 5, 0], [0, 5, 5]],
    [[6, 0, 0], [6, 6, 6]],
    [[0, 0, 7], [7, 7, 7]]
];

let board;
let piece;

let score = 0;

let paused = false;
let gameOver = false;

// create an empty board
function createBoard() {
    return Array.from(
        { length: ROWS },
        () => Array(COLUMNS).fill(0)
    );
}

// create a random piece
function createPiece() {
    const index = Math.floor(Math.random() * pieces.length);

    return {
        matrix: pieces[index].map(row => [...row]),
        x: 4, y: 0
    };
}

// draw one block
function drawBlock(x, y, value) {
    ctx.fillStyle = colors[value];
    ctx.fillRect(
        x * BLOCK_SIZE + 2,
        y * BLOCK_SIZE + 2,
        BLOCK_SIZE - 4,
        BLOCK_SIZE - 4
    );
}

// draw board and current piece
function drawGame() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // fixed blocks
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(x, y, value);
            }
        });
    });

    // falling piece
    piece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(
                    piece.x + x,
                    piece.y + y,
                    value
                );
            }
        });
    });
}

// check collision
function isCollision() {
    for (let y = 0; y < piece.matrix.length; y++) {
        for (let x = 0; x < piece.matrix[y].length; x++) {

            if (!piece.matrix[y][x]) {
                continue;
            }

            const boardX = piece.x + x;
            const boardY = piece.y + y;

            // check walls and floor
            if (boardX < 0 || boardX >= COLUMNS || boardY >= ROWS) {
                return true;
            }

            // check existing blocks
            if (boardY >= 0 && board[boardY][boardX]) {
                return true;
            }
        }
    }
    return false;
}

createBoard();
createPiece();
drawGame();