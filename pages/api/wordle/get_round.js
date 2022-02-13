import { supabase } from "../../../utils/supabaseClient";

export async function getRound() {
  const { data, error } = await supabase
    .from("words")
    .select("id", { count: "exact" });
  return data.length;
}

export default async function handler(req, res) {
  res.status(200).json({ round: await getRound() });
}
