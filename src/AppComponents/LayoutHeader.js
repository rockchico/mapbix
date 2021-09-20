import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signIn, signOut, useSession } from 'next-auth/client'

import { Grommet, Box, Button, Grid, Text, Nav, Heading } from 'grommet';
import { LineChart, List, Home, Magic, Login, Logout, MapLocation, Connectivity, Template, Configure } from 'grommet-icons';
import { grommet } from 'grommet/themes';

import ButtonTip from 'AppComponents/ButtonTip';


export const LayoutHeader = ({ APP_NAME }) => {



    const [session, loading] = useSession()
    const navigate = useNavigate();


    return (

        <>

            <Nav direction="row">

                { /*<Link to="/">Home</Link>*/}

                <Button
                    onClick={() => navigate('/')}
                    icon={<Home color="white" />}
                    tip={{
                        plain: true,
                        content: (
                            <ButtonTip>
                                Início
                            </ButtonTip>
                        )
                    }}
                />

                <Button
                    onClick={() => navigate('/map-groups')}
                    icon={<List />}
                    tip={{
                        plain: true,
                        content: (
                            <ButtonTip>
                                Lista de Grupos
                            </ButtonTip>
                        )
                    }}
                />

                <Button
                    onClick={() => navigate('/conf-groups')}
                    icon={<Configure />}
                    tip={{
                        plain: true,
                        content: (
                            <ButtonTip>
                                Configurações de Grupo
                            </ButtonTip>
                        )
                    }}
                />

            </Nav>

            <Box direction="row" align="center" gap="small">
                <Heading level={3} margin="none" color="white">
                    <strong>{APP_NAME}</strong>
                </Heading>
            </Box>


            <Box direction="row" align="center" gap="small">

                <Box>
                    {!session && <>
                        <Button
                            icon={<Login color="white" />}
                            label="Entrar"
                            onClick={(e) => {
                                e.preventDefault()
                                signIn()
                            }}
                            tip={{ dropProps: { align: { left: 'right' } }, content: 'Fazer Login' }}
                        />
                    </>
                    }
                    {session && <>
                        <Button
                            icon={<Logout color="white" />}
                            label={session.user.name}
                            onClick={(e) => {
                                e.preventDefault()
                                signOut()
                            }}
                            tip={{ dropProps: { align: { left: 'right' } }, content: 'Efetuar Logout' }}
                        />
                    </>
                    }
                </Box>

            </Box>



        </>

    );

};

export default LayoutHeader