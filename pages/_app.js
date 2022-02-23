import "../styles/globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import NextNProgress from "nextjs-progressbar";
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextNProgress color="#ec4899"/>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
