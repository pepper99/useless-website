import { supabase } from "../../../utils/supabaseClient";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRandomWord() {
  const { data, error } = await supabase.from("dict").select("word,definition");
  const row = data[getRandomInt(0, data.length - 1)];
  return row;
}

export default async function handler(req, res) {
  if (!req.body.random) {
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
}
