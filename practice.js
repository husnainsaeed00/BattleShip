function handleClick(e) {
    if (!gameOver) {
      if (e.target.classList.contains('taken')) {
        if (e.target.classList.contains('boom')) {
          info.textContent = "You've already hit this spot!";
        } else {
          e.target.classList.add('boom');
          info.textContent = "You hit the computer's ship!";
          
          // Extract ship name from the clicked block's classes
          let classes = Array.from(e.target.classList);
          classes = classes.filter(className => className !== 'block');
          classes = classes.filter(className => className !== 'boom');
          classes = classes.filter(className => className !== 'taken');
  
          playerHits.push(...classes);
          checkScore('player', playerHits, playerSunkShips);
        }
      } else {
        info.textContent = "Nothing hit this time";
        e.target.classList.add('empty');
      }
      playerTurn = false;
  
      // Rest of your code for computer's turn and game progression...
    }
  }
  
  function checkScore(user, userHits, userSunkShips) {
    function checkShip(shipName, shipLength) {
      const shipHits = userHits.filter(storedShipName => storedShipName === shipName);
      if (shipHits.length === shipLength) {
        info.textContent = `You sunk the ${user}'s ${shipName}`;
        // Add the sunk ship to the array of sunk ships
        userSunkShips.push(shipName);
        // Check if all ships of the user are sunk to end the game
        if (userSunkShips.length === ships.length) {
          gameOver = true;
          info.textContent = `Congratulations! You've sunk all ${user}'s ships. You win!`;
          // Additional logic to handle game end
        }
      }
    }
    checkShip('destroyer', 2);
    checkShip('submarine', 3);
    checkShip('cruiser', 3);
    checkShip('battleShip', 4); // Adjusted ship name to match the class name
    checkShip('carrier', 5);
  }
  // ... (Previous code remains unchanged)

let gameOver = false;
let playerTurn = true;

function startGame() {
  if (optionContainer.children.length != 0) {
    info.textContent = 'Please place all your pieces first';
  } else {
    const allPlayerBlocks = document.querySelectorAll('#computer div')
    allPlayerBlocks.forEach(block => {
      block.addEventListener('click', handleClick)
    })
    info.textContent = "Your Turn!"
  }
}

function handleClick(e) {
  if (!gameOver && playerTurn) {
    if (e.target.classList.contains('taken')) {
      if (e.target.classList.contains('boom')) {
        info.textContent = "You've already hit this spot!";
      } else {
        e.target.classList.add('boom');
        info.textContent = "You hit the computer's ship!";
        let classes = Array.from(e.target.classList);
        classes = classes.filter(className => className !== 'block');
        classes = classes.filter(className => className !== 'boom');
        classes = classes.filter(className => className !== 'taken');
        playerHits.push(...classes);
        checkScore('player', playerHits, playerSunkShips);
      }
    } else {
      info.textContent = "Nothing hit this time";
      e.target.classList.add('empty');
    }
    playerTurn = false;
    setTimeout(computerGo, 2000);
  }
}

function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = "Computer's Turn";
    info.textContent = "The computer is thinking...";
    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * width * width);
      const allBoardBlocks = document.querySelectorAll("#player div");
      if (allBoardBlocks[randomGo].classList.contains('taken') &&
        allBoardBlocks[randomGo].classList.contains("boom")) {
        computerGo();
        return;
      } else if (allBoardBlocks[randomGo].classList.contains('taken') &&
        !allBoardBlocks[randomGo].classList.contains("boom")) {
        allBoardBlocks[randomGo].classList.add("boom");
        info.textContent = "The computer hit your ship";
        let classes = Array.from(allBoardBlocks[randomGo].classList);
        classes = classes.filter(className => className !== 'block');
        classes = classes.filter(className => className !== 'boom');
        classes = classes.filter(className => className !== 'taken');
        computerHits.push(...classes);
        checkScore('computer', computerHits, computerSunkShips);
      } else {
        info.textContent = "The computer missed this time.";
        allBoardBlocks[randomGo].classList.add('empty');
      }
      playerTurn = true;
      turnDisplay.textContent = "Your Turn!";
    }, 2000);
  }
}

// ... (Rest of the code remains unchanged)

// Start the game
startButton.addEventListener('click', startGame);

// Rest of your code...
