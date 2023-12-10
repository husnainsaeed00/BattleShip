const gamesBoardContainer = document.querySelector("#gamesboard-container");
const flipButton = document.querySelector("#flip");
const optionContainer = document.querySelector(".option-container");
const startButton=document.querySelector("#start")
const info=document.querySelector('#info')
const turnDisplay=document.querySelector('#turn-display')
//Flipping Ships
let angle = 0;
function flip() {
  const optionShips = Array.from(optionContainer.children);
  angle = angle === 0 ? 90 : 0;
  optionShips.forEach((optionShip) => (optionShip.style.transform = `rotate(${angle}deg)`));
}

//creating Boards
const width = 10;
function createBoard(color, user) {
  const gameBoardContainer = document.createElement("div");
  gameBoardContainer.classList.add("game-board");
  gameBoardContainer.style.backgroundColor = color;
  gameBoardContainer.id = user;
  for (let i = 0; i < width * width; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = i;
    gameBoardContainer.append(block);
  }
  gamesBoardContainer.append(gameBoardContainer);
}
createBoard("yellow", "player");
createBoard("pink", "computer");

//creating Ships
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}
const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleShip = new Ship("battleShip", 4);
const carrier = new Ship("carrier", 5);

const ships = [destroyer, submarine, cruiser, battleShip, carrier];
let notDropped;

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
  let validStart = isHorizontal
    ? startIndex <= width * width - ship.length
      ? startIndex
      : width * width - ship.length
    : startIndex <= width * width - width * ship.length
    ? startIndex
    : startIndex - ship.length * width + width;

  let shipBlocks = [];
  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
    }
  }

  let valid = true;
  if (isHorizontal) {
    for (let index = 0; index < shipBlocks.length; index++) {
      if (shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1))) {
        valid = false;
        break;
      }
    }
  } else {
    for (let index = 0; index < shipBlocks.length; index++) {
      if (shipBlocks[0].id >= 90 + (width + index + 1)) {
        valid = false;
        break;
      }
    }
  }

  const notTaken = shipBlocks.every((shipBlock) => !shipBlock.classList.contains('taken'));

  return { shipBlocks, valid, notTaken };
}

function addShipPiece(user, ship, startId) {
  const allBoardBlocks = document.querySelectorAll(`#${user} div`);
  let randomBolean = Math.random() < 0.5;
  let isHorizontal = user === 'player' ? angle === 0 : randomBolean;
  let startIndex = startId ? startId : Math.floor(Math.random() * width * width);

  const { shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add('taken');
    });
  } else {
    if (user === 'computer') {
      addShipPiece(user, ship, startId);
    }
    if (user === 'player') {
      notDropped = true;
    }
  }
}
ships.forEach((ship) => addShipPiece('computer', ship));

// Drag Player ships
let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach(optionShip => optionShip.addEventListener("dragstart", dragStart));

const allPlayerBlocks = document.querySelectorAll("#player div");
allPlayerBlocks.forEach(playerBlock => {
  playerBlock.addEventListener('dragover', dragOver);
  playerBlock.addEventListener('drop', dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
}

function dragOver(e) {
  e.preventDefault();
  const ship = ships[draggedShip.id];
  highlightsArea(e.target.id, ship);
}

function dropShip(e) {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
  addShipPiece('player', ship, startId);
  if (!notDropped) {
    draggedShip.remove();
  }
}

// Add Highlights
function highlightsArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll('#player div');
  let isHorizontal = angle === 0;

  const { shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);
  if (valid && notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add('hover');
      setTimeout(() => {
        shipBlock.classList.remove('hover');
      }, 500);
    });
  }
}


let gameOver =false;
let playerTurn
//start game
function startGame(){
  // if(optionContainer.children.length!=0){
  //   info.textContent='please place all your pieces first';
  // }
  // else{
  //   const allPlayerBlocks=document.querySelectorAll('#computer div')
  //   allPlayerBlocks.forEach(block=>{
  //     block.addEventListener('click',handleClick)
  //   })
  // }
  
    if (optionContainer.children.length != 0) {
      info.textContent = 'Please place all your pieces first';
    } else {
      const allPlayerBlocks = document.querySelectorAll('#computer div')
      allPlayerBlocks.forEach(block => {
        block.addEventListener('click', handleClick)
      })
      info.textContent = "Your Turn!"
    }
  

  let playerHits=[]
  let computerHits=[]
  const playerSunkShips=[]
  const computerSunkShips=[]
  function handleClick(e){
    if(!gameOver){
      if(e.target.classList.contains('taken')){
        e.target.classList.add('boom')
        info.textContent="you Hit the computer ship!"
        let classes=Array.from(e.target.classList);
        classes= classes.filter(className=>className!=='block');
        classes= classes.filter(className=>className!=='boom');
        classes= classes.filter(className=>className!=='taken');
        playerHits.push(...classes);
        checkScore('player',playerHits,playerSunkShips);
      }
      if(e.target.classList.contains('taken')){
        info.textContent="Nothing hit this time"
        e.target.classList.add('empty')
      }
      playerTurn=false;
      const allBoardBlocks=document.querySelectorAll("#computer div")
      allBoardBlocks.forEach(block=>block.replaceWith(block.cloneNode(true)))
      setTimeout(computerGo,3000)
    } 

    
  }

  // Your existing code...

function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = 'computer Go!';
    info.textContent = "The computer is Thinking....";

    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * width * width);
      const allBoardBlocks = document.querySelectorAll("#player div");

      // Update the logic to check the class conditions without using 'e'
      if (allBoardBlocks[randomGo].classList.contains('taken') &&
        allBoardBlocks[randomGo].classList.contains("boom")) {
        computerGo();
        return;
      } else if (allBoardBlocks[randomGo].classList.contains('taken') &&
        !allBoardBlocks[randomGo].classList.contains("boom")) {
        allBoardBlocks[randomGo].classList.add("boom");
        info.textContent = "The computer hit your ship";
        
        // Removed reference to 'e' and directly fetched classes from the element
        let classes = Array.from(allBoardBlocks[randomGo].classList);
        classes = classes.filter(className => className !== 'block');
        classes = classes.filter(className => className !== 'boom');
        classes = classes.filter(className => className !== 'taken');
        computerHits.push(...classes);
        checkScore('computer', computerHits, computerSunkShips);
      } else {
        info.textContent = "Nothing hit this time.";
        allBoardBlocks[randomGo].classList.add('empty');
      }
    }, 3000);

    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = "Your Go!";
      info.textContent = "please take your Turn";
      const allBoardBlocks = document.querySelectorAll("#computer div");
      allBoardBlocks.forEach(block => block.addEventListener("click", handleClick));
    }, 6000);
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


// Rest of your code...

}

function checkScore(user,userHits,userSunkShips){

  function checkShip(shipName,shipLength){
    if(userHits.filter(storedShipName=>storedShipName===shipName).length===shipLength){
      info.textContent=`You sunk the ${user}'s ${shipName}`
    }
  }
  checkShip('destroyer',2)
  checkShip('submarine',3)
  checkShip('cruiser',3)
  checkShip('battleship',4)
  checkShip('carrier',5)
}


//DOM Manipulation `You sunk the ${user}`
flipButton.addEventListener("click", flip);
startButton.addEventListener('click',startGame)