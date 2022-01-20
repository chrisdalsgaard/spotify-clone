import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/timeConverter";
import { isPlayingState, currentTrackIdState } from "../atoms/songAtom";
import { useRecoilState } from "recoil";

function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const [isPlaying, setisPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setcurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const playSong = () => {
    setcurrentTrackId(track.track.id);
    setisPlaying(true);
    spotifyApi
      .play({
        uris: [track.track.uri],
      })
      .catch((error) => {
        console.log("Error playing song from SpotifyAPI: " + error);
      });
  };

  console.log(currentTrackId);

  return (
    <div
      className="grid grid-cols-2 text-gray-500 py-4 px-4 hover:bg-gray-800 rounded-xl cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="w-10 h-10"
          src={track?.track?.album?.images?.[0]?.url}
          alt="Album art"
        />
        <div>
          <p className="w-36 lg:w-64 truncate text-white">{track.track.name}</p>
          <p className="w-40">{track.track.artist}</p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden md:inline w-40">{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}

export default Song;
