import React, { useState } from 'react';
import { signIn, getCsrfToken } from "next-auth/client";
import {
    grommet, Box, Text, FormField, TextInput, Grommet, Button, Card,
} from 'grommet';
import { useRouter } from 'next/router'

import themeHPE from 'AppThemes/themeHPE'


export default function SignIn({ csrfToken }) {

    const router = useRouter()
    const { callbackUrl, error } = router.query

    return (

        <Grommet theme={themeHPE} full>
            
            
            
            <Box align="center" justify='center' background='dark-3' fill>

                {error ? (
                    <Box border gap="medium" pad="medium" width="medium" background='status-error'>
                        <Text size='large'>Não foi possível efetuar login, credenciais inválidas.</Text>
                    </Box>
                ) : null }
            
                <form
                    method='post'
                    action='/api/auth/callback/credentials'
                >
                    
                    <input name='csrfToken' type='hidden' defaultValue={csrfToken} />
                    <Box border gap="medium" pad="large" width="medium">
                        <FormField htmlFor="username-id" label={"Nome de usuário:"}>
                            <TextInput
                                id="username-id"
                                name="username"
                            />
                        </FormField>

                        <FormField htmlFor="password-id" label="Senha:">
                            <TextInput
                                id="password-id"
                                name="password"
                                type='password'
                            />
                        </FormField>

                        <Box direction="row" justify="between" gap='small'>
                            <Button label="Voltar" secondary href={callbackUrl} />
                            <Button type="submit" label="Enviar" primary />

                        </Box>

                    </Box>
                </form>
            </Box>
        </Grommet>


    )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        }
    }
}