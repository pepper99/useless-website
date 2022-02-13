import path from "path";
import { getWord, WORD_LENGTH } from "../get_word";
const fs = require("fs").promises;

async function checkExistence(word, validWord) {
  console.log("validWord", validWord);
  if (word === validWord) return true;

  const fileDir = "data/dictionary.json";
  const dir = path.resolve("./public", fileDir);

  const data = await fs.readFile(dir, "utf-8");
  const jsonObj = JSON.parse(data);

  return word in jsonObj;

  // const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  // const data = await res.json();

  // return typeof data.length !== "undefined";
}

function checkCorrectness(word, validWord) {
  const status = new Array(WORD_LENGTH);
  const counter = {};

  for (var i = 0; i < validWord.length; i++) {
    if (validWord[i] === word[i]) {
      status[i] = "valid";
      continue;
    }
    if (validWord[i] in counter) counter[validWord[i]]++;
    else counter[validWord[i]] = 1;
  }

  for (var i = 0; i < word.length; i++) {
    if (status[i] === "valid") continue;
    if (word[i] in counter) {
      status[i] = "misplaced";
      counter[word[i]]--;
      if (counter[word[i]] === 0) delete counter[word[i]];
      continue;
    } else status[i] = "wrong";
  }

  return { status: status, win: word === validWord };
}

export default async function handler(req, res) {
  try {
    const word = req.query.word;
    const validWord = (await getWord()).word;
    if (!(await checkExistence(word, validWord)))
      return res.status(200).json({ success: true, isExist: false });

    console.log(word);

    const { status, win } = checkCorrectness(word, validWord);
    console.log(win);
    res
      .status(200)
      .json({ success: true, isExist: true, status: status, win: win });
  } catch (error) {
    console.log(Object.keys(error.keys));
    res.status(400).json({ success: false, err: error });
  }
}
