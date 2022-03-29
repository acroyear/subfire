import { Album, PlayArrow, Shuffle } from "@mui/icons-material";
import { Subsonic } from "@subfire/core";
import { buildProcessEnvCredentials } from "@subfire/hooks";
import { CarouselCard } from "./CarouselCard";
export default {
    title: "ui/cards",
};

function action(s: unknown) { console.log(s); }

export const CarouselCards = (_props: any) => {
    const { server, username, password, bitrate, name = 'SubsonicStorybook' } = buildProcessEnvCredentials();
    Subsonic.configure(server, username, password, bitrate, name, false);
    const url = Subsonic.getCoverArtURL('530', 240);
    return <div style={{ width: 480, height: 240 }}>
        <CarouselCard coverArtUrl={url} id='530'
            TypeIcon={Album}
            typeAction={(id) => action(`type ${id}`)}
            PrimaryIcon={PlayArrow}
            primaryAction={(id) => action(`primary ${id}`)}
            SecondaryIcon={Shuffle}
            secondaryAction={(id) => action(`secondary ${id}`)}
        />
    </div>
}

export const TestStyle = (_p: unknown) => {
    return <>
        <style>
            {`
            div {
                border: 1px solid black;
            }
            
            .parent {
                border: 1px solid blue;
                height: 480px;
                width: 800px;
display: grid;
grid-template-columns: 1fr 64px 20% repeat(2, 64px);
grid-template-rows: repeat(5, 1fr);
grid-column-gap: 0px;
grid-row-gap: 0px;
}

.div1 { grid-area: 1 / 1 / 2 / 2; }
.div2 { grid-area: 2 / 2 / 3 / 3; }
.div3 { grid-area: 4 / 4 / 5 / 5; }
.div4 { grid-area: 3 / 4 / 4 / 5; }
.div5 { grid-area: 2 / 4 / 3 / 5; }
.div6 { grid-area: 1 / 5 / 2 / 6; }
.div7 { grid-area: 1 / 3 / 2 / 4; }
.div8 { grid-area: 2 / 3 / 3 / 4; }
.div9 { grid-area: 3 / 3 / 4 / 4; }
.div10 { grid-area: 4 / 3 / 5 / 4; }
.div11 { grid-area: 5 / 3 / 6 / 4; }`}
        </style>
        <div className="parent">
<div className="div1"> </div>
<div className="div2"> </div>
<div className="div3"> </div>
<div className="div4"> </div>
<div className="div5"> </div>
<div className="div6"> </div>
<div className="div7"> </div>
<div className="div8"> </div>
<div className="div9"> </div>
<div className="div10"> </div>
<div className="div11"> </div>
</div>
    </>
}