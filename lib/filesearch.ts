import { Input } from "postcss";
import { words } from "./words";
import { refinedWords } from "./refinedWords";
//import { tiles, setTiles, row } from "/Users/bigchungus/my-app/pages/index";
//import { guess } from "./index";

//var numLetters;
//let guess;
var possibleWords: unknown;
//var textByLine;
var unscoredLetters: Array<string> = [];
export let gameWon: boolean = false;
let tries: number = 6;
//let testOutput: Array<string>;
let chosenWord: string;
let indexesToBeScored: Array<number> = [];
let lettersToBeScored: Array<string> = [];
//export let charsOnKeyboard: Array<string> = []; 
let indexesToBeScoredIncrement: Number;


// I need to take in guesses                          MOSTLY DONE
// I need to check for validity on guess input        DONE?
// I need the array to behave properly                MOSTLY DONE
// I need to be able to color the squares
// I need to fix this .length problem



// function sortWordsByLength(length: Number) {
//   possibleWords = words.filter ( (words, index, arr) => {
//     arr[index + 1] += ' extra'
//     console.log("sortWordByLength works");
//     return words.length == length;
//   })
// }

function getRandomWord(inputWords) {
  return inputWords[Math.floor(Math.random() * inputWords.length)];
}

function refillUnscoredLetters(chosenWord) {
  // for (let charInWord = 0; charInWord < chosenWord.length; charInWord++) {
  //   unscoredLetters.push(chosenWord[charInWord]);
  // }
  console.log(chosenWord);
  console.log(unscoredLetters);
  unscoredLetters = unscoredLetters.splice(0, unscoredLetters.length);
  for (let charInWord = 0; charInWord < chosenWord.length; charInWord++) {
    unscoredLetters[charInWord] = chosenWord[charInWord];
  }
  console.log(unscoredLetters);
}

export function arrMessWith(v: String[][], row, won: boolean) {
  console.log("arrMessWith called");
  console.log(indexesToBeScored);
  console.log(lettersToBeScored);
  for (let i = 0; i < indexesToBeScored.length; i++) {
    v[row][indexesToBeScored[i]] = lettersToBeScored[i];
    console.log('An attempt was made');
  }
  if (won) v.push(["won"]);
  return v;
}

function emptyScoredLetters() {
  indexesToBeScored.splice(0, 100);
  lettersToBeScored.splice(0, 100);
  indexesToBeScoredIncrement = 0;
}

export function isGuessValid(guess) {
  console.log(words.indexOf(guess));
  return (words.indexOf(guess) != -1);
}

function isLetterPresent(letter): boolean {
  return (unscoredLetters.indexOf(letter) != -1)
}

function hasIndexBeenScored (index): boolean {
  return (indexesToBeScored.indexOf(index) != -1);
}

function removeLetter(letter) {
  unscoredLetters.splice(unscoredLetters.indexOf(letter), 1)
  console.log(unscoredLetters);
  console.log("a letter has been removed");
}

function checkForGreenLetters(chosenWord, guess) {
  console.log("tried checkForGreenLetters")
  for (let charPosInGuess = 0; charPosInGuess < guess.length; charPosInGuess++) {
    if (guess[charPosInGuess] == chosenWord[charPosInGuess] && isLetterPresent(guess[charPosInGuess])) {
      scoreLetters(guess[charPosInGuess], charPosInGuess, ":g");
      removeLetter(guess[charPosInGuess]);
      console.log("called checkForGreenLetters");
    }
  }
}

function checkForYellowLetters(chosenWord, guess) {
  console.log("tried checkForYellowLetters")
  for (let charPosInChosenWord = 0; charPosInChosenWord < chosenWord.length; charPosInChosenWord++) {
    for (let  charPosInGuess= 0; charPosInGuess < guess.length; charPosInGuess++) {
      if ( (guess[charPosInGuess] == chosenWord[charPosInChosenWord]) && hasIndexBeenScored(charPosInGuess) == false && (isLetterPresent(guess[charPosInGuess]) == true) ) {
        scoreLetters(guess[charPosInGuess], charPosInGuess, ":y");
        removeLetter(guess[charPosInGuess]);
        console.log("called checkForYellowLetters")
      }
    }
  }
}

function scoreLetters(letter: string, position: Number, color: string) {
    
  //somehow i need to be able to set these tiles
  let coloredLetter: string = letter + color;
  console.log(position, letter, color);
  console.log("scoreLetters Called");
  //@ts-ignore
  indexesToBeScored[indexesToBeScoredIncrement] = position;
  //@ts-ignore
  lettersToBeScored[indexesToBeScoredIncrement] = coloredLetter;
  //@ts-ignore
  indexesToBeScoredIncrement++;
}


//call on selection of number of letters

export function startGame(numLetters: Number) {
  //gets the random word
  //chosenWord = getRandomWord(sortWordsByLength(numLetters));
  possibleWords = refinedWords.filter((Element) => {
    return Element.length == numLetters;
  })
  chosenWord = getRandomWord(possibleWords)//.toLowerCase;
}

// function win(squares, row) {
//   for (let i = 0; i < indexesToBeScored.length; i++) {
//     squares[row][indexesToBeScored[i]] = lettersToBeScored[i];
//   }
//   squares[row].push("won")
//   return squares;
// }

//call on valid guess entered
export function doRound(guess: string, tiles: String[][], row: number): String[][] {

  if (guess == chosenWord) gameWon = true;   
  console.log(gameWon);
  if(tries > 0) {
    refillUnscoredLetters(chosenWord);
    emptyScoredLetters();
    tries--;
    checkForGreenLetters(chosenWord, guess);
    checkForYellowLetters(chosenWord, guess);
    console.log(chosenWord, guess);
    if (gameWon == true) {
      return arrMessWith(tiles, row, true)
    }else {
      return arrMessWith(tiles, row, false);
    }
  }
  
  
   
}


/*
function colorLetters(guess, selectedWord) {
    for (let i = 0; i < numLetters; i++) {
      let letterShouldBeYellow = false;
      for (let j = 0; j < numLetters; j++) {
        if (guess[i] == selectedWord[j]) {
          letterShouldBeYellow = true;
        }
      }
      if (guess[i] == selectedWord[i]) {
        //code to make letter green goes here
      }else if (letterShouldBeYellow == true) {
        //code to make letter yellow goes here
      }else {
        //code to do nothing goes here
      }
    }
}

function turn(possibleWords, guess) {
    //guess = 
    if (possibleWords.findIndex(guess) != -1) {
      colorLetters(guess, selectedWord);
    }
}

prepareArray();
getNumLetters();
sortWordsByLength(numLetters, textByLine);
getRandomWord(possibleWords);
getGuess();
turn(possibleWords, guess);







*////////// 


