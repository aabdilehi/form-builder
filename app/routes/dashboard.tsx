import { PrismaClient } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  TbArrowsMaximize,
  TbArrowsMinimize,
  TbEye,
  TbEyeOff,
  TbLock,
  TbLockOpen,
} from "react-icons/tb";
import IconTooltip from "~/components/UI/icon-tooltip";
import { authenticator } from "~/modules/auth/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const prisma = new PrismaClient();

  const result = await prisma.questionnaire.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      visibility: true,
      status: true,
    },
    where: { userId: session.id },
  });

  // Commit session to clear any `flash` error message.
  return json({ result });
}
export const meta: MetaFunction = () => {
  return [{ title: "Dashboard" }];
};
export default () => {
  const { result } = useLoaderData<typeof loader>();

  return (
    <div className="bg-white h-full w-full space-y-2">
      <p className="text-3xl text-center font-semibold">Dashboard</p>
      <div className="bg-indigo-50 outline-1 outline-gray-300 ring-1 ring-inset ring-gray-300/50 shadow-inner rounded-md w-[95dvw] sm:w-2/3 mx-auto h-[65dvh] p-4 flex flex-col space-y-4 overflow-y-auto">
        {result.length <= 0 && (
          <p className="text-center">
            No questionnaires found. Create a new questionnaire using the button
            below.
          </p>
        )}
        {result.map((item) => (
          <Questionnaire {...item} />
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          to={"/create"}
          className="inline-block mt-4 p-2 bg-indigo-400/50 text-white rounded-md hover:bg-indigo-400 active:bg-indigo-500 active:scale-95 transition transition-all duration-150"
        >
          Create new questionnaire
        </Link>
      </div>
    </div>
  );
};

const Questionnaire = ({
  id,
  title,
  description,
  date,
  visibility,
  status,
}: {
  id: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  date: Date;
  status: "open" | "closed";
}) => {
  const [expanded, setExpanded] = useState(false);

  const toSentenceCase = (text: string) => {
    return text.replace(/\.\s+([a-z])[^\.]|^(\s*[a-z])[^\.]/g, (s) =>
      s.replace(/([a-z])/, (s) => s.toUpperCase())
    );
  };

  return (
    <div className="w-full p-4 rounded-md mx-auto my-auto bg-white shadow-lg transition transition-transform duration-150 ease-in-out transform space-y-2 hover:-translate-y-[3px]">
      <div className="flex flex-row items-center float-right space-x-2">
        <Link
          className="text-md font-medium text-indigo-400 hover:text-indigo-400/50 text-shadow mr-2"
          to={`/r/${id}`}
        >
          View responses
        </Link>
        <IconTooltip
          icon={visibility == "public" ? TbEye : TbEyeOff}
          tooltip={toSentenceCase(visibility)}
        />
        <IconTooltip
          icon={status == "open" ? TbLockOpen : TbLock}
          tooltip={toSentenceCase(status)}
        />
        <button
          className="text-center w-8 h-8 bg-indigo-400/50 text-white text-sm rounded-md hover:bg-indigo-400 active:bg-indigo-500 active:shadow-inner active:scale-95 transition transition-all duration-150"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <TbArrowsMinimize className="mx-auto text-lg" />
          ) : (
            <TbArrowsMaximize className="mx-auto text-lg" />
          )}
        </button>
      </div>
      <Link
        className="text-lg font-semibold text-indigo-400 hover:text-indigo-400/50 text-shadow"
        to={`/q/${id}`}
      >
        {title}
      </Link>

      {expanded && (
        <>
          <div className="bg-gray-100/50 shadow-inner rounded-md min-h-[3rem] p-2 mt-2">
            <p className="text-left">{description}</p>
          </div>
          <div className="flex flex-col space-y-1">
            <p>Visibility: {toSentenceCase(visibility)}</p>
            <p>Responses: {toSentenceCase(status)}</p>
          </div>
        </>
      )}
      <p className="text-sm text-gray-600 mt-2 text-shadow w-fit">
        {new Date(date).toLocaleString()}
      </p>
    </div>
  );
};

export async function action({ request }: ActionFunctionArgs) {
  return null;
}
