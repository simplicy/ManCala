import styles from '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';
import { SessionProvider } from "next-auth/react"
import Layout from "../components/primary/Layout"
import { db } from "../lib/Mongo"

function MyApp({ Component, pageProps:{ session, ...pageProps } }) {
  
  return (
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </SessionProvider>
  );
}

export default MyApp
