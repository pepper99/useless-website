const fs = require("fs").promises;

export const words = [{ word: "WORDLE", definition: "A game of vocabulary." }];
export const WORD_LENGTH = 6;

export function getWord() {
  return words[words.length - 1];
}

export function getRound() {
  return words.length;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRandomWord() {
  const data = await fs.readFile(`./data/dictionary.json`, "utf-8");
  const jsonObj = JSON.parse(data);
  var keyArray = Object.keys(jsonObj);
  const key = keyArray[getRandomInt(0, keyArray.length - 1)];
  return { word: key, definition: jsonObj[key] };
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.word.length === WORD_LENGTH) {
      const word = req.body.word;
      words.push({ word: word, definition: req.body.definition });
      return res.status(200).json({
        word: getWord(),
        definition: req.body.definition,
        words: words,
      });
    } else {
      const data = await getRandomWord();
      words.push({ word: data.word, definition: data.definition });
      return res
        .status(200)
        .json({ word: getWord(), definition: "", words: words });
    }
  } else {
    const { word, definition } = getWord();
    res.status(200).json({ word: word, definition: definition, words: words });
  }
}
