import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

function Sidebar() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState();
  const spotifyApi = useSpotify();
  const [playlistId, setplayListId] = useRecoilState(playlistIdState);

  // Get the users playlists
  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  // Get the users first playlist as default
  useEffect(() => {
    setplayListId(playlists?.[0]?.id);
  }, [playlists]);

  return (
    <div className="text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen hidden md:inline-flex sm:max-w-[12rem] lg:max-w-[15rem] pb-36">
      <div className="space-y-4">
        <button className="flex  items-center space-x-2 hover:text-white">
          <HomeIcon className="w-5 h-5" />
          <p>Home</p>
        </button>
        <button className="flex  items-center space-x-2 hover:text-white">
          <SearchIcon className="w-5 h-5" />
          <p>Search</p>
        </button>
        <button className="flex  items-center space-x-2 hover:text-white">
          <LibraryIcon className="w-5 h-5" />
          <p>Your library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex  items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="w-5 h-5" />
          <p>Create playlist</p>
        </button>
        <button className="flex  items-center space-x-2 hover:text-white">
          <HeartIcon className="w-5 h-5" />
          <p>Liked songs</p>
        </button>
        <button className="flex  items-center space-x-2 hover:text-white">
          <RssIcon className="w-5 h-5" />
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        {playlists?.map((playlist) => (
          <p
            key={playlist.id}
            className="cursor-pointer hover:text-white"
            onClick={() => setplayListId(playlist.id)}
          >
            {playlist?.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
