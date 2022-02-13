import { faBackspace } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import useMounted from "../../hooks/useMounted";

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const MAX_LENGTH = 6;
const MAX_TRY = 6;

const BG_COLORS = {
  valid: "bg-[#538d4e]",
  misplaced: "bg-[#b59f3b]",
  wrong: "bg-zinc-700",
  none: "bg-zinc-500",
};

const keyInitState = {};
for (let i = 0; i < 26; i++) {
  keyInitState[String.fromCharCode("A".charCodeAt(0) + i)] = "none";
}

function FilledRow({ history, isLast, scaleOut }) {
  return (
    <div
      className={`flex w-fit gap-x-1 ${
        scaleOut && isLast ? "scale-110" : "scale-100"
      } transition-all`}
    >
      {history.word.split("").map((char, idx) => (
        <div
          key={idx}
          className={`box-border w-16 h-16 ${
            BG_COLORS[history.status[idx]]
          } text-center flex text-white justify-center items-center text-3xl font-bold select-none duration-200`}
        >
          {char}
        </div>
      ))}
    </div>
  );
}

function UnfilledRow({ trialCount }) {
  return [...Array(MAX_TRY - trialCount)].map((e, i) => (
    <div key={i} className="flex w-fit gap-x-1">
      {[...Array(MAX_LENGTH)].map((e, i) => (
        <div
          key={i}
          className="box-border border-2 w-16 h-16 dark:bg-zinc-900 bg-white border-zinc-600 text-center flex text-white justify-center items-center text-3xl font-bold select-none duration-200"
        ></div>
      ))}
    </div>
  ));
}

