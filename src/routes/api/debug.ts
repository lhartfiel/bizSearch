import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/debug").methods({
  GET: async () => {
    return new Response(
      JSON.stringify({
        env: process.env.GOOGLE_API_KEY ? "exists" : "undefined",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  },
});
