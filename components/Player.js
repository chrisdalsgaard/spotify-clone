import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { debounce } from "lodash";

import {
  VolumeUpIcon as VolumeDownIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";

function Player() {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  const [isPlaying, setisPlaying] = useRecoilState(isPlayingState);
  const [currentTrackId, setcurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [volume, setVolume] = useState(50);
  const [shufflePlayback, setshufflePlayback] = useState(false);
  const [replayMode, setReplayMode] = useState(false);
  const songInfo = useSongInfo();

  const getCurrentPlayingSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setcurrentTrackId(data.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setisPlaying(data.body?.isPlaying);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken && !currentTrackId) {
      getCurrentPlayingSong();
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    debounceAjustVolume(volume);
  }, [volume]);

  const debounceAjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((error) => {
        console.log("Error changing volume: " + error);
      });
    }, 300),
    [volume]
  );

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data?.body?.is_playing) {
        spotifyApi.pause();
        setisPlaying(false);
      } else {
        spotifyApi.play();
        setisPlaying(true);
      }
    });
  };

  const handleNextSong = () => {
    spotifyApi.skipToNext().catch((error) => {
      console.log("Changing song went wrong", err);
    });
  };
  const handlePreviousSong = () => {
    spotifyApi.skipToPrevious().catch((error) => {
      console.log("Changing song went wrong", error);
    });
  };

  const setShuffle = () => {
    setshufflePlayback(!shufflePlayback);
    spotifyApi
      .setShuffle(shufflePlayback)
      .catch((error) => console.log("Error setting shuffle mode", error));
  };

  const setReplay = () => {
    setReplayMode(!replayMode);
    spotifyApi
      .setRepeat(replayMode)
      .catch((error) => console.log("Error setting replay mode", error));
  };

  return (
    <div className="h-24 bg-gradient-to-br from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-1o w-10"
          src={songInfo?.album.images?.[0]?.url}
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
        <div>
          <HeartIcon className="button" />
        </div>
      </div>

      {/* middle */}
      <div className="flex space-x-4 items-center justify-evenly">
        <SwitchHorizontalIcon onClick={setShuffle} className="button" />
        <RewindIcon onClick={handlePreviousSong} className="button" />
        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-14 h-12" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-14 h-12" />
        )}
        <FastForwardIcon onClick={handleNextSong} className="button" />
        <ReplyIcon onClick={setReplay} className="button" />
      </div>
      {/* right */}
      <div className="flex items-center space-x-3 md:sapce-x-4 justify-end pr-3">
        <VolumeDownIcon
          onClick={(e) => setVolume(Number(0))}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
          step={5}
        />
      </div>
    </div>
  );
}

export default Player;
