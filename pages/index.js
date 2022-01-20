import { getSession, session } from "next-auth/react";
import Center from "../components/Center";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";
import Head from "next/head";
import { ExclamationIcon } from "@heroicons/react/outline";
import useSpotify from "../hooks/useSpotify";
import { spotifyActiveDeviceState } from "../atoms/spotifyAtom";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { isPlayingState } from "../atoms/songAtom";

export default function Home() {
  const spotifyApi = useSpotify();
  const [spotifyDevice, setSpotifyDevice] = useRecoilState(
    spotifyActiveDeviceState
  );

  // Check the device status of spotify client every 30 seconds
  useEffect(() => {
    if (!spotifyDevice) {
      checkDeviceState();
    }
  }, [
    setInterval(() => {
      checkDeviceState;
    }, 30 * 1000),
  ]);

  const checkDeviceState = () => {
    spotifyApi
      .getMyDevices()
      .then((data) => {
        data.body.devices.map((device) => {
          if (device.is_active) {
            setSpotifyDevice(device);
          }
        });
      })
      .catch((error) => {
        console.log(
          "Error getting device from spotify. You should open a spotify session",
          error
        );
      });
  };

  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className="flex h-screen">
        {!spotifyDevice && (
          <div className="absolute top-1/2 flex items-center justify-center space-x-5 bg-green-500 flexpx-28 py-5 text-center left-10 right-10 lg:left-1/3 lg:right-1/3 rounded-lg text-white font-bold text-base">
            <ExclamationIcon className="w-7 h-7" />
            <p>Please start a spotify client</p>
          </div>
        )}
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
}

// We make sure that we have a session from next auth whhen we render the index page
export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
