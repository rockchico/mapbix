// https://visgl.github.io/react-map-gl/examples/controls

import React, { useEffect, useState } from 'react';
import _ from "lodash";

import { Box, Text } from 'grommet';


import ReactMapGL, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl, GeolocateControl } from 'react-map-gl';
import { useMap } from 'AppHooks/map'


import useWindowSize from 'AppHooks/useWindowSize'
import MapControlPanel from 'AppComponents/MapControlPanel';
import SeverityStatus from 'AppComponents/SeverityStatus';
import LoadingSpinner from 'AppComponents/LoadingSpinner'


const MapGroupsMarkers = () => {

    const {
        state: {
            mapGroups,
        },
        actions: mapActions
    } = useMap();


    const markers = [];

    if (mapGroups.isLoading) {
        return (
            <Box justify="center" align="center" direction="row">
                <LoadingSpinner loadingMessage={'Carregando marcadores ... '} />
            </Box>
        );
    }

    if (mapGroups.isError) {
        return (
            <Box justify="center" align="center" direction="row">
                <Text>Erro ao carregar marcadores...</Text>
            </Box>
        );
    }


    if (mapGroups.isSuccess) {

        const { data } = mapGroups;

        if (data.length) {
            data?.map(group => {
                markers.push(
                    <Marker
                        offsetLeft={-5}
                        offsetTop={-5}
                        key={group.info.ID}
                        longitude={group.info.longitude}
                        latitude={group.info.latitude}
                        key={group.groupid}
                    >
                        <div onClick={() => { mapActions.goToWithInfo(group.groupid) }} style={{ backgroundColor: 'none' }}>
                            <SeverityStatus pin={true} severity={group.maxPriority} />
                        </div>


                    </Marker>
                )
            });
        }
    }



    return <div>{markers}</div>
}




function Map({ MAPBOX_TOKEN, MAP_CENTER_LATITUDE, MAP_CENTER_LONGITUDE }) {

    const {
        state: {
            mapGroups,
            map: {
                viewPort
            }
        },
        actions: mapActions
    } = useMap();

    const size = useWindowSize();




    /**
     * Corrige o tamanho do mapa sempre que a janela for redimencionada
     */
    useEffect(() => {
        mapActions.setViewport({ ...viewPort, width: size.width, height: size.height })
    }, [size.width, size.height]);

    /**
     * Corrige o tamanho do mapa sempre que a janela for redimencionada
     */
    useEffect(() => {
        mapActions.setDefaultMapCenter({ latitude: MAP_CENTER_LATITUDE, longitude: MAP_CENTER_LONGITUDE })
    }, [MAP_CENTER_LATITUDE, MAP_CENTER_LONGITUDE]);







    return (





        <Box fill direction='row' flex overflow={{ horizontal: 'hidden' }}>
            <Box flex align='center' justify='center'>
                <ReactMapGL
                    {...viewPort}
                    width="100%"
                    height="100%"
                    onViewportChange={nextViewport => mapActions.setViewport(nextViewport)}
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    mapStyle={'mapbox://styles/mapbox/outdoors-v10?optimize=true'} // ?optimize=true https://docs.mapbox.com/help/troubleshooting/mapbox-gl-js-performance/
                    mapOptions={{ refreshExpiredTiles: false }}
                >

                    <MapGroupsMarkers />

                </ReactMapGL>

                <MapControlPanel />
                {/*<MapSeverityPanel />*/}

            </Box>
        </Box>



    );
}



export default Map