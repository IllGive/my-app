import { Input } from "postcss";
import { words } from "./words";
import { refinedWords } from "./refinedWords";
import Randoma from 'randoma';


const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
const yyyy = today.getFullYear();

const dateSeed = dd + mm + yyyy;
//const dateSeed = 27032022;
export let gameWon: boolean = false;
export let chosenWord: string;
var possibleWords: unknown;
let tries: number = 6;
let indexesToBeScoredIncrement: Number;
var unscoredLetters: Array<string> = [];
let indexesToBeScored: Array<number> = [];
let lettersToBeScored: Array<string> = [];
let greenLetters: Array<string> = [];
let yellowLetters: Array<string> = [];
let blackLetters: Array<string> = [];


function getRandomWord(inputWords, dailyMode: boolean) {
  if (!dailyMode) {
    return inputWords[Math.floor(Math.random() * inputWords.length)];
  } else if (dailyMode)  {
    return (new Randoma({seed: dateSeed}).arrayItem(inputWords));
    
  }
 
}
function refillUnscoredLetters(chosenWord) {
  // for (let charInWord = 0; charInWord < chosenWord.length; charInWord++) {
  //   unscoredLetters.push(chosenWord[charInWord]);
  // }
  unscoredLetters = unscoredLetters.splice(0, unscoredLetters.length);
  for (let charInWord = 0; charInWord < chosenWord.length; charInWord++) {
    unscoredLetters[charInWord] = chosenWord[charInWord];
  }
}
export function arrMessWith(v: String[][], row: number, won: boolean, lost: boolean) {
  for (let i = 0; i < indexesToBeScored.length; i++) {
    v[row][indexesToBeScored[i]] = lettersToBeScored[i];
  }
  if (won) v.push(["won"]);
  if (lost) v.push(["lost"]);
  return v;
}
export function markInvalidGuess (v: String[][], row: number, markOrErase: boolean) {
  if (markOrErase) {
    for (let charPosInGuess = 0; charPosInGuess < v[row].length; charPosInGuess++) {
      if (v[row][charPosInGuess].length < 2) {
        v[row][charPosInGuess] += ":r";
      }
    }
  } else if (!markOrErase) {
    for (let charPosInGuess = 0; charPosInGuess < v[row].length; charPosInGuess++) {
      v[row][charPosInGuess][1] == "";
      v[row][charPosInGuess][2] == "";
    }
  }
  return v;
}
function emptyScoredLetters() {
  indexesToBeScored.splice(0, 100);
  lettersToBeScored.splice(0, 100);
  indexesToBeScoredIncrement = 0;
}
export function isGuessValid(guess) {
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
}
function checkForGreenLetters(chosenWord, guess) {
  for (let charPosInGuess = 0; charPosInGuess < guess.length; charPosInGuess++) {
    if (guess[charPosInGuess] == chosenWord[charPosInGuess] && isLetterPresent(guess[charPosInGuess])) {
      scoreLetters(guess[charPosInGuess], charPosInGuess, ":g");
      scoreKeyboard(guess[charPosInGuess], ":g");
      removeLetter(guess[charPosInGuess]);
    }
  }
}
function checkForYellowLetters(chosenWord, guess) {
  for (let charPosInChosenWord = 0; charPosInChosenWord < chosenWord.length; charPosInChosenWord++) {
    for (let  charPosInGuess= 0; charPosInGuess < guess.length; charPosInGuess++) {
      if ( (guess[charPosInGuess] == chosenWord[charPosInChosenWord]) && hasIndexBeenScored(charPosInGuess) == false && (isLetterPresent(guess[charPosInGuess]) == true) ) {
        scoreLetters(guess[charPosInGuess], charPosInGuess, ":y");
        scoreKeyboard(guess[charPosInGuess], ":y");
        removeLetter(guess[charPosInGuess]);
      }
    }
  }
}
function indexHasBeenScored(index: number) {
  return (indexesToBeScored.indexOf(index) != -1);
}
function checkBlackLetters(guess) {
  for (let i = 0; i < guess.length; i++) {
    if (!indexHasBeenScored(i)) {
      scoreLetters(guess[i], i, ":b");
      scoreKeyboard(guess[i], ":b")
      removeLetter(guess[i]);
    }
  }
}
function scoreLetters(letter: string, position: Number, color: string) {
    
  //somehow i need to be able to set these tiles
  let coloredLetter: string = letter + color;
  //@ts-ignore
  indexesToBeScored[indexesToBeScoredIncrement] = position;
  //@ts-ignore
  lettersToBeScored[indexesToBeScoredIncrement] = coloredLetter;
  //@ts-ignore
  indexesToBeScoredIncrement++;
}
function scoreKeyboard(letter: string, color: string) {
  if (color == ":g") {
    greenLetters.push(letter + color)
  } else if (color == ":y" &&
  checkIfKeyboardScored(letter, "yellow") == false &&
  checkIfKeyboardScored(letter, "green") == false) {
    yellowLetters.push(letter + color)
  } else if (color == ":b" &&
  checkIfKeyboardScored(letter, "black") == false &&
  checkIfKeyboardScored(letter, "yellow") == false &&
  checkIfKeyboardScored(letter, "green") == false) {
    blackLetters.push(letter + color)
  }
}

function checkIfKeyboardScored(letter: string, list: string) {
  if (list == "green") {
    return greenLetters.indexOf(letter) != -1
  } else if (list == "yellow") {
    return yellowLetters.indexOf(letter) != -1
  } else if (list == "black") {
    return blackLetters.indexOf(letter) != -1
  }
}
//call on selection of number of letters.
export function startGame(numLetters: Number, usingDailyMode: boolean) {
  //gets the random word
  //chosenWord = getRandomWord(sortWordsByLength(numLetters));
  possibleWords = refinedWords.filter((Element) => {
    return Element.length == numLetters;
  })
  chosenWord = getRandomWord(possibleWords, usingDailyMode)//.toLowerCase;
  /*
  else if (gameMode == "daily") {
    chosenWord = getDailyWord(possibleWords);
  }
  */
}
//call on valid guess entered
export function doRound(guess: string, tiles: String[][], row: number): String[][] {

  if (guess == chosenWord) gameWon = true;
  else gameWon = false;
  if(tries > 0) {
    tries--;
    refillUnscoredLetters(chosenWord);
    emptyScoredLetters();
    checkForGreenLetters(chosenWord, guess);
    checkForYellowLetters(chosenWord, guess);
    checkBlackLetters(guess);
    if (gameWon == true) {
      return arrMessWith(tiles, row, true, false);
    }else if (tries < 1) {
      return arrMessWith(tiles, row, false, true);
    }else {
      return arrMessWith(tiles, row, false, false);
    }
  }else if (tries < 1) {
    //return arrMessWith(tiles, row, false, true);
  }
  
}
//call on valid guess entered.
export function colorKeyboard (arr: string[]) {
  let newArr = []; //You not writing to this
  arr.forEach(elm => { //camelCase not PascalCase!
    if (greenLetters.includes(elm + ":g")) {
      newArr.push(elm + ":g"); //doesn't work this way, use push to add to the array
    } else if (yellowLetters.includes(elm + ":y")) {
      newArr.push(elm + ":y");
    } else if (blackLetters.includes(elm + ":b")) {
      newArr.push(elm + ":b");
    } else {
      newArr.push(elm)
    }
      
  }); 
  return (newArr)
}



