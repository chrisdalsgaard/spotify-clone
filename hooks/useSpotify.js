import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const clientId = process.env.SPOTIFY_CLIENT_ID,
  clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
});

function useSpotify() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error === "RefreshAccessToken") {
        signIn();
      }

      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
}

export default useSpotify;
