import { BeeD1Adapter } from "$lib/auth/adapter";
import { providers } from "$lib/auth/providers";
import { SvelteKitAuth } from "@auth/sveltekit";

const { handle, signIn, signOut } = SvelteKitAuth(async e => ({
  providers,
  adapter: BeeD1Adapter(e.platform!.env.DB),
  trustHost: true, // To trust localhost.
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 90,
    updateAge: 60 * 60 * 24 * 3,
  },
  callbacks: {
    session: async ({ session, token, trigger }) => {
      if (trigger === "update") {
        session.user.id = token.sub as string;
      }

      return session;
    },
  },
}));

export {
  signIn,
  signOut,
  handle,
}
