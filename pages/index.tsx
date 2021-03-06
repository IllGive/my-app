//CSS AND HTML BY LUKAS
//TS by Bill
/*
    CREDITS:

    Answer word list: "3kwords.txt"
    https://www.ef.edu/english-resources/english-vocabulary/top-3000-words/
    I added some of my own words as well, and removed some (IllGive).

    Bigger list of words: "refinedWords.txt"
    http://www.gwicks.net/dictionaries.htm
    I added and edited this list quite a bit, including comparing it against the list below:

    Made a tool in C++ to check above list against the one below:
    pretty sure I got it from here: https://www.freewebheaders.com/full-list-of-bad-words-banned-by-google/
    Added to this list some proper nouns to check against: counties in England, Scotland, and Wales; countries of the world; and US states.
    I also added some words from other languages that seem to make it onto these lists; names; and some more offensive words.

    CODE:

    Essentially all of the CSS and HTML (this file) was done by quick007 on GitHub.
    The game logic and pruning the words lists/filtering is by IllGive.
    Credits written by IllGive. Yes, I will take credit for writing the credits.

    Inspiration:

    Wordle, obviously.

    Notes: I don't know how much I like web development over C++, but at least this is way better than python :).

*/
import Head from "next/head";
import { useRouter } from "next/router";
//import Image from "next/image";
import { useState, useEffect } from "react";
import {
  doRound,
  startGame,
  isGuessValid,
  //markInvalidGuess,
  chosenWord,
  colorKeyboard,
  //clearInvalidMarking,
  gameWon /*lettersToBeScored, indexesToBeScored*/,
} from "../lib/filesearch";
//import { Formik, Field, Form } from "formik";

//import { prepareArray } from "../lib/filesearch";

//let guess: string;

var myRow = 0;
let tempKeyboard: Array<string> = [];
let selectedValue: number;
let size: number /* | undefined = undefined*/;
let gameState;
let daily: boolean = false;

