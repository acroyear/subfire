import { useEffect } from "react";
import { useToggle } from "react-use";
import { FuzzyBackgroundImageStates, useFuzzyImageBackgroundState } from "../../hooks/useFuzzyImageBackground";
import FuzzyImageBackground from "./FuzzyImageBackground";

export default {
    title: 'ui/FuzzyImageBG'
};

export const FuzzyTestSimple = () => {
    const initialStates = {
        default: {
            backgroundAttachment: 'fixed',
            backgroundPosition: 'calc(100% - 50%) calc(100% - 15%)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '170%',
            opacity: 0.35,
            filter: 'blur(20px)'
        }
    };
    const currentState = "default";
    const currentImage = "https://sfclassical.aboutjws.info/rest/getCoverArt.view?id=106384&size=405&v=1.15.0&f=json&c=SubFireBase&u=subfire&s=ifmjyhvrcg&t=d68221010c831ca93ed1b808ad5293a6";

    return <>
        <FuzzyImageBackground states={initialStates} currentState={currentState} currentImage={currentImage}>
            <div style={{ border: '1px solid black', whiteSpace: 'pre', fontWeight: 'bold', zIndex: 1000 }}>
                {`                Now we have lots of stuf

                that

                might

                get

                really

                big

                and

                long`}
            </div>
        </FuzzyImageBackground>
    </>
}

export const FuzzyTestSwitch = () => {
    const initialStates: FuzzyBackgroundImageStates = {
        paused: {
            backgroundAttachment: 'fixed',
            backgroundPosition: 'calc(100% - 50%) calc(100% - 15%)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '170%',
            opacity: 0.15,
            filter: 'blur(40px)'
        },
        playing: {
            backgroundAttachment: 'fixed',
            backgroundPosition: 'calc(100% - 50%) calc(100% - 15%)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '170%',
            opacity: 0.35,
            filter: 'blur(20px)'
        }
    };
    const currentState = "paused";
    const currentImage = "https://sfclassical.aboutjws.info/rest/getCoverArt.view?id=106384&size=405&v=1.15.0&f=json&c=SubFireBase&u=subfire&s=ifmjyhvrcg&t=d68221010c831ca93ed1b808ad5293a6";

    const [fuzzyState, setFuzzyBackgroundState] = useFuzzyImageBackgroundState();

    const [playing, togglePlaying] = useToggle(true);
    useEffect(() => {
        setFuzzyBackgroundState(
            playing ? 'playing' : 'paused'
        );
    }, [playing]);

    console.log(playing);
    console.log(fuzzyState);

    return <>
        <FuzzyImageBackground states={initialStates} currentState={currentState} currentImage={currentImage}>
            <button onClick={() => togglePlaying(!playing)}>Toggle Playing</button>
            <div style={{ border: '1px solid black', whiteSpace: 'pre', fontWeight: 'bold', zIndex: 1000 }}>
                {`                Now we have lots of stuf

                that

                might

                get

                really

                big

                and

                long`}
            </div>
        </FuzzyImageBackground>
    </>
}