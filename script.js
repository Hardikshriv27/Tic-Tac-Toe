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
  [2, 4, 6]
];

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.dataset.mark = currentPlayer;
  cell.disabled = true;

  checkGameResult();
}

function checkGameResult() {
  for (const [a, b, c] of winningCombinations) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      status.textContent = `Player ${board[a]} wins!`;
      status.dataset.mark = board[a];
      gameActive = false;
      [a, b, c].forEach((i) => cells[i].classList.add("win"));
      cells.forEach((cell) => (cell.disabled = true));
      return;
    }
  }

  if (!board.includes("")) {
    status.textContent = "It's a draw!";
    status.dataset.mark = "";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  status.textContent = `Player ${currentPlayer}'s turn`;
  status.dataset.mark = currentPlayer;
}

function restartGame() {
  board = ["", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  status.textContent = "Player X's turn";
  status.dataset.mark = "X";

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = false;
    delete cell.dataset.mark;
    cell.classList.remove("win");
  });
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

restartButton.addEventListener("click", restartGame);
status.dataset.mark = "X";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("ttt-theme", theme);
  themeToggle.setAttribute("aria-pressed", theme === "dark");
}

const savedTheme = localStorage.getItem("ttt-theme") || "dark";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});
