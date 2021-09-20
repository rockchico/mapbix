import { Avatar } from 'grommet';
import { Button, Nav, Box, Tip, Text } from 'grommet';
import { Notification, Analytics, Chat, Clock, Configure, Help, Projects, Split, StatusInfoSmall, ZoomIn, ZoomOut, Map as MapPoint } from 'grommet-icons';

import styles from 'AppStyles/SeverityStatus.module.css'

import ButtonTip from 'AppComponents/ButtonTip'





const SeverityStatus = ({ severity, pin, button, onClick }) => {



    let label = "";
    let color = "";

    let pinStyle = {
        border: '1px solid #708090',
        backgroundColor: '#32CD32',
        borderRadius: 30,
        height: 10,
        width: 10,
    }

    let avatarStyle = {
        border: '1px solid #708090',
        height: 30,
        width: 30,
        margin: 0,
        color: '#fff',
        backgroundColor: 'red',
        float: 'left'
    }

    let labelStyle = {
        color: "#000",
        backgroundColor: "green",
        padding: '10px'
    };

    switch (severity) {

        case 0:
            label = "Sem Problemas"
            //color = "97AAB3"
            color = "#32CD32"
            break;

        case 1:
            label = "Informação"
            color = "#7499FF"
            break;

        case 2:
            label = "Atenção"
            color = "#FFC859"
            break;

        case 3:
            label = "Média"
            color = "#FFA059"
            break;

        case 4:
            label = "Alta"
            color = "#E97659"
            break;

        case 5:
            label = "Desastre"
            color = "#E45959"
            break;

        case 6:
            label = "Desastre Alto"
            color = "#ff0000"

            //avatarStyle.animation = 'blinker 1s ease-out infinite'

            pinStyle.border = '7px solid rgb(290, 90, 90)'
            pinStyle.backgroundColor = 'red'
            pinStyle.borderRadius = 30
            pinStyle.height = 15
            pinStyle.width = 15
            //pinStyle.animation = 'pulsate 1s ease-out infinite'

            break;

        case 7:
            label = "Em manutençao"
            color = "#fff"
            break;

        default:
            label = "Sem Problemas"
            //color = "97AAB3"
            color = "#32CD32"
            break;
    }

    pinStyle.backgroundColor = color;
    avatarStyle.backgroundColor = color;
    labelStyle.backgroundColor = color;

    //avatarStyle.marginTop = 13;


    const SeverityAvatar = () => (
        <Avatar
            background={color}
            size='small'
            round="large"
            style={avatarStyle}
            //className={severity == 6 ? styles.pulsate : ''}
            className={severity == 6 ? styles.blink : ''}
        >

        </Avatar>
    );


    if (pin) {
        return (
            <div style={pinStyle} className={severity == 6 ? styles.pulsate : ''}></div>
        )
    }

    if (button) {

        const tip = 'Mostra pontos com a condição:';

        return (
            <Button
                onClick={() => onClick()}
                icon={<SeverityAvatar />}
                plain
                size="small"
                tip={{
                    plain: true,
                    content: (
                        <ButtonTip>
                            <Text>{`${tip} ${label}`}</Text>
                        </ButtonTip>
                    )
                }}
            />
        )
    }

    return (
        <>
            <SeverityAvatar />
        </>
    )
}

export default SeverityStatus