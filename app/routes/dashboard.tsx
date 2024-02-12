import { PrismaClient } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import {
  TbArrowsMaximize,
  TbArrowsMinimize,
  TbEye,
  TbEyeOff,
  TbLock,
  TbLockOpen,
} from "react-icons/tb";
import IconTooltip from "~/components/UI/icon-tooltip";
import { useDoubleCheck } from "~/hooks/use-double-check";
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
      <div className="bg-indigo-50 outline-1 outline-gray-300 ring-1 ring-inset ring-gray-300/50 shadow-inner rounded-md w-[95dvw] sm:w-2/3 mx-auto h-[65dvh] p-2 flex flex-col space-y-4 overflow-y-auto">
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
  const { doubleCheck, getButtonProps } = useDoubleCheck();
  const submit = useSubmit();

  const toSentenceCase = (text: string) => {
    return text.replace(/\.\s+([a-z])[^\.]|^(\s*[a-z])[^\.]/g, (s) =>
      s.replace(/([a-z])/, (s) => s.toUpperCase())
    );
  };

  return (
    <div className="w-full p-4 rounded-md mx-auto bg-white shadow-lg transition transition-transform duration-150 ease-in-out transform space-y-2 hover:-translate-y-[3px]">
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
      <div className="relative">
        <p className="text-sm text-gray-600 mt-2 text-shadow w-fit">
          {new Date(date).toLocaleString()}
        </p>
        {expanded && (
          <button
            {...getButtonProps({
              type: "button",
              className: `absolute right-0 bottom-0 text-center w-fit mx-auto active:scale-95 transition transition-all duration-150 flex h-fit py-1 items-center justify-center rounded-md font-mediums text-white ${
                doubleCheck
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-indigo-500 hover:bg-indigo-400"
              }`,
              onClick: () =>
                doubleCheck &&
                submit({ id }, { method: "POST", encType: "application/json" }),
            })}
          >
            <MdDeleteOutline className="absolute left-2 top-1/2 -translate-y-1/2 text-lg" />
            <p className="ml-7 mr-3 font-medium w-[3.5rem]">
              {doubleCheck ? "Confirm" : "Delete"}
            </p>
          </button>
        )}
      </div>
    </div>
  );
};

export async function action({ request }: ActionFunctionArgs) {
  const { id } = await request.json();
  const prisma = new PrismaClient();
  try {
    await prisma.questionnaire.delete({ where: { id } });
    return redirect(request.url);
  } catch (error) {
    throw new Response(
      "Something went wrong when trying to delete this questionnaire.",
      { status: 500 }
    );
  }
}
