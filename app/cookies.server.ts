import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const filterCookie = createCookie("filter", {
    path: "/r",
    maxAge: 604_800, // one week
    secure: true,
  });