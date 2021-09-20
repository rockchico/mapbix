import React, { useState } from 'react';
import { useIsFetching } from 'react-query'
import { Grommet, Box, Button, Grid, Text } from 'grommet';

import { grommet } from 'grommet/themes';
import LayoutHeader from './LayoutHeader';
import LoadingSpinner from 'AppComponents/LoadingSpinner'


export const Layout = ({ children, mainComponent, sidebarComponent, APP_NAME }) => {


    return (

        <Grommet full theme={grommet}>
            <Grid
                fill
                rows={['auto', 'flex']}
                columns={['auto', 'flex']}
                areas={[
                    { name: 'header', start: [0, 0], end: [1, 0] },
                    { name: 'sidebar', start: [0, 1], end: [0, 1] },
                    { name: 'main', start: [1, 1], end: [1, 1] },
                ]}
            >
                <Box
                    gridArea="header"
                    direction="row"
                    align="center"
                    justify="between"
                    pad={{ horizontal: 'medium', vertical: 'small' }}
                    background="dark-2"
                >
                    {/*
                        Botões de navegação do app
                    */}
                    <LayoutHeader APP_NAME={APP_NAME} />
                </Box>

                {/*
                    Aqui são inseridos os sidebars
                */}
                {sidebarComponent}

                <Box gridArea="main" justify="center" align="center">
                    { /* <h1>mapa</h1>*/}
                    {mainComponent}
                </Box>

            </Grid>

        </Grommet>

    );

};

export default Layout