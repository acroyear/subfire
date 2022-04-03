import { Splide, SplideSlide } from '@splidejs/react-splide';
import PlayArrow from '@mui/icons-material/PlayArrow';
import CoverImageListItem from './CoverImageListItem';
import '@splidejs/splide/dist/css/splide.min.css';
import { Generic } from '@subfire/core';

export type ImageSlideProps = any;

export const ImageSlide: React.FC<ImageSlideProps> = (props) => {
    const {
        onClick,
        onImageClick,
        Icon = PlayArrow,
        getSubTitle = (id: string) => '',
        content = [],
        cellSize = 144
    } = props;
    const width = 144 * 5;
    return <Splide options={{
        type: 'loop',
        rewind: true,
        width: width + 48 + (4 * 8),
        perPage: (width / 144),
        perMove: 1,
        padding: 24,
        gap: '8px',
        // slideFocus: true,
        updateOnMove: true,
        focus: 'center',
        focusableNodes: 'button'
    }}>
        {content.map((n: Generic & { artist: string }) => (
            <SplideSlide key={'gl' + n.id} onClick={onClick}>
                <ul><CoverImageListItem
                    name={n.name}
                    size={cellSize}
                    artist={n.artist}
                    title={n.title}
                    subTitle={getSubTitle(n)}
                    coverArt={n.coverArt}
                    id={n.id}
                    Icon={Icon}
                    useIdforArt={false}
                /></ul></SplideSlide>
        ))}</Splide>
}