function Wordle() {
  var gameState = { trialCount: 1, wordHistory: [], keyState: keyInitState };
  if (typeof window !== "undefined") {
    const saveState = JSON.parse(localStorage.getItem("pepper-wordle"));
    if (saveState) gameState = saveState;
  }
  const [currentWord, setCurrentWord] = useState("");
  const [win, setWin] = useState(gameState.win || false);
  const [round, setRound] = useState(gameState.round || 1);
  const [trialCount, setTrialCount] = useState(gameState.trialCount || 1);
  const [wordHistory, setWordHistory] = useState(gameState.wordHistory || []);
  const [keyState, setKeyState] = useState(gameState.keyState || keyInitState);
  const [result, setResult] = useState({});
  const mounted = useMounted();

  const [shake, setShake] = useState(false);
  const [keyIn, setKeyIn] = useState(false);
  const [scaleOut, setScaleOut] = useState(false);

  // useEffect(() => console.log(trialCount, currentWord, wordHistory));

  function alphaPress(key) {
    if (!/^[A-Z]+$/.test(key)) return;
    if (currentWord.length < MAX_LENGTH) {
      const newWord = currentWord + key;
      setCurrentWord(newWord);
      setKeyIn(true);
      setTimeout(() => setKeyIn(false), 150);
    }
  }

  function setKeyboard(word, newStatus) {
    const newKeyState = keyState;
    for (let i = 0; i < MAX_LENGTH; i++) {
      const char = word[i];
      const status = newStatus[i];
      if (newKeyState[char] === "valid") continue;
      if (newKeyState[char] === "misplaced" && status === "wrong") continue;
      newKeyState[char] = status;
    }
    setKeyState(newKeyState);
  }

  function onError(msg) {
    toast(msg, {
      duration: 1500,
      className: "dark:bg-zinc-800 bg-white dark:text-white text-black",
    });
    setShake(true);
    setTimeout(() => setShake(false), 250);
  }

  async function enterPress() {
    if (currentWord.length !== MAX_LENGTH) {
      onError("Not enough letters");
      return;
    }

    const res = await fetch(`/api/wordle/check_word/${currentWord}`);
    const data = await res.json();

    if (!data.isExist) {
      onError("The word doesn't exist");
      return;
    }

    setKeyboard(currentWord, data.status);

    // console.log(data);

    const newWordHistory = [
      ...wordHistory,
      { word: currentWord, status: data.status },
    ];
    setWordHistory(newWordHistory);
    const newTrial = trialCount + 1;
    setTrialCount(newTrial);
    setCurrentWord("");

    setTimeout(() => {
      setScaleOut(true);
      setTimeout(() => setScaleOut(false), 250);
    }, 100);

    console.log("win", data.win);
    setTimeout(() => setWin(data.win), 1000);
  }

  function backspacePress() {
    // console.log("backspace");
    if (currentWord.length > 0) {
      const newWord = currentWord.slice(0, -1);
      setCurrentWord(newWord);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!win) {
        const key = e.keyCode;
        // console.log(key);
        switch (key) {
          case 13:
            enterPress();
            break;
          case 8:
            backspacePress();
            break;

          default:
            alphaPress(String.fromCharCode(key));
            break;
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [trialCount, currentWord, wordHistory, win, round]);

  useEffect(async () => {
    const newState = JSON.stringify({
      wordHistory: wordHistory,
      trialCount: trialCount,
      keyState: keyState,
      win: win,
      round: round,
    });
    localStorage.setItem("pepper-wordle", newState);
    if (win) {
      const res = await fetch("/api/wordle/get_word");
      const data = await res.json();
      setResult({
        word: data.word,
        definition: data.definition,
      });
    }
  }, [wordHistory, trialCount, keyState, win, round]);

  useEffect(async () => {
    const gameState = JSON.parse(localStorage.getItem("pepper-wordle"));
    // console.log(gameState);
    if (gameState === null) return;

    const res = await fetch(`/api/wordle/get_round`);
    const data = await res.json();
    console.log(data);
    if (gameState.round !== data.round) {
      localStorage.removeItem("pepper-wordle");
      setTrialCount(1);
      setWordHistory([]);
      setKeyState(keyInitState);
      setWin(false);
      setRound(data.round);
    } else {
      setTrialCount(gameState.trialCount);
      setWordHistory(gameState.wordHistory);
      setKeyState(gameState.keyState);
      setWin(gameState.win);
      setRound(gameState.round);
    }
  }, []);

  return (
    <Layout backButton>
      <Head>
        <title>Wordle Clone</title>
        <meta charset="UTF-8" />
        <meta
          name="description"
          content="Play a (unpaid) copy of your favourite word game!"
        />
        <meta name="author" content="Poptum Charoennaew" />
      </Head>
      {mounted && (
        <>
          <div className="flex flex-col gap-y-1 transition-transform">
            {wordHistory.map((hist, idx) => (
              <FilledRow
                key={idx}
                history={hist}
                isLast={idx === wordHistory.length - 1}
                scaleOut={scaleOut}
              />
            ))}

            <div
              className={`flex w-fit gap-x-1 duration-200 ${
                shake ? "animate-shake" : "animate-none"
              }`}
            >
              {trialCount <= MAX_TRY &&
                currentWord
                  .padEnd(MAX_LENGTH)
                  .split("")
                  .map((e, idx) => (
                    <div
                      key={idx}
                      className={`box-border border-2 w-16 h-16 dark:bg-zinc-900 bg-white ${
                        e !== " " ? "border-zinc-500" : "border-zinc-600"
                      } text-center flex dark:text-white justify-center items-center text-3xl font-bold select-none ${
                        keyIn && e !== " " && idx === currentWord.length - 1
                          ? "scale-110"
                          : "scale-100"
                      } transition-all duration-200`}
                    >
                      {e}
                    </div>
                  ))}
            </div>

            {trialCount < MAX_TRY && <UnfilledRow trialCount={trialCount} />}
          </div>
          <div className="absolute bottom-0 m-2 flex flex-col justify-center items-center gap-1 duration-200">
            {KEYS.map((keyRow, idx) => (
              <div key={idx} className="flex gap-x-1">
                {idx === 2 && (
                  <button
                    className="bg-zinc-500 w-16 h-14 rounded-md text-white"
                    onClick={() => enterPress()}
                  >
                    ENTER
                  </button>
                )}
                {keyRow.split("").map((char, i) => (
                  <button
                    key={char}
                    className={`${
                      BG_COLORS[keyState[char]]
                    } w-10 h-14 rounded-md text-white`}
                    onClick={() => alphaPress(char)}
                  >
                    {char}
                  </button>
                ))}
                {idx === 2 && (
                  <button
                    className="bg-zinc-500 w-16 h-14 rounded-md text-white"
                    onClick={() => backspacePress()}
                  >
                    <FontAwesomeIcon fixedWidth icon={faBackspace} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <Modal
            condition={win}
            initial={true}
            title="Result"
            showCloseBtn={false}
            closeBtnMsg=""
          >
            <div className="text-center h-fit dark:text-white py-4 px-2">
              <p>
                Round {round} ({trialCount > MAX_TRY ? "X" : trialCount - 1}/
                {MAX_TRY})
              </p>
              <div className="my-2">
                <p className="text-pink-500 font-bold text-2xl">{result.word}</p>
                <p>{result.definition}</p>
              </div>
            </div>
          </Modal>
        </>
      )}
      <Toaster />
    </Layout>
  );
}

export default Wordle;
