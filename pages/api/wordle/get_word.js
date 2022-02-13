import { supabase } from "../../../utils/supabaseClient";

export const WORD_LENGTH = 6;

export async function getWord() {
  const { data, error } = await supabase
    .from("words")
    .select("word,definition")
    .order("id", { ascending: false })
    .limit(1);
  return data[0];
}
export default async function handler(req, res) {
  const { word, definition } = await getWord();
  res.status(200).json({ word: word, definition: definition });
}
