import { getRound } from "./get_word";

export default async function handler(req, res) {
  res.status(200).json({ round: getRound() });
}
