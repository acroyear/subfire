import { SvgIcon, Box, Card, IconButton, Fab } from '@mui/material';

export interface CarouselCardProps {
    id: string;
    coverArtUrl: string;
    TypeIcon?: typeof SvgIcon;
    typeAction?: (id: string) => void;
    PrimaryIcon?: typeof SvgIcon;
    primaryAction?: (id: string) => void;
    SecondaryIcon?: typeof SvgIcon;
    secondaryAction?: (id: string) => void;
}

export const CarouselCard: React.FC<CarouselCardProps> = (props) => {
    const { id, coverArtUrl, TypeIcon, typeAction, PrimaryIcon, primaryAction, SecondaryIcon, secondaryAction } = props;
    return <Card sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 64px',
        gridTemplateRows: '64px 1fr 64px 1fr 64px',
        gridColumnGap: 8,
        gridRowGap: 8,
        height: '100%',
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center'
    }}>
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", gridArea: '1 / 1 / 6 / 2'
        }}>
            <img onClick={() => { primaryAction && primaryAction(id) }} src={coverArtUrl} style={{ width: 'auto', height: '100%' }}></img>
        </Box>
        {TypeIcon && <IconButton sx={{ gridArea: '1 / 2 / 2 / 3' }} onClick={() => { typeAction && typeAction(id) }}><TypeIcon /></IconButton>}
        {SecondaryIcon && <IconButton sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center", gridArea: '3 / 2 / 4 / 3'
        }} onClick={() => { secondaryAction && secondaryAction(id) }}><SecondaryIcon /></IconButton>}
        {PrimaryIcon && <IconButton sx={{ gridArea: '5 / 2 / 6 / 3' }} onClick={() => { primaryAction && primaryAction(id) }}><PrimaryIcon /></IconButton>}
    </Card>;

}
