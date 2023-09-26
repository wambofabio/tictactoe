// The Player factory function is responsible for creating player objects.
// It takes a name and a mark ('x' or 'o') as parameters and returns an object
// with those properties.
const Player = (name, mark) => {
  return { name, mark };
};

// The GameBoard module is an IIFE (Immediately Invoked Function Expression) that
// returns an object, exposing only the methods and properties that should be
// publicly accessible, thus encapsulating the internal state and implementation.
const GameBoard = (() => {
  //The board array represents the state of the game board. It is a private variable
  let board = Array(9).fill("");

  // The render function is responsible for rendering the game board on the page.
  // It creates and appends the individual cells to the board element.
  const render = () => {
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.textContent = cell;
      // Add an event listener to handle cell clicks and delegate to the Game module.
      cellElement.addEventListener("click", () => Game.handleCellClick(index));
      boardElement.appendChild(cellElement);
    });
  };

  // The setCell function tries to set a cell in the board array to the mark
  // of the current player. It returns true if successful, false otherwise.
  const setCell = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  // The reset function resets the state of the game board.
  const reset = () => {
    board = Array(9).fill("");
  };

  // Expose the public methods and properties of the GameBoard module.
  return { render, setCell, reset, getBoard: () => board };
})();

// The Game module is another IIFE that returns an object, encapsulating the game
// logic and maintaining the state related to the game itself.
const Game = (() => {
  //declare player variables within the module scope
  let player1, player2, currentPlayer;
  const initPlayers = () => {
    //retrieve player names from the input fields. if no name is provided, use default names
    const player1Name =
      document.getElementById("player1-name").value || "Player 1";
    const player2Name =
      document.getElementById("player2-name").value || "Player 2";

    // Initialize the player objects using the retrieved names
    player1 = Player(player1Name, "x");
    player2 = Player(player2Name, "o");
    //Set the intitial current player to player 1
    currentPlayer = player1;
  };

  // The handleCellClick function is the callback for the cell click event listener.
  // It delegates to the GameBoard to set the cell, checks for a winner or a draw,
  // and switches the current player.
  const handleCellClick = (index) => {
    if (GameBoard.setCell(index, currentPlayer.mark)) {
      GameBoard.render();
      if (checkForWinner()) {
        alert(`${currentPlayer.name} wins!`);
        GameBoard.reset();
        GameBoard.render();
        return;
      }
      if (checkForDraw()) {
        alert("It's a draw!");
        GameBoard.reset();
        GameBoard.render();
        return;
      }

      switchCurrentPlayer();
    }
  };

  // The switchCurrentPlayer function switches the current player.
  const switchCurrentPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  // The checkForWinner function checks the board array for winning combinations.
  // It returns true if there is a winner, false otherwise.
  const checkForWinner = () => {
    const board = GameBoard.getBoard();
    const winningCombinations = [
      //rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      //columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      //diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return board[index] === currentPlayer.mark;
      });
    });
  };

  // The checkForDraw function checks the board array for a draw.
  // It returns true if there is a draw, false otherwise.
  const checkForDraw = () => {
    const board = GameBoard.getBoard(); // Use the getter to access the board
    return board.every((cell) => {
      return cell !== "";
    });
  };

  // Expose the public methods and properties of the Game module.
  return { handleCellClick, initPlayers };
})();

//initial render
GameBoard.render();
