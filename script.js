const rows = document.querySelectorAll('[class^="row-"]');
const restartButton = document.querySelector('.restart')
const cellDivs = document.querySelectorAll('.cell')
const message = document.querySelector('.msg')

const gameboard = (function(){
  
  let boardarray =   [['-','-','-'],
                      ['-','-','-'],
                      ['-','-','-']];
  
  const getCurrentBoard = function(){
    const currentBoard = []

    for (let i=0; i<rows.length; i++){
  
    const cells = rows[i].querySelectorAll('div')
    const rowArray = []

    cells.forEach((cell) => {
    rowArray.push(cell.textContent)
    })
    currentBoard.push(rowArray);
    }
    return currentBoard;
  } 

  const updateBoard = function(){
    gameboard.boardarray = gameboard.getCurrentBoard();
  }

  const changeSquare = function(row, column, symbol){
    gameboard.boardarray[row][column] = symbol
  }

  const checkRowWin = function(){
    // set default to true conditions will falsify
    let winStatus = false;

    // full row
    for(let i = 0; i<gameboard.boardarray.length; i++){
      let rowSymbol = gameboard.boardarray[i][0]
      let winnerSymbol;
      for(let j = 1; j<gameboard.boardarray.length; j++){
        if (rowSymbol === '-') continue;
        else if(gameboard.boardarray[i][j] != rowSymbol){
          winStatus = false
          break;
        }
        else if(gameboard.boardarray[i][1] === rowSymbol && gameboard.boardarray[i][2] === rowSymbol) {
          winnerSymbol = rowSymbol
          return winnerSymbol
        }
      }
    }
    return winStatus;
  }

  const checkColumnWin = function(){
    let winStatus = false;
    let winnerSymbol;
    for(let i = 0; i<gameboard.boardarray.length; i++){
        const columnSymbol = gameboard.boardarray[0][i];
        if (columnSymbol === '-') continue; // Skip if the column is empty
        winStatus = true; // Assume win until proven otherwise
        for(let j = 1; j<gameboard.boardarray.length; j++){
            if(columnSymbol != gameboard.boardarray[j][i]){
                winStatus = false; // If any symbol is different, it's not a win
                break;
            }
        }
        if(winStatus){ // If winStatus is still true after checking the entire column
            winnerSymbol = columnSymbol; // Set the winning symbol
            return winnerSymbol;
        }
    }

    return winStatus; // Return the final win status
}

  const checkDiaganol1Win = function(){
    const diaganolSymbol = gameboard.boardarray[0][0];
    if(diaganolSymbol === '-') return false;
    for (let i = 1; i < gameboard.boardarray.length; i++){
      if(gameboard.boardarray[i][i] !== diaganolSymbol){
        return false;
      }
    }

    return diaganolSymbol;
  }

  const checkDiaganol2Win = function(){
    let winStatus = false;
    let winnerSymbol;
    const diaganolSymbol = gameboard.boardarray[0][2]
    if (diaganolSymbol === '-') return false;
    else if(diaganolSymbol === gameboard.boardarray[1][1] && diaganolSymbol === gameboard.boardarray[2][0]){
      winStatus = true;
      winnerSymbol = diaganolSymbol;
      return winnerSymbol;
    }
    return winStatus;
  }

  const checkWin = function(){
    const winChecks = [checkRowWin, checkColumnWin, checkDiaganol1Win, checkDiaganol2Win]

    for(let i = 0; i < winChecks.length; i++){
      if (winChecks[i]()) return winChecks[i]()
    }

    return false
  }

  const checkDraw = function(){
    let boardFull = true;
    gameboard.boardarray.forEach(row => {
      row.forEach(cell => {
        if (cell != 'x' && cell != 'o'){
          boardFull = false;
        }
      })
    })
    if(!checkWin()){
      return boardFull
    }
  }
      
  return {
    boardarray,
    changeSquare,
    checkRowWin,
    checkColumnWin,
    checkWin,
    checkDiaganol1Win,
    checkDiaganol2Win,
    getCurrentBoard,
    updateBoard,
    checkDraw
  }
})();

const player = function(symbol){

  const pickSquare = function(row, column){
    gameboard.changeSquare(row, column, symbol)
    console.log(gameboard.checkWin())
  }

  return {
    symbol,
    pickSquare
  }
}

const x = player('X');
const o = player('O');

// event listeners

let playerTurn = 'x'

rows.forEach((row) => {
  cells = row.querySelectorAll('div')
  cells.forEach(cell => {
    cell.addEventListener('click', (e) => {
      if (playerTurn == 'x' && e.target.textContent != 'o' && e.target.textContent != 'x' && !gameboard.checkWin()){
        e.target.textContent = 'x'
        playerTurn = 'o'
        gameboard.updateBoard()
        if(gameboard.checkWin()){
          message.textContent = `${gameboard.checkWin().toUpperCase()} has won press restart to play again`
          message.style.display = 'block'
        }
        if (gameboard.checkDraw() === true){
          message.textContent = 'Game is drawn! press restart to play again'
          message.style.display = 'block'
        }
      }
      else if(playerTurn == 'o' && e.target.textContent != 'o' && e.target.textContent != 'x' && !gameboard.checkWin()){
        e.target.textContent = 'o'
        playerTurn = 'x';
        gameboard.updateBoard()
        if(gameboard.checkWin()){
          message.textContent = `${gameboard.checkWin().toUpperCase()} has won press restart to play again`
          message.style.display = 'block'
        }
        if (gameboard.checkDraw() === true){
          message.textContent = 'Game is drawn! press restart to play again'
          message.style.display = 'block'
        }

      }
    })
  })
})

restartButton.addEventListener('click', (e) => {
  playerTurn = 'x'
  cellDivs.forEach(cell => {
    cell.textContent = '-'
  })
  message.textContent = ''
  message.style.display = 'none'
  gameboard.updateBoard();
})