import { AnimatePresence } from "framer-motion";
import useDarkMode from "use-dark-mode";
import useMounted from "../hooks/useMounted";
import OvalButton from "./OvalButton";
import { faArrowLeft, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

function Layout({ children, backButton }) {
  const darkMode = useDarkMode(true, {
    classNameDark: "dark",
    classNameLight: "light",
  });
  const mounted = useMounted();
  const router = useRouter();

  return (
    <AnimatePresence
      exitBeforeEnter
      initial={false}
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <div className="w-screen h-screen flex flex-col items-center justify-center p-2 dark:bg-zinc-900 duration-300">
        {children}
        {mounted && (
          <OvalButton
            className="absolute sm:bottom-[5%] sm:right-[5%] sm:top-auto sm:left-auto top-[5%] right-[5%]"
            onClick={darkMode.toggle}
          >
            <FontAwesomeIcon icon={darkMode.value ? faMoon : faSun} />
          </OvalButton>
        )}
        {backButton && (
          <OvalButton
            className="absolute top-[5%] left-[5%]"
            onClick={() => router.back()}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </OvalButton>
        )}
        <span className="text-xs dark:text-zinc-600 absolute bottom-1 select-none -z-10">
          Yay
        </span>
      </div>
    </AnimatePresence>
  );
}

export default Layout;
