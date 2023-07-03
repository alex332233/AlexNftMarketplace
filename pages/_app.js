import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Head from "next/head"
import Header from "../components/Header"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { NotificationProvider } from "web3uikit"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    // uri: "https://api.studio.thegraph.com/query/48694/nftmarketplace/version/latest",
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
