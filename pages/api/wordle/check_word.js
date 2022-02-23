import dictionary from "../../../public/data/dictionary_compact.json"
import { WORD_LENGTH } from "./get_word";

async function checkExistence(word, validWord) {
  console.log("validWord", validWord);
  if (word === validWord) return true;

  return word in dictionary;
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
    const body = JSON.parse(req.body);
    const word = body.word;
    const validWord = body.validWord;
    
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
