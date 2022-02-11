import Head from "next/head";
import Layout from "../../components/Layout";

export default function Joke({ joke, category }) {

  return (
    <Layout backButton>
      <Head>
        <title>Random joke</title>
        <meta charset="UTF-8" />
        <meta name="description" content="Get your random joke" />
        <meta name="author" content="Poptum Charoennaew" />
      </Head>
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
    </Layout>
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
