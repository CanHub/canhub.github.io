import "normalize.css/normalize.css";
import "antd/dist/antd.css";
import "../styles/globals.css";

import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <div className="container">
      <Head>
        <title>CanHub</title>
        <link rel="icon" href="/Avatar-purple.svg" />
      </Head>

      <img className={"logo"} src="Landscape-white.svg" />

      <Component {...pageProps} />

      <footer className={"footer"}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by CanHub
        </a>
      </footer>
    </div>
  );
}

export default MyApp;
