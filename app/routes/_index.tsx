import type { MetaFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="h-full min-h-fit w-4/5 mx-auto">
      <div className="text-center p-4 bg-indigo-50 ring-1 ring-indigo-300 rounded-md mx-auto">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Disclaimer
        </h1>
        <p>
          This is a portfolio project showcasing a questionnaire/form builder.
          It's designed to demonstrate some skills in web development, and is{" "}
          <strong>not</strong> intended for production use.{" "}
          <strong>
            Assume that security is very weak and show appropriate caution
          </strong>
          . I would love to build a demo that doesn't require sign-up eventually
          but, for now, I would suggest using a temporary email for logging in
          such as those found at{" "}
          <a
            className="text-indigo-800 hover:text-indigo-500 font-medium"
            href="https://www.temp-mail.org"
          >
            temp-mail.org
          </a>{" "}
          or just make sure to delete your account after you are done checking
          this out. Check out the Github repo for this project{" "}
          <a
            className="text-indigo-800 hover:text-indigo-500 font-medium"
            href="#"
          >
            here
          </a>
          .
        </p>
      </div>
      <div className="my-4 flex flex-col items-center gap-1">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          Get Started
        </h1>
        <p className="text-center">
          To get started, either create an account or login using the button
          below. Please, make sure to read the disclaimer above.
        </p>
        <Link
          to={"/login"}
          className="active:scale-95 min-w-fit w-1/3 mb-4 sm:w-32 text-sm font-semibold text-white transition transition-all duration-150 flex h-10 mt-2 items-center justify-center rounded-md bg-indigo-500 hover:bg-indigo-400 sm:text-lg"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
