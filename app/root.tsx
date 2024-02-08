import { cssBundleHref } from "@remix-run/css-bundle";

import stylesheet from "~/tailwind.css";

import {
  json,
  type ErrorResponse,
  type LinksFunction,
  type LoaderFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { authenticator } from "./modules/auth/auth.server";
import Navigation from "./components/UI/navigation";
import { FaArrowLeft } from "react-icons/fa6";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  return json({ user });
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col w-full h-full">
          <Navigation />
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

// Should not even be able to see this unless something has gone very wrong
// Errors are normally handled in $.tsx so I can still use the navigation
export function ErrorBoundary() {
  const navigate = useNavigate();

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex flex-col h-full w-full">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex flex-row items-center group cursor-pointer"
          >
            <FaArrowLeft />
            <p className="group-hover:underline">Back</p>
          </button>
          <div className="bg-light w-full h-full flex flex-col justify-center items-center">
            <p className="text-9xl font-semibold">{"Error"}</p>
            <p className="text-2xl">Something has gone wrong</p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
