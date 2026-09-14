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
let currentPiece;

let score = 0;
let level = 1;
let lines = 0;

let paused = false;
let gameOver = false;

let dropTimer = 0;

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
    currentPiece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(
                    currentPiece.x + x,
                    currentPiece.y + y,
                    value
                );
            }
        });
    });
}

// check collision
function isCollision() {
    for (let y = 0; y < currentPiece.matrix.length; y++) {
        for (let x = 0; x < currentPiece.matrix[y].length; x++) {

            if (!currentPiece.matrix[y][x]) {
                continue;
            }

            const boardX = currentPiece.x + x;
            const boardY = currentPiece.y + y;

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

// add piece to the board
function mergePiece() {
    currentPiece.matrix.forEach((row, y) => {
        row.forEach((value, x) => {

            if (value) {
                board[currentPiece.y + y][currentPiece.x + x] = value
            }
        });
    });
}

// remove completed lines
function clearLines() {
    let count = 0;

    for (let y = ROWS - 1; y >= 0; y--) {

        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLUMNS).fill(0));

            count++;
            y++;
        }
    }

    if (count > 0) {

        // line score
        const points = [0, 100, 300, 500, 800];

        score += points[count] * level;
        lines += count;

        level = Math.floor(lines / 10) + 1;

        document.getElementById("score").textContent =
            score.toLocaleString();
    }
}

// new falling piece
function newFallingPiece() {
    currentPiece = createPiece();

    if (isCollision()) {
        gameOver = true;
    }
}

// piece down
function dropPiece() {
    if (paused || gameOver) {
        return;
    }

    currentPiece.y++;

    if (isCollision()) {
        currentPiece.y--;

        mergePiece();
        clearLines();
        newFallingPiece();
    }
    dropTimer = 0;
}

// move left right
function movePiece(direction) {
    if (paused || gameOver) {
        return;
    }

    currentPiece.x += direction;

    if (isCollision()) {
        currentPiece.x -= direction;
    }
}

document.addEventListener("keydown", event => {

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        movePiece(-1);
    }
    else if (event.key === "ArrowRight") {
        event.preventDefault();
        movePiece(1);
    }
    else if (event.key === "ArrowDown") {
        event.preventDefault();
        dropPiece();
    }
    drawGame();
});

board = createBoard();
currentPiece = createPiece();
drawGame();
clearLines();