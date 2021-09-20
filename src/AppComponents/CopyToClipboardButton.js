import { useEffect, useState } from 'react';
import { Box, Button } from 'grommet';
import { Copy } from 'grommet-icons';

import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyToClipboardButton = ({ textToCopy }) => {

    const [isCopied, setIsCopied] = useState(false);

    const onCopyText = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    };

    const CopyButton = ({ label }) => (
        <Button 
            primary 
            label={label}
            icon={<Copy />} 
        />
    )

    return (
        <CopyToClipboard 
            text={`<pre>${textToCopy}</pre>`} 
            onCopy={onCopyText} 
            options={{ format: "text/html"}}>
            <span>{isCopied ? <CopyButton label="Informações copiadas" /> : <CopyButton label="Copiar informações" />}</span>
        </CopyToClipboard>
    )
}

export default CopyToClipboardButton