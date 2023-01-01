// store game status to access later
const statusDisplay = document.querySelector('.game-status');
const cells = document.querySelectorAll('.cell');
// Declare variables used to track game status

let gameActive = true;
let currentPlayer = 'X';
// store current game state to track cells played and be able to validate later
let gameState = ['', '', '', '', '', '', '', '', ''];

const strike = document.getElementById('strike');

// All possible wiining combinations
const winningCombinations = [
   { combo: [0, 1, 2], strikeClass: 'strike-row-1' },
   { combo: [3, 4, 5], strikeClass: 'strike-row-2' },
   { combo: [6, 7, 8], strikeClass: 'strike-row-3' },
   { combo: [0, 3, 6], strikeClass: 'strike-column-1' },
   { combo: [1, 4, 7], strikeClass: 'strike-column-2' },
   { combo: [2, 5, 8], strikeClass: 'strike-column-3' },
   { combo: [0, 4, 8], strikeClass: 'strike-diagonal-1' },
   { combo: [2, 4, 6], strikeClass: 'strike-diagonal-2' },
];

// Messages to display during the game within functions to call when the time comes
const winningMessage = () => `Player ${currentPlayer} has Won!`;
const drawMessage = () => `It's a Tie!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

function setHoverText() {
    //remove all hover text
    cells.forEach((cell) => {
      cell.classList.remove("x-hover");
      cell.classList.remove("o-hover");
    });
//   add hover class based on player
    const hoverClass = `${currentPlayer.toLowerCase()}-hover`;
//   add hover text if cell does not contain text
    cells.forEach((cell) => {
      if (cell.innerText == "") {
        cell.classList.add(hoverClass);
      }
    });
  }

setHoverText();

// Start game with message stating who's turn it is
statusDisplay.innerHTML = currentPlayerTurn();
function handleCellPlayed(clickedCell, clickedCellIndex) {
    // update game status to show the cell clicked and update the game board
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++){
        for (const winCondition of winningCombinations) {
        const { combo, strikeClass } = winCondition
        let a = gameState[combo[0]];
        let b = gameState[combo[1]];
        let c = gameState[combo[2]];
        if(a === '' || b === '' || c === ''){
            continue;
        }
        if(a === b && b === c) {
            roundWon = true;
            strike.classList.add(strikeClass)
            break
        }
    }
    }
    if(roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }
    let roundDraw = !gameState.includes('');
    if(roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
    // save clicked cell in variable for easy use 
    const clickedCell = clickedCellEvent.target;
    // grab data-cell-index in the clicked cell to indetify the cell in the grid
    // parse Int to change get attribute string into a number
    const clickedCellIndex = parseInt(
        clickedCell.getAttribute('data-cell-index')
    );
    // check if call has already been played or if game is paused, if so ignore click
    if(gameState[clickedCellIndex] !== '' || !gameActive){
        return;
    }
    // If ok to proceed continue game
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
    setHoverText()
}

// Restart the game by setting evertyhing back to deafults
function handleRestartGame() {
    gameActive = true;
    strike.className = 'strike';
    currentPlayer = 'X'
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
    setHoverText()
}

// add event listeners to game cells and restart
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game-restart').addEventListener('click', handleRestartGame);