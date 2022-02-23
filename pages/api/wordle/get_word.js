import { supabase } from "../../../utils/supabaseClient";
import { getRound } from "./get_round";

export const WORD_LENGTH = 6;

export async function getWord() {
  const { data, error } = await supabase
    .from("words")
    .select("id,word,definition")
    .order("id", { ascending: false })
    .limit(1);
  return data[0];
}

export default async function handler(req, res) {
  const { word, definition, id } = await getWord();
  res.status(200).json({ word: word, definition: definition, round: id });
}
