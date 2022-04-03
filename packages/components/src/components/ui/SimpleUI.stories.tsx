import { ButtonRow } from "./ButtonRow";
import {
    Radio,
} from "@mui/icons-material";
import { Button, Fab, IconButton, Switch } from "@mui/material";
import { useToggle } from "react-use";

export default {
    title: 'ui/SimpleUI'
};

export const ButtonRowDemo = (_args: any) => {
    const [left, toggleLeft] = useToggle(false);
    return (
        <>
            <Switch checked={left} onChange={(x) => toggleLeft(x.target.checked)}></Switch>
            <ButtonRow rowStyle={{ width: '80vw' }} alignLeft={left}>
                {!left && <IconButton><Radio /></IconButton>}
                <Button><Radio /></Button>
                <IconButton><Radio /></IconButton>
                <Fab><Radio /></Fab>
                <IconButton><Radio /></IconButton>
                <Button><Radio /></Button>
            </ButtonRow>
        </>);
}