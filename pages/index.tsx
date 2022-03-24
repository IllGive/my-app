//CSS AND HTML BY LUKAS

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
let selectedValue: number;
let size: number/* | undefined = undefined*/;
let gameState;

export default function Home() {
  const router = useRouter()
  function getOption() {
    const selectElement = document.querySelector("#numLetters");
    //@ts-expect-error
    const output = selectElement.value;
    //console.log(output);
    size = output ?? 6;
    setCols(output);
    document.getElementById("dropDownMenu").hidden = true;
    selectedValue = output;
    startGame(output);
    setTimeout(function () {}, 10000);
  }
  
  
  //var myRow = 0;
  const [finished, setFinished] = useState(false);
  const [finishedfr, setFinishedfr] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [gameLostfr, setGameLostfr] = useState(false);
  const [cols, setCols] = useState<undefined | number>(undefined);
  const [row, setRow] = useState(0); //current row the game is on
  const [tiles, setTiles] = useState<String[][]>([[], [], [], [], [], []]);
  const [keyboard, setKeyboard] = useState(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'])

// need to fix a bug where the array destroys itself

  // const test = [["a", "b", "c", "d", "e"], ["f", "g", "h", "i", "j"], ["K", "l", "m", "n", "o"]]
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      //console.log(e.key)
      //if (gameState != "lost") return;
      handleGuess(e.key, size);
      
    });
  }, []);

  return (
    <>
      <Head>
        <title>Bordle: Bills Wordle</title> 
        <meta name="description" content="Because I thought that this was going to be easier" />
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
      <div className="bg-black min-h-screen text-gray-100 flex flex-col  pt-10 px-2 md:px-10 relative">
        <div className={"inset-0 bg-white/5 backdrop-blur-sm absolute z-10 flex items-center justify-center " + (finished ? "" : "hidden")}>
          <div className="rounded-lg bg-neutral-900 border backdrop-blur-md border-white/5 p-8 flex flex-col my-auto">
            <h2 className="text-2xl font-semibold text-center">Bordle Finished!</h2>
            <p className="text-gray-300 text-center mb-12 mt-2" id="displayWord_won">Word: Word</p>
            <button onClick={() => router.reload()} className="rounded-lg bg-green-600 hover:bg-green-700 transition text-white text-xl font-medium uppercase py-3 px-6 mx-auto shadow-md shadow-green-600/10">Play Again</button>
            <button onClick={() => {setFinished(false); setFinishedfr(true)}} className="rounded-lg ring-yellow-500/50 hover:bg-yellow-500/5 transition ring-1 text-white text- font-medium uppercase py-2 px-6 mx-auto mt-4">Close</button>
          </div>
        </div>
        {/* Surely I can just copy and paste this! */}
        <div className={"inset-0 bg-white/5 backdrop-blur-sm absolute z-10 flex items-center justify-center " + (gameLost ? "" : "hidden")}>
          <div className="rounded-lg bg-neutral-900 border backdrop-blur-md border-white/5 p-8 flex flex-col my-auto">
            <h2 className="text-2xl font-semibold text-center text-red-600">You lost!</h2>
            <p className="text-gray-300 text-center mb-12 mt-2" id="displayWord_lost">Word: Word</p>
            <button onClick={() => router.reload()} className="rounded-lg bg-green-600 hover:bg-green-700 transition text-white text-xl font-medium uppercase py-3 px-6 mx-auto shadow-md shadow-green-600/10">Play Again</button>
            <button onClick={() => {setGameLost(false); setGameLostfr(true)}} className="rounded-lg ring-yellow-500/50 hover:bg-yellow-500/5 transition ring-1 text-white text- font-medium uppercase py-2 px-6 mx-auto mt-4">Close</button>
          </div>
        </div>
        <h1 className="text-7xl font-bold mx-auto mb-4 relative tracking-wider ">
          Bordle!
        </h1>
         {/* I was thinking that perhaps either side of the bar, we could put he number of letters */}
        <hr className={"w-36 border-t-2  mx-auto mb-6 " + (cols ? "border-green-500" : "border-blue-500") } />

        <div className="md:space-x-4 mx-auto " id="dropDownMenu">
          <label htmlFor="numLetters" className="text-gray-200 text-lg">
            Choose how many letters you would like to play with:
          </label>

          <select
            name="letters"
            id="numLetters"
            onChange={() => getOption()}
            className="rounded py-1 bg-white/10 px-2 translate-x-2 focus:text-gray-900"
          >
            <option value="">--Please choose an option--</option>
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
        </div>

        {/* <input id="txtInput1" type="text" /> */}
        {/* We need to be able to easily change this grid-cols-5 value! */}
        <div className={"grid mx-auto w-full gap-1 md:gap-4 select-none grid-cols-" + cols + (cols > 8 ? " lg:w-auto" : " md:w-auto")}>
          {tiles.map((value) =>
            value.map((value2) => (
              value2 == "won" ? 
              ""
              :
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
                    : "bg-neutral-700/75")
                  + (cols > 8 ? " md:px-4 xl:px-8 " : "  md:px-8")
                }
              >
                {value2.substring(0, 1)}
              </div>
            ))
          )}
          {/*console.log(tiles)*/}
        </div>
        {finishedfr || gameLostfr ?
        <button onClick={() => router.reload()} className="mt-8 rounded-lg bg-green-600 hover:bg-green-700 transition text-white text-xl font-medium uppercase py-3 px-6 mx-auto shadow-md shadow-green-600/10">Play Again</button> : ""}
        <div className="grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10 grid-cols-11 grid-cols-12"></div>
        {cols != undefined && finished != true ? (
        <div className="mt-auto mx-auto w-full max-w-2xl">
          <div className="flex flex-col justify-center rounded-t-lg bg-neutral-900/50 border backdrop-blur-md border-white/5 pb-2 pt-6 px-1 md:px-6 w-full">
            <div className="grid gap-2 grid-cols-10 mb-2 w-full">
            {
              keyboard.filter((item, index) => index < 10).map((value) => (
                <button
                  onClick={() => {handleGuess(value.substring(0, 1), size) }}
                  key={value.substring(0, 1)}
                  className={"rounded-lg text-center text-xl  md:text-3xl font-medium uppercase py-2 hover:ring-1 transition duration-300  md:px-3 " + (value.substring(2, 3).toLowerCase() == "g" ? " bg-green-500" : value.substring(2, 3).toLowerCase() == "y" ? "bg-yellow-500" : value.substring(2, 3).toLowerCase() == "b" ? "bg-neutral-900" :"bg-neutral-800")} 
                >{value.substring(0, 1)}</button>
              ))
            }
            </div>
            <div className="grid gap-2 grid-cols-9 mb-2 w-full">
            {
              keyboard.filter((item, index) => index < 19 && index > 9).map((value) => (
                <button
                onClick={() => handleGuess(value.substring(0, 1), size)}
                  key={value.substring(0, 1)}
                  className={"rounded-lg text-center text-xl  md:text-3xl font-medium uppercase py-2 hover:ring-1 transition duration-300  md:px-3 " + (value.substring(2, 3).toLowerCase() == "g" ? " bg-green-500" : value.substring(2, 3).toLowerCase() == "y" ? "bg-yellow-500" : value.substring(2, 3).toLowerCase() == "b" ? "bg-neutral-900" :"bg-neutral-800")}
                >{value.substring(0, 1)}</button>
              ))
            }
            </div>
            <div className="grid gap-2 grid-cols-7 mb-2 w-full">
            {
              keyboard.filter((item, index) => index < 26 && index > 18).map((value) => (
                <button
                onClick={() => handleGuess(value.substring(0, 1), size)}
                  key={value.substring(0, 1)}
                  className={"rounded-lg text-center text-xl  md:text-3xl font-medium uppercase py-2 hover:ring-1 transition duration-300  md:px-3 " + (value.substring(2, 3).toLowerCase() == "g" ? " bg-green-500" : value.substring(2, 3).toLowerCase() == "y" ? "bg-yellow-500" : value.substring(2, 3).toLowerCase() == "b" ? "bg-neutral-900" :"bg-neutral-800")}
                >{value.substring(0, 1)}</button>
              ))
            }
            </div>
            <div className="grid grid-cols-2 gap-2">
            <button
                  onClick={() => {console.log(size, myRow, "|"), handleGuess("Return", size, myRow)}}
                  className="rounded-lg text-center text-xl md:text-3xl font-medium uppercase py-1  px-3 hover:ring-1 transition duration-300 bg-neutral-800 border-white/5"
                >Enter</button>
                <button
                  onClick={() => {handleGuess("Backspace", size)}}
                  className="rounded-lg text-center text-xl md:text-3xl font-medium uppercase  md:px-3 hover:ring-1 transition duration-300 bg-neutral-800 border-white/5"
                >Backspace</button>
            </div>
          </div>
        
        </div>
        ) : ""}
      </div>
      
    </>
  );


  /*function colorKeyboard (arr: string[]) {
    let newarr = [];
    arr.forEach(elm => {
      if (elm == "a") {
        newarr.push("a:g")
      } else {
        newarr.push(elm)
      }
    })
    return (newarr)
  }*/

  //so you want me to use this thing here?

  //LUKAS
  function handleGuess(inputtedLetter: string, handleGuess_size: number, handleGuess_row?: number) {
    
    console.log(inputtedLetter, handleGuess_size, handleGuess_row);
    if (handleGuess_row != undefined) {
      myRow = handleGuess_row;
    }
    console.log("guess handled");
    //if (handleGuess_size == undefined) return;
    
    console.log(tiles, "handleguess");
    const test: String[][] = [];
    for (let i = 0; i < tiles.length; i++) {
      test.push(tiles[i]);
    }
    console.log(myRow);
    let r = test[myRow];
    console.log(test);
    console.log(r);
    console.log(handleGuess_size);
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
      console.log(r);
    } else if (inputtedLetter == "Backspace" || inputtedLetter == "Delete") {
      r.pop();
      // const t = markInvalidGuess(tiles, myRow, false)
      // setTiles(t);
    } else if (
      (inputtedLetter == "Enter" || inputtedLetter == "Return") &&
      r.length == handleGuess_size &&
      isGuessValid(r.join(""))
    ) {
      //console.log("worked");
      console.log("Enter key detected");
      console.log(r, myRow);
      const t = doRound(r.join(""), tiles, myRow);
      setTiles(t);
      setKeyboard(colorKeyboard(keyboard))
      console.log(keyboard)
      console.log(t);
      console.log(myRow);
      newRow(myRow + 1);
      console.log(myRow);
      gameState = t.pop()[0];
      if (gameState == "won") {
        setFinished(true);
        document.getElementById("displayWord_won").innerHTML = "Word: " + chosenWord;
      } else if (gameState == "lost") {
        setGameLost(true);
        document.getElementById("displayWord_lost").innerHTML = "Word: " + chosenWord;
        //NEED TO FIX THIS LATER, You can still type after you have lost for whatever reason
      } 
      t.push([]);
      // } else if (r.length == handleGuess_size && !isGuessValid(r.join(""))) {
      // const t = markInvalidGuess(tiles, myRow, true)
      // setTiles(t);
    }
    console.log("ran through conditions in handleGuess");

    //console.log(y);
    //test.push(r);
    setTiles(test);
    //console.log(tiles);
  }

  // Egregious violation of DRY, but here we go:

  // function handleGuessOnScreen (inputtedLetter: string; size: number) {

  // }

  function newRow(line: number) {
    setRow(line);
    myRow = line;
    //console.log(line);
    //console.log(row);
  }
}
