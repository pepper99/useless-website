import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OvalButton from "../../components/OvalButton";
import useDarkMode from "use-dark-mode";
import Head from "next/head";
import useMounted from "../../hooks/useMounted";

export default function Joke({ joke, category }) {
  const darkMode = useDarkMode(true, {
    classNameDark: "dark",
    classNameLight: "light",
  });
  const mounted = useMounted();

  return (
    <>
      <Head>
        <title>Random joke</title>
        <meta charset="UTF-8" />
        <meta name="description" content="Get your random joke" />
        <meta name="author" content="Poptum Charoennaew" />
      </Head>
      <div className="w-screen h-screen flex flex-col items-center justify-center p-2 dark:bg-zinc-900">
        <div className="rounded-md container max-w-lg mx-auto p-4 shadow-lg dark:bg-zinc-800 hover:scale-110 transition-transform duration-200">
          <h1 className="italic select-none dark:text-zinc-400">
            And your joke is ..
          </h1>
          <p className="font-bold text-xl text-center m-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500 selection:bg-purple-400 selection:text-white">
            {joke}
          </p>
          <p className="text-xs text-right text-gray-400 dark:text-zinc-500 select-none">
            Category: {category}
          </p>
        </div>
        {mounted && (
          <OvalButton
            className="absolute bottom-[5%] right-[5%]"
            onClick={darkMode.toggle}
          >
            <FontAwesomeIcon icon={darkMode.value ? faMoon : faSun} />
          </OvalButton>
        )}
        <span className="text-xs dark:text-zinc-600 absolute bottom-1 select-none">
          Yay
        </span>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
  const data = await res.json();

  return {
    props: {
      joke: data.joke,
      category: data.category,
    },
  };
}
