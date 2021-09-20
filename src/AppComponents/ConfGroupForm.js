import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import {
    Box,
    Button,
    Form,
    FormField,
    Grommet,
    Select,
    TextInput
} from 'grommet';

import { useNavigate, useParams } from 'react-router-dom';
import { useSession } from 'next-auth/client'


import { useZabbixGroupsOptions } from 'AppHooks/Data/useZabbixGroupsOptions'
import { useZabbixHostsOptions } from 'AppHooks/Data/useZabbixHostsOptions'
import { useZabbixItemsOptions } from 'AppHooks/Data/useZabbixItemsOptions'
import { useConfGroupForm } from 'AppHooks/useConfGroupForm'
import { useConfGroupCreate } from 'AppHooks/Data/useConfGroupCreate'
import { useConfGroupUpdate } from 'AppHooks/Data/useConfGroupUpdate'
import StatusErrorMessage from 'AppComponents/StatusErrorMessage';
import LoadingSpinner from './LoadingSpinner';




export const ConfGroupForm = ({ isUpdate = false, formValues }) => {


    const [session, loading] = useSession()
    //if (loading) { return <p>Loading...</p> }
    if (!session) {
        return (
            <StatusErrorMessage error>
                <pre>Acesso negado.</pre>
            </StatusErrorMessage>
        )
    }


    const navigate = useNavigate();

    const { actions, state: { confGroupForm } } = useConfGroupForm();
    const [formErrors, setFormErrors] = useState({})

    const zabbixGroupsOptions = useZabbixGroupsOptions();
    const zabbixHostsOptions = useZabbixHostsOptions(confGroupForm.formValues.groupid);
    const zabbixItemsOptions = useZabbixItemsOptions(confGroupForm.formValues.main_hostid);

    const confGroupCreate = useConfGroupCreate();
    const confGroupUpdate = useConfGroupUpdate();



    useEffect(() => {

        if (isUpdate) {
            actions.setFormValues(formValues)
        }

        zabbixGroupsOptions.refetch();

    }, []); // roda no render inicial somente


    useEffect(() => {
        if (confGroupForm.formValues.groupid) {
            //actions.setHostOptions([])
            //actions.setItemOptions([])
            zabbixHostsOptions.refetch()
        }
    }, [confGroupForm.formValues.groupid]); // 

    useEffect(() => {
        if (confGroupForm.formValues.main_hostid) {
            //actions.setItemOptions([])
            zabbixItemsOptions.refetch()
        }
    }, [confGroupForm.formValues.main_hostid]); // 




    useEffect(() => {
        if (zabbixGroupsOptions.isSuccess) {
            actions.setGroupOptions(zabbixGroupsOptions.data)
        }
    }, [zabbixGroupsOptions.isSuccess]); // 

    useEffect(() => {
        if (zabbixHostsOptions.isSuccess) {
            actions.setHostOptions(zabbixHostsOptions.data)
        }
    }, [zabbixHostsOptions.isSuccess]); // 

    useEffect(() => {
        if (zabbixItemsOptions.isSuccess) {
            actions.setItemOptions(zabbixItemsOptions.data)
        }
    }, [zabbixItemsOptions.isSuccess]); // 



    useEffect(() => {
        if (confGroupCreate.isError) {
            setFormErrors(confGroupCreate.error.response.data)
        }
    }, [confGroupCreate.isError]); // 

    useEffect(() => {
        if (confGroupUpdate.isError) {
            setFormErrors(confGroupUpdate.error.response.data)
        }
    }, [confGroupUpdate.isError]); // 





    if (confGroupCreate.isSuccess) {
        return (
            <StatusErrorMessage ok>
                <pre>Grupo Incluído com sucesso</pre>
            </StatusErrorMessage>
        )
    }

    if (confGroupUpdate.isSuccess) {
        return (
            <StatusErrorMessage ok>
                <pre>Grupo Atualizado com sucesso</pre>
            </StatusErrorMessage>
        )
    }

    // enquanto que as opções do form estão sendo carregadas, mostra spinner e mensagem
    if (zabbixGroupsOptions.isLoading || zabbixHostsOptions.isLoading || zabbixItemsOptions.isLoading) {
        return <LoadingSpinner loadingMessage={`Carregando opções do formulário ... `} />
    }





    return (
        <Grommet full>
            <Box fill align="center" justify="center">

                <Box width="medium">
                    <Form
                        errors={formErrors}
                        messages={{ invalid: "Inválido", required: "Campo obrigatório" }}
                        value={confGroupForm.formValues}
                        onChange={(nextValue, { touched }) => {
                            //console.log('Change', nextValue, touched);
                            //setFormValues(nextValue);
                        }}
                        //onReset={() => setFormValues(defaultValue)}
                        onSubmit={async (event) => {
                            //console.log('Submit', event.value, event.touched)
                            //console.log('confGroupForm.formValues', confGroupForm.formValues)
                            if (!isUpdate) {
                                await confGroupCreate.mutateAsync(confGroupForm.formValues)
                            } else {
                                await confGroupUpdate.mutateAsync(confGroupForm.formValues)
                            }

                        }}
                    >

                        <FormField label="Grupo" name="groupid" htmlFor="groupid" required>
                            {/* <Select name="groupid" options={['small', 'medium', 'large']} /> */}
                            <Select
                                disabled={isUpdate}
                                size="medium"
                                name="groupid"
                                placeholder="Selecione o grupo"
                                labelKey="name"
                                valueKey={{ key: 'groupid', reduce: true }}
                                value={confGroupForm.formValues.groupid}
                                options={confGroupForm.groupOptions}
                                onChange={({ option }) => actions.setGroupValue(option.groupid)}
                                onClose={() => actions.setGroupOptions(zabbixGroupsOptions.data || [])}
                                onSearch={text => {

                                    // The line below escapes regular expression special characters:
                                    // [ \ ^ $ . | ? * + ( )
                                    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                                    // Create the regular expression with modified value which
                                    // handles escaping special characters. Without escaping special
                                    // characters, errors will appear in the console

                                    const exp = new RegExp(escapedText, 'i');

                                    actions.setGroupOptions(zabbixGroupsOptions.data.filter(o => exp.test(o.name)));

                                }}

                            />
                        </FormField>

                        <FormField label="Host Principal" name="main_hostid" required>
                            <Select
                                disabled={zabbixHostsOptions.isLoading}
                                size="medium"
                                name="main_hostid"
                                placeholder="Selecione o host"
                                labelKey="name"
                                valueKey={{ key: 'hostid', reduce: true }}
                                value={confGroupForm.formValues.main_hostid}
                                options={confGroupForm.hostOptions}
                                onChange={({ option }) => actions.setHostValue(option.hostid)}
                                onClose={() => actions.setHostOptions(zabbixHostsOptions.data || [])}
                                onSearch={text => {

                                    // The line below escapes regular expression special characters:
                                    // [ \ ^ $ . | ? * + ( )
                                    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                                    // Create the regular expression with modified value which
                                    // handles escaping special characters. Without escaping special
                                    // characters, errors will appear in the console

                                    const exp = new RegExp(escapedText, 'i');

                                    actions.setHostOptions(zabbixHostsOptions.data.filter(o => exp.test(o.name)));

                                }}

                            />
                        </FormField>

                        <FormField label="Item Download" name="download_itemid" required>
                            <Select
                                disabled={zabbixItemsOptions.isLoading}
                                onOpen={() => zabbixItemsOptions.refetch()}
                                size="medium"
                                name="download_itemid"
                                placeholder="Selecione o item download"
                                labelKey="name"
                                valueKey={{ key: 'itemid', reduce: true }}
                                value={confGroupForm.formValues.download_itemid}
                                options={confGroupForm.downloadOptions}
                                onChange={({ option }) => actions.setDownloadValue(option.itemid)}
                                onClose={() => actions.setDownloadOptions(zabbixItemsOptions.data || [])}
                                onSearch={text => {

                                    // The line below escapes regular expression special characters:
                                    // [ \ ^ $ . | ? * + ( )
                                    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                                    // Create the regular expression with modified value which
                                    // handles escaping special characters. Without escaping special
                                    // characters, errors will appear in the console

                                    const exp = new RegExp(escapedText, 'i');

                                    actions.setDownloadOptions(zabbixItemsOptions.data.filter(o => exp.test(o.name)));

                                }}

                            />
                        </FormField>

                        <FormField label="Item Upload" name="upload_itemid" required>
                            <Select
                                disabled={zabbixItemsOptions.isLoading}
                                onOpen={() => zabbixItemsOptions.refetch()}
                                size="medium"
                                name="upload_itemid"
                                placeholder="Selecione o item upload"
                                labelKey="name"
                                valueKey={{ key: 'itemid', reduce: true }}
                                value={confGroupForm.formValues.upload_itemid}
                                options={confGroupForm.uploadOptions}
                                onChange={({ option }) => actions.setUploadValue(option.itemid)}
                                onClose={() => actions.setUploadOptions(zabbixItemsOptions.data || [])}
                                onSearch={text => {

                                    // The line below escapes regular expression special characters:
                                    // [ \ ^ $ . | ? * + ( )
                                    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                                    // Create the regular expression with modified value which
                                    // handles escaping special characters. Without escaping special
                                    // characters, errors will appear in the console

                                    const exp = new RegExp(escapedText, 'i');

                                    actions.setUploadOptions(zabbixItemsOptions.data.filter(o => exp.test(o.name)));

                                }}

                            />
                        </FormField>

                        <FormField label="Item perda pacotes" name="ping_loss_itemid" required>
                            <Select
                                disabled={zabbixItemsOptions.isLoading}
                                onOpen={() => zabbixItemsOptions.refetch()}
                                size="medium"
                                name="ping_loss_itemid"
                                placeholder="Selecione o item perda de pacotes"
                                labelKey="name"
                                valueKey={{ key: 'itemid', reduce: true }}
                                value={confGroupForm.formValues.ping_loss_itemid}
                                options={confGroupForm.pingLossOptions}
                                onChange={({ option }) => actions.setPingLossValue(option.itemid)}
                                onClose={() => actions.setPingLossOptions(zabbixItemsOptions.data || [])}
                                onSearch={text => {

                                    // The line below escapes regular expression special characters:
                                    // [ \ ^ $ . | ? * + ( )
                                    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                                    // Create the regular expression with modified value which
                                    // handles escaping special characters. Without escaping special
                                    // characters, errors will appear in the console

                                    const exp = new RegExp(escapedText, 'i');

                                    actions.setPingLossOptions(zabbixItemsOptions.data.filter(o => exp.test(o.name)));

                                }}

                            />
                        </FormField>

                        <FormField label="Item tempo de resposta" name="ping_responsetime_itemid" required>
                            <Select
                                disabled={zabbixItemsOptions.isLoading}
                                onOpen={() => zabbixItemsOptions.refetch()}
                                size="medium"
                                name="ping_responsetime_itemid"
                                placeholder="Selecione o item tempo de resposta"
                                labelKey="name"
                                valueKey={{ key: 'itemid', reduce: true }}
                                value={confGroupForm.formValues.ping_responsetime_itemid}
                                options={confGroupForm.pingResponseTimeOptions}
                                onChange={({ option }) => actions.setResponseTimeValue(option.itemid)}
                                onClose={() => actions.setResponseTimeOptions(zabbixItemsOptions.data || [])}
                                onSearch={text => {

                                    // The line below escapes regular expression special characters:
                                    // [ \ ^ $ . | ? * + ( )
                                    const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                                    // Create the regular expression with modified value which
                                    // handles escaping special characters. Without escaping special
                                    // characters, errors will appear in the console

                                    const exp = new RegExp(escapedText, 'i');

                                    actions.setResponseTimeOptions(zabbixItemsOptions.data.filter(o => exp.test(o.name)));

                                }}

                            />
                        </FormField>


                        <FormField label="Sigla" name="sigla" required>
                            <TextInput name="sigla" value={confGroupForm.formValues.sigla} onChange={(event) => actions.setSiglaValue(event.target.value)} />
                        </FormField>
                        <FormField label="Latitude" name="latitude" required>
                            {/* <MaskedInput
                                name="latitude"
                                mask={[
                                    { regexp: /^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$/, placeholder: '00.0000' },
                                    // { fixed: '.' },
                                ]}
                            /> */}
                            <TextInput name="latitude" value={confGroupForm.formValues.latitude} onChange={(event) => actions.setLatitudeValue(event.target.value)} />
                        </FormField>
                        <FormField label="Longitude" name="longitude" required>
                            {/* <MaskedInput
                                name="longitude"
                                mask={[
                                    { regexp: /^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$/, placeholder: '00.00000' },
                                    // { fixed: '.' },
                                ]}
                            /> */}
                            <TextInput name="longitude" value={confGroupForm.formValues.longitude} onChange={(event) => actions.setLongitudeValue(event.target.value)} />
                        </FormField>



                        <Box direction="row" justify="between" margin={{ top: 'medium' }}>
                            <Button label="Cancelar" onClick={() => navigate(`/conf-groups/`)} />
                            <Button type="submit" label={isUpdate ? "Atualizar" : "Criar"} primary />
                        </Box>

                    </Form>

                </Box>

            </Box>

        </Grommet>

    );

};