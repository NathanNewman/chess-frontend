export function toAlgebraicNotation(row, col) {
  const cols = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const rows = ["8", "7", "6", "5", "4", "3", "2", "1"];
  return cols[col] + rows[row];
}

export function getRandomBoolean() {
  return Math.random() < 0.5;
}

export function addConsecutiveNumbers(arr) {
  const newArr = [];
  for (let str of arr) {
    let output = "";
    let currentNumber = 0;

    for (let i = 0; i < str.length; i++) {
      const num = parseInt(str[i]);

      if (!isNaN(num)) {
        currentNumber = currentNumber + num;
      } else {
        if (currentNumber > 0) {
          output = output + String(currentNumber);
          currentNumber = 0; // Reset currentNumber for the next sequence of digits
        }
        output = output + str[i];
      }
    }

    // Handle the case where the last character(s) is a number
    if (currentNumber > 0) {
      output = output + String(currentNumber);
    }

    newArr.push(output);
  }
  return newArr;
}

export function countPieces(board) {
  const pieceCounts = {
    P: 0,
    N: 0,
    B: 0, 
    R: 0, 
    Q: 0, 
    K: 0, 
    p: 0, 
    n: 0, 
    b: 0, 
    r: 0,
    q: 0,
    k: 0,
  };

  for (const row of board) {
    for (const piece of row) {
      if (piece) {
        // Increment the count for the corresponding piece type
        pieceCounts[piece]++;
      }
    }
  }

  return pieceCounts;
}

// Function to compare the piece counts with the starting pieces and determine which pieces are missing
export function findMissingPieces(board) {
  const pieceCounts = countPieces(board);
  const missingPieces = {};
  // Define the starting piece counts as constants or in an object
  const startingPieceCounts = {
    P: 8,
    N: 2,
    B: 2,
    R: 2,
    Q: 1,
    K: 1,
    p: 8,
    n: 2,
    b: 2,
    r: 2,
    q: 1,
    k: 1,
  };

  for (const piece in startingPieceCounts) {
    const missingCount = startingPieceCounts[piece] - pieceCounts[piece];
    if (missingCount > 0) {
      missingPieces[piece] = missingCount;
    }
  }

  return missingPieces;
}

export function adjustDifficulty(elo) {
  if(elo < 500) return '1';
  if(elo < 1000) return '2';
  if(elo < 1250) return '3';
  if(elo < 1500) return '4';
  if(elo < 1750) return '5';
  if(elo < 2000) return '6';
  if(elo < 2075) return '7';
  if(elo < 2150) return '8';
  if(elo < 2225) return '9';
  if(elo < 2300) return '10';
  if(elo < 2375) return '11';
  if(elo < 2450) return '12';
  if(elo < 2500) return '13';
  if(elo < 2550) return '14';
  if(elo < 2600) return '15';
  if(elo < 2650) return '16';
  if(elo < 2700) return '17';
  if(elo < 2750) return '18';
  if(elo < 2800) return '19';
  return '20';
}
