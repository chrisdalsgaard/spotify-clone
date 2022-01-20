import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-follow-read",
    "streaming",
    "user-top-read",
    "user-read-recently-played",
    "user-read-playback-position",
    "playlist-read-private",
    "playlist-read-collaborative",
  ],
  clientId = process.env.SPOTIFY_CLIENT_ID,
  clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes);

export default spotifyApi;
export { authorizeURL };
