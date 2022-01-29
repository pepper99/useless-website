import { faBook, faSmileBeam } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home() {

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-2 dark:bg-zinc-900">
      <div className="flex flex-col items-center rounded-md container max-w-lg mx-auto p-4 shadow-lg dark:bg-zinc-800">
        <h1 className="text-3xl text-left font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 select-none">Welcome to useless website...</h1>
        <p className="text-left dark:text-white select-none">This is where you read something while you slacking off.</p>
        <p className="text-left dark:text-white select-none">Hope you enjoy, I guess?</p>
        
        <div className="flex flex-col items-center mt-4 space-y-2">
          <a href="./joke" className="rounded-full font-bold text-center text-md p-1 w-52 bg-pink-400 hover:bg-pink-600 hover:scale-110 transition duration-200 text-white">
          <FontAwesomeIcon icon={faSmileBeam}/> Jokes
          </a>
          <a href="./fact" className="rounded-full font-bold text-center text-md p-1 w-52 bg-pink-400 hover:bg-pink-600 hover:scale-110 transition duration-200 text-white">
          <FontAwesomeIcon icon={faBook}/> Useless Facts
          </a>
        </div>
        {/* <button className="rounded-full font-bold text-md p-1 w-24 bg-pink-400 hover:bg-pink-600 transition-colors duration-200 dark:text-white">
          test
        </button> */}
      </div>
    </div>
  );
}
