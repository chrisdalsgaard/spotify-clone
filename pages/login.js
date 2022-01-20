import { getProviders, signIn } from "next-auth/react";
import Image from "next/image";

function Login({ providers }) {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center">
      {Object.values(providers).map((provider) => (
        <div key={provider.id} className="w-96">
          <div>
            <h1 className="text-center font-semibold text-4xl mb-20 text-white">
              Login with your {provider.name} credentials
            </h1>
          </div>
          <Image
            width={2362}
            height={709}
            src={"/Spotify_Logo_CMYK_Green.png"}
          />
          <div className="text-center">
            <button
              className="bg-[#1DB954] px-10 py-4 rounded-full shadow-sm mt-16"
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              <p className="text-white font-bold">Log in</p>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
