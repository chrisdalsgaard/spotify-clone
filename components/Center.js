import { signOut, useSession } from "next-auth/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playListState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

function Center() {
  const { data: session } = useSession();
  const [backgroundColor, setBackgroundColor] = useState();
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playListState);
  const spotifyApi = useSpotify();

  const colors = [
    "from-red-500",
    "from-blue-300",
    "from-green-500",
    "from-yello-500",
    "from-pink-500",
    "from-purple-500",
    "from-indigo-500",
  ];

  useEffect(() => {
    setBackgroundColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (playlistId) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data.body);
        })
        .catch((err) => {
          console.log(
            "Failed to fetch playlist from spotifyAPI with error " + err
          );
        });
    }
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow text-white overflow-y-scroll h-screen scrollbar-hide">
      <header className="absolute top-5 right-5 ">
        <div
          className="flex items-center space-x-4 bg-black rounded-full opacity-90 hover:opacity-80 cursor-pointer p-1 pr-2"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            src={session?.user.image}
            alt={`User profile image of ${session?.user.name}`}
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${backgroundColor} h-80 text-white p-8`}
      >
        <img
          className="w-44 h-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt={`Playlist ${playlist?.name}`}
        />
        <div className="">
          <p>PlAYLIST</p>
          <h2 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h2>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
