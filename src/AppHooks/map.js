import React, { useState, useContext, useReducer, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import MapContext from 'AppContext/MapContext'
import appReducer, { actionTypes } from 'AppReducers/index'
import { useMapGroups } from 'AppHooks/Data/useMapGroups'




let mapDefaultViewport = {
    latitude: 0,
    longitude: 0,
    zoom: 3,
    bearing: 0,
    pitch: 0,
    width: '100%',
    height: '100%'
}


export function ProvideMap({ children }) {
    const map = useProvideMap();
    return <MapContext.Provider value={map}>{children}</MapContext.Provider>;
}

export const useMap = () => {
    return useContext(MapContext);
};

function useProvideMap() {

    const navigate = useNavigate();


    const [showSeverity, setShowSeverity] = useState(null);
    const [searchMapGroups, setSearchMapGroups] = useState("");

    const [activeMapGroup, setActiveMapGroup] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    const mapGroups = useMapGroups(showSeverity, searchMapGroups);

    const { groupid } = useParams()


    const [state, dispatch] = useReducer(appReducer, {
        map: { viewPort: mapDefaultViewport },
    })


    const { map } = state;

    /**
     * Configura o mapGroup ativo e o seu respectivo index no array de mapGroups.
     */
    useEffect(() => {

        if (groupid && mapGroups.isSuccess) {

            // verifica se existe mapGroup com o paraêmtro groupid especificado
            const index = mapGroups.data?.findIndex(g => g.groupid === parseInt(groupid, 10))

            if (mapGroups.data[index]) {
                setActiveIndex(index)
                setActiveMapGroup(mapGroups.data[index])
            }

        } else {
            setActiveIndex(null)
            setActiveMapGroup(null)
        }

    }, [mapGroups.isSuccess, groupid]);


    /**
     * Verifica se o activeMapGroup foi configurado. Se sim aponta o mapa na direção latitue e longitude.
     */
    useEffect(() => {
        if (activeMapGroup !== null) {
            goTo(activeMapGroup.info.latitude, activeMapGroup.info.longitude);
        }
    }, [activeMapGroup, groupid]);




    const setViewport = (viewPort) => {
        //e.preventDefault();
        dispatch({ type: actionTypes.SET_VIEWPORT, viewPort })
    };

    const setDefaultMapCenter = ({ latitude, longitude }) => {
        //e.preventDefault();
        mapDefaultViewport = { ...mapDefaultViewport, latitude, longitude }
        centerViewport();
    };


    const centerViewport = () => {
        //e.preventDefault();
        setViewport(mapDefaultViewport)
    };

    const zoomIn = () => {
        dispatch({ type: actionTypes.ZOOM_IN })
    };

    const zoomOut = () => {
        dispatch({ type: actionTypes.ZOOM_OUT })
    };


    /**
     * 
     * @param {*} latitude 
     * @param {*} longitude 
     */
    const goTo = (latitude, longitude) => {
        dispatch({ type: actionTypes.GO_TO, latitude, longitude })
    };

    const goToWithInfo = (groupid) => {

        // se o mapGroup.groupid for igual ao activeMapGroup?.groupid significa que o usuário esta clicando no mesmo mapGroup
        if (activeMapGroup?.groupid === groupid) {
            navigate(`/map-groups`)
        } else {
            navigate(`/map-groups/${groupid}`)
        }


    };


    /**
     * Mostra no mapa somente os grupos com a severidade especifica
     * Limpa a pesquisa e seta a severidade desejada. Além de centralizar o mapa e resetar o grupo ativo.
     * @param {*} showSeverity 
     */
    const showMarkers = (showSeverity) => {
        setSearchMapGroups('')
        setShowSeverity(showSeverity)

        centerViewport()
        setActiveIndex(null)
        setActiveMapGroup(null)

    };



    return {

        actions: {
            setViewport,
            setDefaultMapCenter,
            centerViewport,
            zoomIn,
            zoomOut,
            goTo,
            goToWithInfo,
            showMarkers,
            setSearchMapGroups,

            setActiveMapGroup,
            setActiveIndex,


        },
        state: {
            map,

            mapGroups,
            searchMapGroups,
            showSeverity,

            activeIndex,

            mapDefaultViewport
        }

    }

}
