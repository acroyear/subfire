import { ArtistActionButtons } from '../..';

export default {
  title: 'controls/ArtistActionButtons'
};

export const ArtistActionButtonsTest = (_props: any) => {
  const onClick = (type: string): void => {
    document.getElementById('status').innerHTML = type;
  }

  return <>
    <span id="status"></span>
    <br />
    <p>Music Directory (with back)</p>
    <ArtistActionButtons onClick={onClick} showBackButton id={"5"}></ArtistActionButtons>
    <p>Artist (with back and children)</p>
    <ArtistActionButtons onClick={onClick} showBackButton isArtist id={"5"}><b>XX</b></ArtistActionButtons>
    <p>Album (without back)</p>
    <ArtistActionButtons onClick={onClick} artistId={"4"} id={"5"}></ArtistActionButtons>
  </>
}
