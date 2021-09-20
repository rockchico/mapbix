import React, { useState, useReducer, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import appReducer, { actionTypes } from 'AppReducers/index'


const defaultValue = {
    formValues: {
        groupid: '',
        main_hostid: '',
        upload_itemid: '',
        download_itemid: '',
        ping_loss_itemid: '',
        ping_responsetime_itemid: '',
        sigla: "",
        //nome: "",
        latitude: '',
        longitude: '',
    },
    teste: {
        foo: 'x',
        val: 0
    },
    groupOptions: [],
    hostOptions: [],
    uploadOptions: [],
    downloadOptions: [],
    pingLossOptions: [],
    pingResponseTimeOptions: [],
};

export const useConfGroupForm = () => {


    const [state, dispatch] = useReducer(appReducer, {
        confGroupForm: {
            ...defaultValue
        },
    })

    const { confGroupForm } = state;

    const setTest = (teste) => {
        //e.preventDefault();
        const params = { foo: 'foo', bar: 9 }
        dispatch({ type: actionTypes.TESTE, teste })
    };


    const setFormValues = (formValues) => {
        dispatch({ type: actionTypes.SET_FORM_VALUES, formValues })
    };


    const setGroupValue = (groupid) => {
        dispatch({ type: actionTypes.SET_GROUP_VALUE, groupid })
    };

    const setGroupOptions = (options) => {
        dispatch({ type: actionTypes.SET_GROUP_OPTIONS, options })
    };


    const setHostValue = (hostid) => {
        dispatch({ type: actionTypes.SET_HOST_VALUE, hostid })
    };

    const setHostOptions = (options) => {
        dispatch({ type: actionTypes.SET_HOST_OPTIONS, options })
    };

    const setUploadValue = (itemid) => {
        dispatch({ type: actionTypes.SET_UPLOAD_VALUE, itemid })
    };

    const setUploadOptions = (options) => {
        dispatch({ type: actionTypes.SET_UPLOAD_OPTIONS, options })
    };

    const setDownloadValue = (itemid) => {
        dispatch({ type: actionTypes.SET_DOWNLOAD_VALUE, itemid })
    };

    const setDownloadOptions = (options) => {
        dispatch({ type: actionTypes.SET_DOWNLOAD_OPTIONS, options })
    };

    const setPingLossValue = (itemid) => {
        dispatch({ type: actionTypes.SET_PINGLOSS_VALUE, itemid })
    };

    const setPingLossOptions = (options) => {
        dispatch({ type: actionTypes.SET_PINGLOSS_OPTIONS, options })
    };

    const setResponseTimeValue = (itemid) => {
        dispatch({ type: actionTypes.SET_RESPONSETIME_VALUE, itemid })
    };

    const setResponseTimeOptions = (options) => {
        dispatch({ type: actionTypes.SET_RESPONSETIME_OPTIONS, options })
    };

    const setItemOptions = (options) => {
        dispatch({ type: actionTypes.SET_BANDWIDTH_OPTIONS, options })
    };


    const setSiglaValue = (sigla) => {
        dispatch({ type: actionTypes.SET_SIGLA_VALUE, sigla })
    };

    const setLatitudeValue = (latitude) => {
        dispatch({ type: actionTypes.SET_LATITUDE_VALUE, latitude })
    };

    const setLongitudeValue = (longitude) => {
        dispatch({ type: actionTypes.SET_LONGITUDE_VALUE, longitude })
    };




    return {
        actions: {
            setTest,
            setGroupValue,
            setGroupOptions,
            setHostValue,
            setHostOptions,
            setUploadValue,
            setUploadOptions,
            setDownloadValue,
            setDownloadOptions,
            setPingLossValue,
            setPingLossOptions,
            setResponseTimeValue,
            setResponseTimeOptions,

            setItemOptions,

            setSiglaValue,
            setLongitudeValue,
            setLatitudeValue,

            setFormValues

        },
        state: {
            confGroupForm
        }
    }

}
