import { faBook, faSmileBeam } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Useless website...</title>
        <meta charset="UTF-8" />
        <meta
          name="description"
          content="Get your doses of useless short reading material"
        />
        <meta name="author" content="Poptum Charoennaew" />
      </Head>
      <div className="flex flex-col items-center rounded-md container max-w-lg mx-auto p-4 shadow-xl dark:bg-zinc-800 shadow-pink-600/20 duration-300">
        <h1 className="text-3xl text-left font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 select-none">
          Welcome to useless website...
        </h1>
        <p className="text-left dark:text-white select-none">
          This is where you read something while you slacking off.
        </p>
        <p className="text-left dark:text-white select-none">
          Hope you enjoy, I guess?
        </p>

        <div className="flex flex-col items-center mt-4 mb-4 space-y-4">
          <Link href="/joke">
            <a className="rounded-full font-bold text-center text-md p-1 w-52 bg-pink-400 hover:bg-pink-600 hover:scale-110 shadow-lg shadow-pink-600/70 transition duration-200 text-white">
              <FontAwesomeIcon fixedWidth icon={faSmileBeam} /> Jokes
            </a>
          </Link>
          <Link href="/fact">
            <a className="rounded-full font-bold text-center text-md p-1 w-52 bg-pink-400 hover:bg-pink-600 hover:scale-110 shadow-lg shadow-pink-600/70 transition duration-200 text-white">
              <FontAwesomeIcon fixedWidth icon={faBook} /> Useless Facts
            </a>
          </Link>
          <Link href="/wordle">
            <a className="rounded-full font-bold text-center text-md p-1 w-52 bg-pink-400 hover:bg-pink-600 hover:scale-110 shadow-lg shadow-pink-600/70 transition duration-200 text-white">
              <FontAwesomeIcon fixedWidth icon={faBook} /> Wordle Clone
            </a>
          </Link>
        </div>
        {/* <button className="rounded-full font-bold text-md p-1 w-24 bg-pink-400 hover:bg-pink-600 transition-colors duration-200 dark:text-white">
          test
        </button> */}
      </div>
    </Layout>
  );
}
