import React, { useEffect } from 'react';
import dynamic from 'next/dynamic'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import _ from 'lodash'


import Layout from 'AppComponents/Layout';
import SidebarMapGroups from 'AppComponents/SidebarMapGroups'
import LoadingSpinner from 'AppComponents/LoadingSpinner'
import { ProvideMap } from 'AppHooks/map'
import Map from 'AppComponents/Map';

// import { useConfGroups } from 'AppHooks/Data/useConfGroups'
// import { useConfGroup } from 'AppHooks/Data/useConfGroup'
// import { useConfGroupCreate } from 'AppHooks/Data/useConfGroupCreate'
// import { useConfGroupUpdate } from 'AppHooks/Data/useConfGroupUpdate'
// import { useConfGroupDelete } from 'AppHooks/Data/useConfGroupDelete'
import { ConfGroupTable } from 'AppComponents/ConfGroupTable';
import { ConfGroupForm } from 'AppComponents/ConfGroupForm';
import { ConfGroupFormUpdate } from 'AppComponents/ConfGroupFormUpdate';
import { ConfGroupFormDelete } from 'AppComponents/ConfGroupFormDelete';


function SafeHydrate({ children }) {
    return (
        <div suppressHydrationWarning>
            {typeof document === 'undefined' ? null : children}
        </div>
    )
}

// const MapDynamic = dynamic(
//     () => import('AppComponents/Map'), // replace '@components/map' with your component's location
//     {
//         ssr: true, // This line is important. It's what prevents server-side render
//         loading: () => <LoadingSpinner loadingMessage={"Carregando Mapa ..."} />,
//     }
// )






export const IndexPage = ({ MAPBOX_TOKEN, APP_NAME, MAP_CENTER_LATITUDE, MAP_CENTER_LONGITUDE }) => {

    const MapComponent = () => (
        <Map MAPBOX_TOKEN={MAPBOX_TOKEN} MAP_CENTER_LATITUDE={MAP_CENTER_LATITUDE} MAP_CENTER_LONGITUDE={MAP_CENTER_LONGITUDE} />
    );


    return (

        <SafeHydrate>
            <BrowserRouter>
                <Routes>

                    <Route
                        path="/"
                        element={
                            <ProvideMap>
                                <Layout
                                    APP_NAME={APP_NAME}
                                    mainComponent={<MapComponent />}
                                />
                            </ProvideMap>

                        }
                    />
                    <Route
                        path="/map-groups/"
                        element={
                            <ProvideMap>
                                <Layout
                                    APP_NAME={APP_NAME}
                                    mainComponent={<MapComponent />}
                                    sidebarComponent={<SidebarMapGroups />}
                                />
                            </ProvideMap>

                        }
                    />
                    <Route
                        path="/map-groups/:groupid"
                        element={
                            <ProvideMap>
                                <Layout
                                    APP_NAME={APP_NAME}
                                    mainComponent={<MapComponent />}
                                    sidebarComponent={<SidebarMapGroups />}
                                />
                            </ProvideMap>
                        }
                    />
                    <Route
                        path="/conf-groups"
                        element={
                            <Layout
                                APP_NAME={APP_NAME}
                                mainComponent={<ConfGroupTable />}
                            />

                        }
                    />

                    <Route
                        path="/conf-groups/create"
                        element={
                            <Layout
                                APP_NAME={APP_NAME}
                                mainComponent={<ConfGroupForm action='c' />}
                            />
                        }
                    />

                    <Route
                        path="/conf-groups/update/:groupid"
                        element={
                            <Layout
                                APP_NAME={APP_NAME}
                                mainComponent={<ConfGroupFormUpdate />}
                            />
                        }
                    />

                    <Route
                        path="/conf-groups/delete/:groupid"
                        element={
                            <Layout
                                APP_NAME={APP_NAME}
                                mainComponent={<ConfGroupFormDelete />}
                            />
                        }
                    />

                </Routes>
            </BrowserRouter>
        </SafeHydrate>

    );

};

// This gets called on every request
export async function getServerSideProps() {

    const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
    const APP_NAME = process.env.APP_NAME || "Mapbix";
    const MAP_CENTER_LATITUDE = parseFloat(process.env.MAP_CENTER_LATITUDE);
    const MAP_CENTER_LONGITUDE = parseFloat(process.env.MAP_CENTER_LONGITUDE);


    // Pass data to the page via props
    return { props: { MAPBOX_TOKEN, APP_NAME, MAP_CENTER_LATITUDE, MAP_CENTER_LONGITUDE } }
}

export default IndexPage