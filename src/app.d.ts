// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Ai, D1Database } from "@cloudflare/workers-types";
// import type { Session } from "@auth/sveltekit";
// import type { DefaultSession } from "@auth/sveltekit";

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session?: {
        user?: {
          id: string;
          email: string;
          name: string;
        };
      };
      user?: {
        id: string;
        email: string;
        name: string;
      } | null;
    }
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      // Required to use wrangler stuff from the svelte's `platform`.
      env: {
        AUTH_SECRET: string;
        DB: D1Database;
        AI: Ai;
      };
    }
  }
}

/* declare module "@auth/sveltekit" {
  interface Session {
    user: {
      provider: string
    } & DefaultSession["user"];
  }
} */

// Extend types to match currently available options.
type BaseAiTextGenerationModels =
  | "@cf/meta/llama-3.2-1b-instruct"
  | "@cf/meta/llama-3.2-3b-instruct";
