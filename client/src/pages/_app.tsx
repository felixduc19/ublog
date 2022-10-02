import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import theme from "../theme";

const apolloClient = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL_DEV,
    cache: new InMemoryCache(),
    credentials: "include",
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={apolloClient}>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </ApolloProvider>
    );
}

export default MyApp;
