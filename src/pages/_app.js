import App from 'next/app'
import { Grommet } from 'grommet'
import {
    QueryClient,
    QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider } from "next-auth/client"


import AppTheme from 'AppThemes/themeHPE'


import 'mapbox-gl/dist/mapbox-gl.css'; // estilos mapbox





const queryClient = new QueryClient();

export default class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props
        return (
            <Provider session={pageProps.session}>
                <Grommet theme={AppTheme} full>
                    <QueryClientProvider client={queryClient}>
                        <Component {...pageProps} />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </Grommet>
            </Provider>



        )
    }
}
