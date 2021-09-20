import React from 'react';
import _ from 'lodash'

import { useParams } from 'react-router-dom';
import { useSession } from 'next-auth/client'

import LoadingSpinner from 'AppComponents/LoadingSpinner'
import { useConfGroup } from 'AppHooks/Data/useConfGroup'
import StatusErrorMessage from 'AppComponents/StatusErrorMessage';
import { ConfGroupForm } from 'AppComponents/ConfGroupForm';


export const ConfGroupFormUpdate = () => {


    const [session, loading] = useSession()




    const { groupid } = useParams()
    const confGroup = useConfGroup(groupid);

    //if (loading) { return <p>Loading...</p> }
    if (!session) {
        return (
            <StatusErrorMessage error>
                <pre>Acesso negado.</pre>
            </StatusErrorMessage>
        )
    }


    if (confGroup.isError) {
        return (
            !_.isEmpty(confGroup.error?.response?.data) ? (

                <StatusErrorMessage error>
                    <pre>{"".concat(...confGroup.error.response.data)}</pre>
                </StatusErrorMessage>

            ) : null
        )
    }

    if (confGroup.isLoading) {
        return <LoadingSpinner loadingMessage={`Carregando grupo ... `} />
    }

    return (
        <ConfGroupForm isUpdate={true} formValues={confGroup.data} />
        //<>teste</>
    )
}