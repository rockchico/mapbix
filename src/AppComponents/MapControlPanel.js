import * as React from 'react';
import { Button, Nav, Box, Tip, Text } from 'grommet';
import { ZoomIn, ZoomOut, Map as MapPoint, CheckboxSelected } from 'grommet-icons';

import { useMap } from 'AppHooks/map'

import styles from 'AppStyles/MapControlPanel.module.css'
import SeverityStatus from 'AppComponents/SeverityStatus';
import ButtonTip from 'AppComponents/ButtonTip'


const ButtonBox = ({ children }) => {

    return (

        <Box
            pad="xxsmall"
            elevation="small"
            background="#EDEDED" // no opacity
            round="xsmall"
            margin="xxsmall"
            overflow="hidden"
            align="center"
        >
            {children}
        </Box>
    )
}


function MapControlPanel() {

    const { actions: mapActions } = useMap();


    return (
        <div className={styles.controlpanel}>
            <Nav gap="xxsmall" pad='xxsmall' margin='none' background='dark-2'>

                <ButtonBox>
                    <Button
                        onClick={() => mapActions.centerViewport()}
                        icon={<MapPoint size="medium" />}
                        plain
                        size="small"
                        tip={{
                            plain: true,
                            content: (
                                <ButtonTip>
                                    <Text>Centralizar Mapa</Text>
                                </ButtonTip>
                            )
                        }}
                    />
                </ButtonBox>

                <ButtonBox>
                    <Button
                        onClick={() => mapActions.zoomIn()}
                        icon={<ZoomIn size="medium" />}
                        plain
                        size="small"
                        tip={{
                            plain: true,
                            content: (
                                <ButtonTip>
                                    <Text>Zoom +</Text>
                                </ButtonTip>
                            )
                        }}
                    />
                </ButtonBox>

                <ButtonBox>
                    <Button
                        onClick={() => mapActions.zoomOut()}
                        icon={<ZoomOut size="medium" />}
                        plain
                        size="small"
                        tip={{
                            plain: true,
                            content: (
                                <ButtonTip>
                                    <Text>Zoom -</Text>
                                </ButtonTip>
                            )
                        }}
                    />
                </ButtonBox>

                <Box border={{ color: 'light-6', side: 'bottom' }} />

                <ButtonBox>
                    <Button
                        onClick={() => mapActions.showMarkers()}
                        icon={<CheckboxSelected size="medium" />}
                        plain
                        size="small"
                        tip={{
                            plain: true,
                            content: (
                                <ButtonTip>
                                    <Text>Mostrar todos pontos</Text>
                                </ButtonTip>
                            )
                        }}
                    />
                </ButtonBox>

                <ButtonBox>
                    <SeverityStatus severity={0} button={true} onClick={() => mapActions.showMarkers(0)} />
                </ButtonBox>
                <ButtonBox>
                    <SeverityStatus severity={1} button={true} onClick={() => mapActions.showMarkers(1)} />
                </ButtonBox>
                <ButtonBox>
                    <SeverityStatus severity={2} button={true} onClick={() => mapActions.showMarkers(2)} />
                </ButtonBox>
                <ButtonBox>
                    <SeverityStatus severity={3} button={true} onClick={() => mapActions.showMarkers(3)} />
                </ButtonBox>
                <ButtonBox>
                    <SeverityStatus severity={4} button={true} onClick={() => mapActions.showMarkers(4)} />
                </ButtonBox>
                <ButtonBox>
                    <SeverityStatus severity={5} button={true} onClick={() => mapActions.showMarkers(5)} />
                </ButtonBox>
                <ButtonBox>
                    <SeverityStatus severity={6} button={true} onClick={() => mapActions.showMarkers(6)} />
                </ButtonBox>




            </Nav>

            {/*
            
             */}
        </div>
    );
}

export default React.memo(MapControlPanel);