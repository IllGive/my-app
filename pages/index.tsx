import Head from "next/head";
import { useRouter } from "next/router";
//import Image from "next/image";
import { useState, useEffect } from "react";
import {
  doRound,
  startGame,
  isGuessValid,
  gameWon /*lettersToBeScored, indexesToBeScored*/,
} from "../lib/filesearch";
//import { Formik, Field, Form } from "formik";

//import { prepareArray } from "../lib/filesearch";

//let guess: string;

let selectedValue: number;
let size: number | undefined = undefined;

export default function Home() {
  const router = useRouter()
  function getOption() {
    const selectElement = document.querySelector("#numLetters");
    //@ts-expect-error
    const output = selectElement.value;
    console.log(output);
    size = output ?? 6;
    setCols(output);
    document.getElementById("dropDownMenu").hidden = true;
    selectedValue = output;
    startGame(output);
    setTimeout(function () {}, 10000);
  }

  var myRow = 0;
  const [started, setStarted] = useState(undefined)
  const [finished, setFinished] = useState(false);
  const [finishedfr, setFinishedfr] = useState(false);
  const [cols, setCols] = useState<undefined | number>(undefined);
  const [pressed, setPressed] = useState("");
  const [row, setRow] = useState(0); //current row the game is on
  const [tiles, setTiles] = useState<String[][]>([[], [], [], [], [], [], []]);

  // const test = [["a", "b", "c", "d", "e"], ["f", "g", "h", "i", "j"], ["K", "l", "m", "n", "o"]]
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      setPressed(e.key);
      handleGuess(e.key, size);
      setStarted(true);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Bordle: Bill's Wordle</title>
        <meta name="description" content="Generated by create next app" />
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
      <div className="bg-black min-h-screen text-gray-100 flex flex-col  py-10 px-2 md:px-10 relative">
        <div className={"inset-0 bg-white/5 backdrop-blur-sm absolute z-10 flex items-center justify-center " + (finished ? "" : "hidden")}>
          <div className="rounded-lg bg-neutral-900 border backdrop-blur-md border-white/5 p-8 flex flex-col my-auto">
            <h2 className="text-2xl font-semibold text-center">Bordle Finished!</h2>
            <p className="text-gray-300 text-center mb-12 mt-2">Word: Word</p>
            <button onClick={() => router.reload()} className="rounded-lg bg-green-600 hover:bg-green-700 transition text-white text-xl font-medium uppercase py-3 px-6 mx-auto shadow-md shadow-green-600/10">Play Again</button>
            <button onClick={() => {setFinished(false); setFinishedfr(true)}} className="rounded-lg ring-yellow-500/50 hover:bg-yellow-500/5 transition ring-1 text-white text- font-medium uppercase py-2 px-6 mx-auto mt-4">Close</button>
          </div>
        </div>
        <h1 className="text-7xl font-bold mx-auto mb-4 relative tracking-wider ">
          Bordle!
        </h1>
        <hr className={"w-36 border-t-2  mx-auto mb-6 " + (cols ? "border-green-500" : "border-blue-500") } />

        <div className="md:space-x-4 mx-auto " id="dropDownMenu">
          <label htmlFor="numLetters" className="text-gray-200 text-lg">
            Choose how many letters you would like to play with:
          </label>

          <select
            name="letters"
            id="numLetters"
            onChange={() => getOption()}
            className="rounded py-1 bg-white/10 px-2 translate-x-2 "
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
        <div className={"grid mx-auto w-full  gap-1 md:gap-4 grid-cols-" + cols + (cols > 8 ? " lg:w-auto" : " md:w-auto")}>
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
                    : "bg-neutral-900")
                  + (cols > 8 ? " md:px-4 xl:px-8 " : "  md:px-8")
                }
              >
                {value2.substring(0, 1)}
              </div>
            ))
          )}
          {/*console.log(tiles)*/}
        </div>
        {finishedfr ? 
        <button onClick={() => router.reload()} className="mt-8 rounded-lg bg-green-600 hover:bg-green-700 transition text-white text-xl font-medium uppercase py-3 px-6 mx-auto shadow-md shadow-green-600/10">Play Again</button> : ""}
        <div className="grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10 grid-cols-11 grid-cols-12"></div>
        <div className="mt-auto mx-auto"></div>
      </div>
    </>
  );

  function handleGuess(inputtedLetter: string, sizeT: number) {
    
    if (size == undefined) return;

    const test: String[][] = [];
    for (let i = 0; i < tiles.length; i++) {
      test.push(tiles[i]);
    }
    let r = test[myRow];
    console.log(size);
    // Removed || inputtedLetter == "Enter" because it could interfere with stuff
    if (
      inputtedLetter != "Backspace" &&
      inputtedLetter != "Delete" &&
      inputtedLetter.toLowerCase().match("^[a-z]{1}$") &&
      gameWon == false &&
      r.length < size
    ) {
      r.push(inputtedLetter.toLowerCase());
      console.log(r);
    } else if (inputtedLetter == "Backspace" || inputtedLetter == "Delete") {
      r.pop();
    } else if (
      (inputtedLetter == "Enter" || inputtedLetter == "Return") &&
      r.length == size &&
      isGuessValid(r.join(""))
    ) {
      console.log("worked");
      const t = doRound(r.join(""), tiles, myRow);
      setTiles(t);
      console.log(t)
      newRow(myRow + 1);
      console.log(row);
      if (t.pop()[0] == "won") {
        setFinished(true)
      }
      
    }

    //console.log(y);
    //test.push(r);
    setTiles(test);
    //console.log(tiles);
  }

  function newRow(line: number) {
    setRow(line);
    myRow = line;
    console.log(line);
    console.log(row);
  }
}
