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

function updateStatus(text, mark = currentPlayer) {
  status.textContent = text;
  status.dataset.mark = mark;
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  // Ignore clicks after the game ends
  if (!gameActive) return;

  // Ignore already occupied cells
  if (board[index] !== "") return;

  // Place the move
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.dataset.mark = currentPlayer;

  checkGameResult();
}

function checkGameResult() {
  // Check for winner
  for (const [a, b, c] of winningCombinations) {
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;

      updateStatus(`Player ${board[a]} wins!`, board[a]);

      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");

      return;
    }
  }

  // IMPORTANT:
  // Draw is possible ONLY when all 9 cells are filled.
  const filledCells = board.filter((cell) => cell !== "").length;

  if (filledCells === 9) {
    gameActive = false;
    updateStatus("It's a draw!", "");
    return;
  }

  // Continue the game
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  updateStatus(`Player ${currentPlayer}'s turn`, currentPlayer);
}

function restartGame() {
  board = ["", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  updateStatus("Player X's turn", "X");

  cells.forEach((cell) => {
    cell.textContent = "";
    delete cell.dataset.mark;
    cell.classList.remove("win");

    // Make absolutely sure every cell can receive clicks
    cell.disabled = false;
  });
}

// Attach click handlers to all 9 cells
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

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
