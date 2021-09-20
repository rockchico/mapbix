import _ from "lodash";
import produce from 'immer';

import { FlyToInterpolator } from 'react-map-gl';



export const actionTypes = {
    SET_VIEWPORT: 'SET_VIEWPORT',
    ZOOM_IN: 'ZOOM_IN',
    ZOOM_OUT: 'ZOOM_OUT',
    GO_TO: 'GO_TO',

    TESTE: 'TESTE',

    SET_GROUP_VALUE: 'SET_GROUP_VALUE',
    SET_GROUP_OPTIONS: 'SET_GROUP_OPTIONS',
    SET_HOST_VALUE: 'SET_HOST_VALUE',
    SET_HOST_OPTIONS: 'SET_HOST_OPTIONS',
    SET_UPLOAD_VALUE: 'SET_UPLOAD_VALUE',
    SET_UPLOAD_OPTIONS: 'SET_UPLOAD_OPTIONS',
    SET_DOWNLOAD_VALUE: 'SET_DOWNLOAD_VALUE',
    SET_DOWNLOAD_OPTIONS: 'SET_DOWNLOAD_OPTIONS',
    SET_PINGLOSS_VALUE: 'SET_PINGLOSS_VALUE',
    SET_PINGLOSS_OPTIONS: 'SET_PINGLOSS_OPTIONS',
    SET_RESPONSETIME_VALUE: 'SET_RESPONSETIME_VALUE',
    SET_RESPONSETIME_OPTIONS: 'SET_RESPONSETIME_OPTIONS',
    SET_BANDWIDTH_OPTIONS: 'SET_BANDWIDTH_OPTIONS',

    SET_SIGLA_VALUE: 'SET_SIGLA_VALUE',
    SET_LATITUDE_VALUE: 'SET_LATITUDE_VALUE',
    SET_LONGITUDE_VALUE: 'SET_LONGITUDE_VALUE',


    SET_FORM_VALUES: 'SET_FORM_VALUES',
}



function mapReducer(state, action) {

    const { viewPort } = action;

    switch (action.type) {

        case actionTypes.SET_VIEWPORT:

            return produce(state, draft => {
                draft.viewPort = viewPort;
            })

        case actionTypes.ZOOM_IN:

            return produce(state, draft => {
                draft.viewPort.zoom = draft.viewPort.zoom + 1;
            })

        case actionTypes.ZOOM_OUT:

            return produce(state, draft => {
                draft.viewPort.zoom = draft.viewPort.zoom - 1;
            })

        case actionTypes.GO_TO:
            // https://visgl.github.io/react-map-gl/docs/advanced/viewport-transition

            return produce(state, draft => {
                draft.viewPort.zoom = 9;
                draft.viewPort.latitude = action.latitude;
                draft.viewPort.longitude = action.longitude;
                draft.viewPort.transitionDuration = 700;
                draft.viewPort.transitionInterpolator = new FlyToInterpolator();

            })


        default:
            return state
    }
}


function confGroupFormReducer(state, action) {


    switch (action.type) {
        case actionTypes.TESTE:

            const { teste } = action

            return produce(state, draft => {
                draft.teste = { ...teste }
            })

        case actionTypes.SET_FORM_VALUES:
            const { formValues } = action
            return produce(state, draft => {
                draft.formValues = formValues
            })

        case actionTypes.SET_GROUP_VALUE:
            return produce(state, draft => {
                draft.formValues.groupid = parseInt(action['groupid'], 10);
            })


        case actionTypes.SET_HOST_VALUE:
            return produce(state, draft => {
                draft.formValues.main_hostid = parseInt(action['hostid'], 10);
            })


        case actionTypes.SET_UPLOAD_VALUE:
            return produce(state, draft => {
                draft.formValues.upload_itemid = parseInt(action['itemid'], 10);
            })

        case actionTypes.SET_DOWNLOAD_VALUE:
            return produce(state, draft => {
                draft.formValues.download_itemid = parseInt(action['itemid'], 10);
            })

        case actionTypes.SET_PINGLOSS_VALUE:
            return produce(state, draft => {
                draft.formValues.ping_loss_itemid = parseInt(action['itemid'], 10);
            })

        case actionTypes.SET_RESPONSETIME_VALUE:
            return produce(state, draft => {
                draft.formValues.ping_responsetime_itemid = parseInt(action['itemid'], 10);
            })

        case actionTypes.SET_SIGLA_VALUE:
            return produce(state, draft => {
                draft.formValues.sigla = action['sigla']
            })

        case actionTypes.SET_LATITUDE_VALUE:
            return produce(state, draft => {
                draft.formValues.latitude = action['latitude']
            })

        case actionTypes.SET_LONGITUDE_VALUE:
            return produce(state, draft => {
                draft.formValues.longitude = action['longitude']
            })
        // ######################################




        case actionTypes.SET_GROUP_OPTIONS:
            return produce(state, draft => {
                draft.groupOptions = action['options'];
                //console.log(JSON.stringify(draft, null, 4))
            })

        case actionTypes.SET_HOST_OPTIONS:
            return produce(state, draft => {
                draft.hostOptions = action['options'];
                if (action['options'].length === 0) {
                    //draft.formValues.main_hostid = ''
                }
            })



        case actionTypes.SET_UPLOAD_OPTIONS:
            return produce(state, draft => {
                draft.uploadOptions = action['options'];
                if (action['options'].length === 0) {
                    //draft.formValues.upload_itemid = ''
                }
            })



        case actionTypes.SET_DOWNLOAD_OPTIONS:
            return produce(state, draft => {
                draft.downloadOptions = action['options'];
                if (action['options'].length === 0) {
                    //draft.formValues.download_itemid = ''
                }
            })

        case actionTypes.SET_PINGLOSS_OPTIONS:
            return produce(state, draft => {
                draft.pingLossOptions = action['options'];
                if (action['options'].length === 0) {
                    //draft.formValues.ping_loss_itemid = ''
                }
            })

        case actionTypes.SET_RESPONSETIME_OPTIONS:
            return produce(state, draft => {
                draft.pingResponseTimeOptions = action['options'];
                if (action['options'].length === 0) {
                    //draft.formValues.ping_responsetime_itemid = ''
                }
            })


        case actionTypes.SET_BANDWIDTH_OPTIONS:
            return produce(state, draft => {
                draft.downloadOptions = action['options'];
                draft.uploadOptions = action['options'];
                draft.pingLossOptions = action['options'];
                draft.pingResponseTimeOptions = action['options'];

                if (action['options'].length === 0) {
                    draft.formValues.download_itemid = ''
                    draft.formValues.upload_itemid = ''
                    draft.formValues.ping_loss_itemid = ''
                    draft.formValues.ping_responsetime_itemid = ''
                }
            })



        default:
            return state
    }
}



export default function appReducer(state, action) {
    return {
        map: mapReducer(state.map, action),
        confGroupForm: confGroupFormReducer(state.confGroupForm, action)
    }
}