export default function Home() {
  const router = useRouter();
  function getOption() {
    const selectElement = document.querySelector("#numLetters");
    //@ts-expect-error
    const output = selectElement.value;
    size = output ?? 6;
    setCols(output);
    
    //document.getElementById("selectMode").hidden = true;
    document.getElementById("dropDownMenu").hidden = true;
    document.getElementById("dailyModeButton").hidden = true;
    document.getElementById("infiniteModeButton").hidden = true;
    selectedValue = output;
    startGame(output, daily); //// RIGHT HERE
    setTimeout(function () {}, 10000);
  }

  const [dailyMode, setDailyMode] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finishedfr, setFinishedfr] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [gameLostfr, setGameLostfr] = useState(false);
  const [cols, setCols] = useState<undefined | number>(undefined);
  const [row, setRow] = useState(0);
  const [tiles, setTiles] = useState<String[][]>([[], [], [], [], [], []]);
  const [invalidGuess, setInvalidGuess] = useState(false);
  const [keyboard, setKeyboard] = useState([
    "q",
    "w",
    "e",
    "r",
    "t",
    "y",
    "u",
    "i",
    "o",
    "p",
    "a",
    "s",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "z",
    "x",
    "c",
    "v",
    "b",
    "n",
    "m",
  ]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      //if (gameState != "lost") return;
      handleGuess(e.key, size);
    });
  }, []);

  
  return (
    <>
      <Head>
        <title>Bordle: Bills Wordle</title>
        <meta
          name="description"
          content="Because I thought that this was going to be easier"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicons/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta
          name="msapplication-config"
          content="/favicons/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />

      </Head>
      <div className="bg-black h-screen text-gray-100 pt-10 px-2 md:px-10 relative">
        {/* Invalid Guess Button */}
        <div
          className={
            "inset-0 absolute z-50 items-center justify-center flex " +
            (invalidGuess ? "" : "hidden")
          } 
        >
          <div className="rounded-lg bg-neutral-900 border backdrop-blur-md border-white/5 p-4 flex flex-col my-auto">
            <h2 className="text-2xl font-semibold text-center text-red-400">
              Not in word list!
            </h2>
          </div>
        </div>
        
        {/* Win screen */}
        <div
          className={
            "inset-0 bg-white/5 backdrop-blur-sm absolute z-50 flex items-center justify-center " +
            (finished ? "" : "hidden")
          }
        >
          <div className="rounded-lg bg-neutral-900 border backdrop-blur-md border-white/5 p-8 flex flex-col my-auto">
            <h2 className="text-2xl font-semibold text-center">
              Bordle Finished!
            </h2>
            <p
              className="text-gray-300 text-center mb-12 mt-2"
              id="displayWord_won"
            >
              Word: Word
            </p>
            <button
              onClick={() => router.reload()}
              className="rounded-lg bg-green-600 hover:bg-green-700 transition text-white text-xl font-medium uppercase py-3 px-6 mx-auto shadow-md shadow-green-600/10"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                setFinished(false);
                setFinishedfr(true);
              }}
              className="rounded-lg ring-yellow-500/50 hover:bg-yellow-500/5 transition ring-1 text-white text- font-medium uppercase py-2 px-6 mx-auto mt-4"
            >
              Close
            </button>
          </div>
        </div>
        
        {/* Lose screen */}
        <div
          className={
            "inset-0 bg-white/5 backdrop-blur-sm absolute z-50 flex items-center justify-center " +
            (gameLost ? "" : "hidden")
          }
        >
          <div className="rounded-lg bg-neutral-900 border backdrop-blur-md border-white/5 p-8 flex flex-col my-auto">
            <h2 className="text-2xl font-semibold text-center text-red-600">
              You lost!
            </h2>
            <p
              className="text-gray-300 text-center mb-12 mt-2"
              id="displayWord_lost"
            >
              Word: Word
            </p>
            <button
              onClick={() => router.reload()}
              className="rounded-lg bg-green-600 hover:bg-green-700 transition text-white text-xl font-medium uppercase py-3 px-6 mx-auto shadow-md shadow-green-600/10"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                setGameLost(false);
                setGameLostfr(true);
              }}
              className="rounded-lg ring-yellow-500/50 hover:bg-yellow-500/5 transition ring-1 text-white text- font-medium uppercase py-2 px-6 mx-auto mt-4"
            >
              Close
            </button>
          </div>
        </div>
          
        <div className="flex flex-col overflow-y-auto absolute {/*z-10 inset-0">

          {/* Title and that strange bar thing */}
          <h1 className="text-7xl font-bold mx-auto mb-4 relative tracking-wider ">
            Bordle!
          </h1>
          {/* I was thinking that perhaps either side of the bar, we could put the number of letters */}
          <hr
            className={
              "w-36 border-t-2  mx-auto mb-5 " +
              (cols ? "border-green-500" : "border-blue-500")
            }
          />

          {/* Buttons for selecting mode */}
          <div id="selectMode" className="rounded-lg bg-neutral-900/75 mx-auto grid gap-2 grid-cols-2 ">
            <div id="dailyModeButton" className={"cursor-pointer rounded-md bg-neutral-800 px-3 py-1 text-center " + (dailyMode ? "ring" : "")} onClick={() => {setDailyMode(true); daily = true}}>Daily</div>
            <div id="infiniteModeButton" className={"cursor-pointer rounded-md bg-neutral-800 px-3 py-1 " + (dailyMode ? "" : "ring")} onClick={() => {setDailyMode(false); daily = false}}>Infinite</div>
          </div>

          {/* Selecting the number of Letters */}
          <div className="md:space-x-4 mx-auto m-3 " id="dropDownMenu">
            <label htmlFor="numLetters" className="text-gray-200 text-lg">
              Select how many letters you would like in your word:
            </label>

            <select
              name="letters"
              id="numLetters"
              onChange={() => getOption()}
              className="rounded py-1 bg-white/10 px-2 translate-x-2 focus:text-gray-900"
            >
              <option value="">How many letters would you like in your word?</option>
              {/*<option value="1">1 letter</option>*/}
              <option value="2">2 letters</option>
              <option value="3">3 letters</option>
              <option value="4">4 letters</option>
              <option value="5">5 letters</option>
              <option value="6">6 letters</option>
              <option value="7">7 letters</option>
              <option value="8">8 letters</option>
              <option value="9">9 letters</option>
              <option value="10">10 letters</option>
              <option value="11">11 letters</option>
              <option value="12">12 letters</option>
            </select>
            {/* <p> When you have selected a number of letters, begin typing and your characters will appear below.</p> */}
          </div>

          {/* Main grid for the word tiles */}
          <div
            className={
              "grid mx-auto w-full gap-1 md:gap-4 select-none grid-cols-" +
              cols +
              (cols > 8 ? " lg:w-auto" : " md:w-auto")
            }
          >
            {tiles.map((value) =>
              value.map((value2) =>
                value2 == "won" ? (
                  ""
                ) : (
                  <div
                    //key={value2}
                    className={
                      "rounded-lg text-center text-3xl font-medium uppercase py-4  " +
                      (value2.endsWith(":g")
                        ? "bg-green-500"
                        : value2.endsWith(":y")
                        ? "bg-yellow-500"
                        : value2.endsWith(":b")
                        ? "bg-neutral-900"
                        : "bg-neutral-600/75") +
                      (cols > 8 ? " md:px-4 xl:px-8 " : "  md:px-8")
                    }
                  >
                    {value2.substring(0, 1)}
                  </div>
                )
              )
            )}
          </div>
          
          {/* Play Again button */}

          {finishedfr || gameLostfr ? (
            <button
              onClick={() => router.reload()}
              className="mt-8 rounded-lg bg-green-600 hover:bg-green-700 transition text-white text-xl font-medium uppercase py-3 px-6 mx-auto shadow-md shadow-green-600/10"
            >
              Play Again
            </button>
          ) : (
            ""
          )}
          <div className="mb-72"></div>
        </div>

        {/* keyboard */}
        <div className="grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10 grid-cols-11 grid-cols-12"></div>
        {cols != undefined && finished != true ? (
          <div className="flex items-end justify-center">
            <div className="absolute bottom-0 asshole z-20 flex w-full max-w-2xl items-end select-none">
              <div className="w-full">
                <div className="flex flex-col justify-center rounded-t-lg bg-neutral-900/75 border backdrop-blur-md border-white/5 pb-2 pt-6 md:px-6 w-full">
                  <div className="grid gap-2 grid-cols-10 mb-2 w-full">
                    {keyboard
                      .filter((item, index) => index < 10)
                      .map((value) => (
                        <button
                          onClick={() => {
                            handleGuess(value.substring(0, 1), size);
                          }}
                          key={value.substring(0, 1)}
                          className={
                            "rounded-lg focus:border-none focus:outline-none text-center text-xl  md:text-3xl font-medium uppercase py-2 hover:ring-1 transition duration-300  md:px-3 " +
                            (value.substring(2, 3).toLowerCase() == "g"
                              ? " bg-green-500"
                              : value.substring(2, 3).toLowerCase() == "y"
                              ? "bg-yellow-500"
                              : value.substring(2, 3).toLowerCase() == "b"
                              ? "bg-neutral-900"
                              : "bg-neutral-600")
                          }
                        >
                          {value.substring(0, 1)}
                        </button>
                      ))}
                  </div>
                  <div className="grid gap-2 grid-cols-9 mb-2 w-full">
                    {keyboard
                      .filter((item, index) => index < 19 && index > 9)
                      .map((value) => (
                        <button
                          onClick={() =>
                            handleGuess(value.substring(0, 1), size)
                          }
                          key={value.substring(0, 1)}
                          className={
                            "rounded-lg focus:border-none focus:outline-none text-center text-xl  md:text-3xl font-medium uppercase py-2 hover:ring-1 transition duration-300  md:px-3 " +
                            (value.substring(2, 3).toLowerCase() == "g"
                              ? " bg-green-500"
                              : value.substring(2, 3).toLowerCase() == "y"
                              ? "bg-yellow-500"
                              : value.substring(2, 3).toLowerCase() == "b"
                              ? "bg-neutral-900"
                              : "bg-neutral-600")
                          }
                        >
                          {value.substring(0, 1)}
                        </button>
                      ))}
                  </div>
                  <div className="grid gap-2 grid-cols-7 mb-2 w-full">
                    {keyboard
                      .filter((item, index) => index < 26 && index > 18)
                      .map((value) => (
                        <button
                          onClick={() =>
                            handleGuess(value.substring(0, 1), size)
                          }
                          key={value.substring(0, 1)}
                          className={
                            "rounded-lg text-center text-xl  md:text-3xl font-medium uppercase py-2 hover:ring-1 transition duration-300  md:px-3 " +
                            (value.substring(2, 3).toLowerCase() == "g"
                              ? " bg-green-500"
                              : value.substring(2, 3).toLowerCase() == "y"
                              ? "bg-yellow-500"
                              : value.substring(2, 3).toLowerCase() == "b"
                              ? "bg-neutral-900"
                              : "bg-neutral-600")
                          }
                        >
                          {value.substring(0, 1)}
                        </button>
                      ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                          handleGuess("Return", size, myRow);
                      }}
                      className="rounded-lg text-center text-xl md:text-3xl font-medium uppercase py-1  px-3 hover:ring-1 transition duration-300 bg-neutral-600 border-white/5"
                    >
                      Enter
                    </button>
                    <button
                      onClick={() => {
                        handleGuess("Backspace", size);
                      }}
                      className="rounded-lg text-center text-xl md:text-3xl font-medium uppercase  md:px-3 hover:ring-1 transition duration-300 bg-neutral-600 border-white/5"
                    >
                      Backspace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );

  function handleGuess(
    inputtedLetter: string,
    handleGuess_size: number,
    handleGuess_row?: number
  ) {
    if (handleGuess_row != undefined) {
      myRow = handleGuess_row;
    }
    const test: String[][] = [];
    for (let i = 0; i < tiles.length; i++) {
      test.push(tiles[i]);
    }
    let r = test[myRow];
    // Removed || inputtedLetter == "Enter" because it could interfere with stuff
    if (
      inputtedLetter != "Backspace" &&
      inputtedLetter != "Delete" &&
      inputtedLetter != "Enter" &&
      inputtedLetter != "Return" &&
      inputtedLetter.toLowerCase().match("^[a-z]{1}$") &&
      gameWon == false &&
      gameState != "lost" &&
      r.length < handleGuess_size
    ) {
      r.push(inputtedLetter.toLowerCase());
    } else if (inputtedLetter == "Backspace" || inputtedLetter == "Delete") {
      r.pop();
      // const t = markInvalidGuess(tiles, myRow, false)
      // setTiles(t);
    } else if (
      (inputtedLetter == "Enter" || inputtedLetter == "Return") &&
      r.length == handleGuess_size &&
      isGuessValid(r.join(""))
    ) {
      const t = doRound(r.join(""), tiles, myRow);
      setTiles(t);
      for (let charOnKeyboard = 0; charOnKeyboard < 26; charOnKeyboard++) {
        tempKeyboard.push(keyboard[charOnKeyboard].substring(0,1));
      }
      setKeyboard(colorKeyboard(tempKeyboard));
      newRow(myRow + 1);
      gameState = t.pop()[0];
      if (gameState == "won") {
        setFinished(true);
        document.getElementById("displayWord_won").innerHTML =
          "Word: " + chosenWord;
      } else if (gameState == "lost") {
        setGameLost(true);
        document.getElementById("displayWord_lost").innerHTML =
          "Word: " + chosenWord;
        //NEED TO FIX THIS LATER, You can still type after you have lost for whatever reason
      }
      t.push([]);
    } else if (
      (inputtedLetter == "Enter" || inputtedLetter == "Return") &&
      r.length == handleGuess_size &&
      !isGuessValid(r.join(""))
    ) {
      setInvalidGuess(true)
      //document.getElementById("invalidGuessMessage").hidden = true;
      setTimeout(() => {
        setInvalidGuess(false)
        //document.getElementById("invalidGuessMessage").hidden = false;
      }, 1000); //
    }

    setTiles(test);
  }

  function newRow(line: number) {
    setRow(line);
    myRow = line;
  }
}
