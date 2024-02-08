import { ErrorResponse } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

export const renderErrorPage = (error: ErrorResponse) => {
  switch (error.status) {
    case 404:
      return <NotFound />;
    default:
      return <GenericError errorCode={error.status} />;
  }
};

// 404 error page
export const NotFound = () => {
  const location = useLocation();
  return (
    <div className="bg-light h-full w-full flex flex-col justify-center items-center">
      <p className="text-9xl font-semibold">404</p>
      {/* Just looks silly when the pathname is too long */}
      <p className="text-2xl">{`Nothing found ${
        location.pathname.length < 20 ? `at ${location.pathname}` : "here"
      }`}</p>
    </div>
  );
};

// Throw this when there isn't a page for that specific error
export const GenericError = ({ errorCode }: { errorCode: number }) => {
  return (
    <div className="bg-light w-full h-full flex flex-col justify-center items-center">
      <p className="text-9xl font-semibold">{errorCode ?? "Error"}</p>
      <p className="text-2xl">Something has gone wrong</p>
    </div>
  );
};
