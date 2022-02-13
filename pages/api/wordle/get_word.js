import { supabase } from "../../../utils/supabaseClient";
import path from "path";

export const WORD_LENGTH = 6;

export async function getWord() {
  const { data, error } = await supabase
    .from("words")
    .select("word,definition")
    .order("id", { ascending: false })
    .limit(1);
  return data[0];
}

export async function getRound() {
  const { data, error } = await supabase
    .from("words")
    .select("id", { count: "exact" });
  return data.length;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRandomWord() {
  const fileDir = "data/dictionary.json";
  const dir = path.resolve("./public", fileDir);

  const data = await fs.readFile(dir, "utf-8");
  const jsonObj = JSON.parse(data);
  var keyArray = Object.keys(jsonObj);
  const key = keyArray[getRandomInt(0, keyArray.length - 1)];
  return { word: key, definition: jsonObj[key] };
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.word.length === WORD_LENGTH) {
      const word = req.body.word;
      const definition = req.body.definition;

      const { data, error } = await supabase.from("words").insert({
        word: word,
        definition: definition,
      });

      return res.status(200).json({
        word: word,
        definition: definition,
      });
    } else {
      const { word, definition } = await getRandomWord();

      const { data, error } = await supabase.from("words").insert({
        word: word,
        definition: definition,
      });

      return res.status(200).json({ word: word, definition: definition });
    }
  } else {
    const { word, definition } = await getWord();
    res.status(200).json({ word: word, definition: definition });
  }
}
