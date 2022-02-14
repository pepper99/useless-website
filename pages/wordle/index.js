import { faBackspace, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../components/Layout";
import Modal from "../../components/Modal";
import useMounted from "../../hooks/useMounted";
import { getRound } from "../api/wordle/get_round";
import { getWord } from "../api/wordle/get_word";

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const MAX_LENGTH = 6;
const MAX_TRY = 6;

const BG_COLORS = {
  valid: "bg-[#538d4e]",
  misplaced: "bg-[#b59f3b]",
  wrong: "bg-zinc-700",
  none: "bg-zinc-500",
};

const EMOJIS = {
  valid: "🟩",
  misplaced: "🟨",
  wrong: "⬛",
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
          className={`box-border h-14 w-14 sm:h-16 sm:w-16 ${
            BG_COLORS[history.status[idx]]
          } flex select-none items-center justify-center text-center text-3xl font-bold text-white duration-200`}
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
          className="box-border flex h-14 w-14 select-none items-center justify-center border-2 border-zinc-600 bg-white text-center text-3xl font-bold text-white duration-200 dark:bg-zinc-900 sm:h-16 sm:w-16"
        ></div>
      ))}
    </div>
  ));
}

function Wordle({ round, word, definition }) {
  var gameState = { trialCount: 1, wordHistory: [], keyState: keyInitState };
  if (typeof window !== "undefined") {
    const saveState = JSON.parse(localStorage.getItem("pepper-wordle"));
    if (saveState) gameState = saveState;
  }
  const [currentWord, setCurrentWord] = useState("");
  const [win, setWin] = useState(gameState.win || false);
  const [trialCount, setTrialCount] = useState(gameState.trialCount || 1);
  const [wordHistory, setWordHistory] = useState(gameState.wordHistory || []);
  const [keyState, setKeyState] = useState(gameState.keyState || keyInitState);
  const mounted = useMounted();

  const [shake, setShake] = useState(false);
  const [keyIn, setKeyIn] = useState(false);
  const [scaleOut, setScaleOut] = useState(false);

  // useEffect(() => console.log(trialCount, currentWord, wordHistory));

  function alphaPress(key) {
    if (win) return;
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
    if (win) return;
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

    const winning = data.win;
    // console.log("win", winning);
    // console.log(typeof winning);
    // setWin(winning);
    setTimeout(() => setWin(winning), 1000);
  }

  function backspacePress() {
    if (win) return;
    // console.log("backspace");
    if (currentWord.length > 0) {
      const newWord = currentWord.slice(0, -1);
      setCurrentWord(newWord);
    }
  }

  useEffect(async () => {
    const gameState = JSON.parse(localStorage.getItem("pepper-wordle"));
    // console.log(gameState);
    if (gameState === null) return;

    if (gameState.round !== round) {
      setTrialCount(1);
      setWordHistory([]);
      setKeyState(keyInitState);
      setWin(false);
      localStorage.removeItem("pepper-wordle");
    } else {
      setTrialCount(gameState.trialCount);
      setWordHistory(gameState.wordHistory);
      setKeyState(gameState.keyState);
      setWin(gameState.win);
    }
  }, []);

  useEffect(async () => {
    const newState = JSON.stringify({
      wordHistory: wordHistory,
      trialCount: trialCount,
      keyState: keyState,
      win: win,
      round: round,
    });
    localStorage.setItem("pepper-wordle", newState);
  }, [wordHistory, trialCount, keyState, win]);

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
  }, [trialCount, currentWord, wordHistory, win]);

  // console.log({
  //   wordHistory: wordHistory,
  //   trialCount: trialCount,
  //   keyState: keyState,
  //   win: win,
  //   round: round,
  // });

  function resultShare() {
    var share = `Wordle clone @useless-website\n${round} ${
      trialCount > MAX_TRY && !win ? "X" : trialCount - 1
    }/${MAX_TRY}\n\n`;
    wordHistory.forEach((history) => {
      history.status.forEach((stat) => (share += EMOJIS[stat]));
      share += "\n";
    });
    navigator.clipboard.writeText(share);
    toast("Copied to clipboard", {
      duration: 1000,
      className: "dark:bg-zinc-800 bg-white dark:text-white text-black",
    });
    // console.log(share);
  }

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
          <div className="m-auto flex h-full min-h-fit w-fit flex-col items-center justify-between">
            <div className="my-auto flex w-fit flex-col gap-y-1 transition-transform">
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
                        className={`box-border h-14 w-14 border-2 bg-white dark:bg-zinc-900 sm:h-16 sm:w-16 ${
                          e !== " " ? "border-zinc-500" : "border-zinc-600"
                        } flex select-none items-center justify-center text-center text-3xl font-bold dark:text-white ${
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
            <div className="m-2 flex w-fit flex-col items-center justify-center gap-1 duration-200">
              {KEYS.map((keyRow, idx) => (
                <div key={idx} className="flex gap-x-1">
                  {idx === 2 && (
                    <button
                      className="h-12 w-12 rounded-md bg-zinc-500 text-xs text-white sm:h-14 sm:w-16 sm:text-base"
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
                      } h-12 w-8 rounded-md text-white sm:h-14 sm:w-10 sm:text-base`}
                      onClick={() => alphaPress(char)}
                    >
                      {char}
                    </button>
                  ))}
                  {idx === 2 && (
                    <button
                      className="h-12 w-12 rounded-md bg-zinc-500 text-white sm:h-14 sm:w-16 sm:text-base"
                      onClick={() => backspacePress()}
                    >
                      <FontAwesomeIcon fixedWidth icon={faBackspace} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Modal
            condition={win || trialCount > MAX_TRY}
            initial={true}
            title={
              <p>
                {"Result "}
                <a
                  className="cursor-pointer transition-colors hover:text-pink-500"
                  onClick={() => resultShare()}
                >
                  <FontAwesomeIcon fixedWidth size="xs" icon={faShare} />
                </a>
              </p>
            }
            showCloseBtn={false}
            closeBtnMsg=""
          >
            <div className="h-fit py-4 px-2 text-center dark:text-white">
              <p>
                Round {round} (
                {trialCount > MAX_TRY && !win ? "X" : trialCount - 1}/{MAX_TRY})
              </p>
              <div className="my-2">
                <p className="text-2xl font-bold text-pink-500">{word}</p>
                <p>{definition}</p>
              </div>
            </div>
          </Modal>
        </>
      )}
      <Toaster />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { word, definition } = await getWord();
  const round = await getRound();
  return {
    props: {
      round: round,
      word: word,
      definition: definition,
    },
  };
}

export default Wordle;
