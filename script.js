const boardElement = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const restartButton = document.getElementById("restart");
const themeToggle = document.getElementById("theme-toggle");

let board = ["", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function updateStatus(message, mark = currentPlayer) {
  status.textContent = message;
  status.dataset.mark = mark;
}

function handleBoardClick(event) {
  const cell = event.target.closest(".cell");

  // Click was not on one of the 9 cells
  if (!cell) return;

  const index = Number(cell.dataset.index);

  // Game has already ended
  if (!gameActive) return;

  // Cell is already occupied
  if (board[index] !== "") return;

  // Place move
  board[index] = currentPlayer;

  cell.textContent = currentPlayer;
  cell.dataset.mark = currentPlayer;

  checkGameResult();
}

function checkGameResult() {
  // Check winner
  for (const [a, b, c] of winningCombinations) {
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;

      const winner = board[a];

      updateStatus(`Player ${winner} wins!`, winner);

      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");

      return;
    }
  }

  // Draw ONLY after all 9 cells are occupied
  const movesPlayed = board.filter((value) => value !== "").length;

  if (movesPlayed === 9) {
    gameActive = false;
    updateStatus("It's a draw!", "");
    return;
  }

  // Continue game
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  updateStatus(`Player ${currentPlayer}'s turn`, currentPlayer);
}

function restartGame() {
  board = ["", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("win");
    delete cell.dataset.mark;

    // IMPORTANT:
    // Never disable the cells.
    cell.disabled = false;
  });

  updateStatus("Player X's turn", "X");
}

// One click listener for the entire board.
// This guarantees every cell is handled consistently.
boardElement.addEventListener("click", handleBoardClick);

// Restart
restartButton.addEventListener("click", restartGame);

// Theme
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("ttt-theme", theme);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", theme === "dark");
  }
}

const savedTheme = localStorage.getItem("ttt-theme") || "dark";

applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    applyTheme(currentTheme === "dark" ? "light" : "dark");
  });
}
