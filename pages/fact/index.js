import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OvalButton from "../../components/OvalButton";
import useDarkMode from "use-dark-mode";
import Head from "next/head";
import useMounted from "../../hooks/useMounted";

export default function Fact({ fact, source }) {
  const darkMode = useDarkMode(true, {
    classNameDark: "dark",
    classNameLight: "light",
  });
  const mounted = useMounted();

  return (
    <>
      <Head>
        <title>Random useless fact</title>
        <meta charset="UTF-8" />
        <meta name="description" content="Get your random useless fact" />
        <meta name="author" content="Poptum Charoennaew" />
      </Head>
      <div className="w-screen h-screen flex flex-col items-center justify-center p-2 dark:bg-zinc-900">
        <div className="rounded-md container max-w-lg mx-auto p-4 shadow-lg dark:bg-zinc-800 hover:scale-110 transition-transform duration-200">
          <h1 className="italic select-none dark:text-zinc-400">
            And your useless fact is ..
          </h1>
          <p className="font-bold text-xl text-center m-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500 selection:bg-purple-400 selection:text-white">
            {fact}
          </p>
          <p className="text-xs text-right text-pink-400 hover:text-pink-500 hover:underline transition-colors select-none">
            <a href={source}>Source</a>
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
  const res = await fetch(
    "https://uselessfacts.jsph.pl/random.json?language=en"
  );
  const data = await res.json();

  return {
    props: {
      fact: data.text,
      source: data.source_url,
    },
  };
}
