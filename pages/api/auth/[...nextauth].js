import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { authorizeURL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedAccessToken } =
      await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedAccessToken.access_token,
      accessTokenExpires: Date.now() + refreshedAccessToken.expires_in * 1000,
      refreshToken: refreshedAccessToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log("Failed to refresh access token from SpotifyAPI " + error);

    return {
      ...token,
      error: "RefreshAccessToken",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: authorizeURL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/autherror",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // intital signin
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          userName: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        };
      }
      // Access token not expired
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token expired
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refresh = token.refreshToken;
      session.user.userName = token.userName;

      return session;
    },
  },
});
