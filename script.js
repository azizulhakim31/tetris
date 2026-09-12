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

function createBoard() {
    return Array.from(
        { length: ROWS },
        () => Array(COLUMNS).fill(0)
    );
}

function createPiece() {
    const index = Math.floor(Math.random() * pieces.length);

    return {
        matrix: pieces[index].map(row => [...row]),
        x: 4, y: 0
    };
}

function drawBlock(context, x, y, value, size) {
    context.fillStyle = colors[value];
    context.fillRect(
        x * size + 2,
        y * size + 2,
        size - 4,
        size - 4
    );
}

createBoard();
createPiece();