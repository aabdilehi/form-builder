import { useRouteError } from "@remix-run/react";
import { renderErrorPage } from "~/components/UI/error-pages";

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

export default function NotFound() {
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  return renderErrorPage(error);
}
