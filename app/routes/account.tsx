import type { DataFunctionArgs } from "@remix-run/node";

import { Form, useLoaderData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { authenticator } from "~/modules/auth/auth.server";
import { PrismaClient } from "@prisma/client";
import {
  MdCheck,
  MdClear,
  MdOutlineEmail,
  MdOutlineModeEditOutline,
} from "react-icons/md";
import { useLayoutEffect, useRef, useState } from "react";
import { RoundedButton } from "~/components/UI/buttons";
import { Divider } from "~/components/UI/divider";
import { commitSession, getSession } from "~/modules/auth/auth-session.server";
import { FormInput } from "~/components/UI/input";
import { FaRegUser } from "react-icons/fa6";
import { useClickAway } from "@uidotdev/usehooks";
import { useDoubleCheck } from "~/hooks/use-double-check";

export async function loader({ request }: DataFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const ummm = await getSession(request.headers.get("Cookie"));
  const error = ummm.get("error") || null;
  const message = ummm.get("message") || null;

  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return redirect("/login");

  return json(
    { user, error, message },
    {
      headers: {
        "Set-Cookie": await commitSession(ummm),
      },
    }
  );
}

export default function AdminIndex() {
  const loaderData = useLoaderData<typeof loader>();

  useLayoutEffect(() => {
    if (loaderData.message) window.alert(loaderData.message);
  }, [loaderData]);

  return (
    <div className="bg-white h-full w-full space-y-2">
      <p className="text-3xl text-center font-semibold">Account</p>
      <p className="text-2xl font-semibold text-center p-2">Account details</p>
      <div className="w-full mx-auto">
        <UsernameSection />
      </div>
      <div className="w-full mx-auto">
        <EmailSection />
      </div>
      <p className="text-2xl font-semibold text-center p-2">Other</p>
      <div className="w-full mx-auto">
        <DeleteSection />
      </div>
    </div>
  );
}

const DeleteSection = () => {
  const { doubleCheck, getButtonProps } = useDoubleCheck();
  const { message } = useLoaderData<typeof loader>();

  return (
    <Form method="POST" action="/account/delete" navigate={false}>
      <button
        {...getButtonProps({
          type: "submit",
          className: `w-1/3 mx-auto active:scale-95 transition transition-all duration-150 flex h-10 items-center justify-center rounded-md font-semibold rounded-md text-white sm:text-lg ${
            doubleCheck
              ? "bg-red-500 hover:bg-red-600"
              : "bg-indigo-500 hover:bg-indigo-400"
          }`,
        })}
      >
        {doubleCheck ? "Are you sure?" : "Delete account"}
      </button>
    </Form>
  );
};

const UsernameSection = () => {
  const [editing, setEditing] = useState(false);
  const loaderData = useLoaderData<typeof loader>();

  useLayoutEffect(() => {
    if (loaderData.error) return;
    setEditing(false);
  }, [loaderData]);

  return (
    <Form
      method="POST"
      action="/account/update/username"
      navigate={false}
      className="w-full mx-auto"
    >
      {editing ? (
        <UsernameEdit
          username={loaderData.user.username}
          error={loaderData.error}
          endEdit={() => setEditing(false)}
        />
      ) : (
        <UsernamePreview
          username={loaderData.user.username}
          edit={() => setEditing(true)}
        />
      )}
    </Form>
  );
};

const UsernamePreview = ({
  username,
  edit,
}: {
  username: string;
  edit: () => void;
}) => {
  return (
    <>
      <div className="grid mt-2 w-full sm:w-1/3 mx-auto auto-rows-max grid-cols-[1fr_auto] grid-flow-rows gap-1">
        <div className="w-full relative rounded-md shadow-sm">
          <FormInput
            type="text"
            icon={FaRegUser}
            label="Username"
            value={username}
            name="username-preview"
            preview
          />
        </div>

        <button
          type="button"
          onClick={edit}
          className="active:scale-95 transition transition-all duration-150 mt-6 w-[2.3rem] bottom-0 h-[2.3rem] rounded-md text-white bg-indigo-500 hover:bg-indigo-400 sm:text-lg"
        >
          <MdOutlineModeEditOutline className="mx-auto" />
        </button>
      </div>
    </>
  );
};

const UsernameEdit = ({
  username,
  error,
  endEdit,
}: {
  username: string;
  error?: string;
  endEdit: () => void;
}) => {
  return (
    <>
      {/* Username input */}
      <div className="grid auto-rows-max grid-flow-rows mt-2 grid-cols-[1fr_auto_auto] gap-1  w-full sm:w-1/3 mx-auto">
        <div className="w-full h-fit">
          <FormInput
            type="text"
            name="username"
            label="Username"
            error={error == "same-username"}
            icon={FaRegUser}
            defaultValue={username}
            className="w-full"
            autoComplete="off"
            required
          />
        </div>
        <button
          type="submit"
          className="active:scale-95 transition transition-all duration-150 mt-6 w-[2.3rem] h-[2.3rem] rounded-md text-white bg-indigo-500 hover:bg-indigo-400 sm:text-lg"
        >
          <MdCheck className="mx-auto" />
        </button>
        <button
          type="button"
          onClick={endEdit}
          className="active:scale-95 transition transition-all duration-150 mt-6 w-[2.3rem] h-[2.3rem] rounded-md text-white bg-red-500 hover:bg-red-600 sm:text-lg"
        >
          <MdClear className="mx-auto" />
        </button>
      </div>
    </>
  );
};

const EmailSection = () => {
  const [editing, setEditing] = useState(false);
  const loaderData = useLoaderData<typeof loader>();

  useLayoutEffect(() => {
    if (loaderData.error) return;
    setEditing(false);
  }, [loaderData]);

  return (
    <Form
      method="POST"
      action="/account/update/email"
      navigate={false}
      className="w-full mx-auto"
    >
      {editing ? (
        <EmailEdit
          error={loaderData.error}
          email={loaderData.user.email}
          endEdit={() => setEditing(false)}
        />
      ) : (
        <EmailPreview
          email={loaderData.user.email}
          edit={() => setEditing(true)}
        />
      )}
    </Form>
  );
};

const EmailPreview = ({ email, edit }: { email: string; edit: () => void }) => {
  return (
    <>
      <div className="grid mt-2 w-full sm:w-1/3 auto-rows-max mx-auto grid-cols-[1fr_auto] grid-flow-rows gap-1">
        <div className="w-full relative rounded-md shadow-sm">
          <FormInput
            type="email"
            name="email-preview"
            label="Email"
            value={email}
            icon={MdOutlineEmail}
            preview
          />
        </div>

        <button
          type="button"
          onClick={edit}
          className="active:scale-95 transition transition-all duration-150 mt-6 w-[2.3rem] bottom-0 h-[2.3rem] rounded-md text-white bg-indigo-500 hover:bg-indigo-400 sm:text-lg"
        >
          <MdOutlineModeEditOutline className="mx-auto" />
        </button>
      </div>
    </>
  );
};

const EmailEdit = ({
  email,
  error,
  endEdit,
}: {
  email: string;
  error?: string;
  endEdit: () => void;
}) => {
  return (
    <>
      <div className="mt-2 w-full sm:w-1/3 mx-auto">
        <FormInput
          type="email"
          error={
            error == "current-email" ||
            error == "missing" ||
            error == "missing-email-fields" ||
            error == "same-email"
          }
          icon={MdOutlineEmail}
          label="Current email address"
          name="current-email"
          value={email}
          autoComplete="off"
          required
        />
        <FormInput
          type="email"
          error={
            error == "mismatched" ||
            error == "invalid" ||
            error == "missing-email-fields" ||
            error == "same-email"
          }
          icon={MdOutlineEmail}
          label="New email address"
          name="new-email"
          autoComplete="email"
          required
        />
        <FormInput
          type="email"
          error={
            error == "mismatched" ||
            error == "invalid" ||
            error == "missing-email-fields" ||
            error == "same-email"
          }
          icon={MdOutlineEmail}
          label="Confirm email address"
          name="confirm-email"
          autoComplete="email"
          required
        />
      </div>
      <div className="grid grid-cols-4 mt-2 auto-rows-max gap-2">
        <button
          type="submit"
          className="active:scale-95 transition transition-all duration-150 col-span-1 justify-self-end w-2/3 h-full col-start-2 rounded-md text-white bg-indigo-500 hover:bg-indigo-400 sm:text-lg"
        >
          <MdCheck className="mx-auto" />
        </button>
        <button
          type="button"
          onClick={endEdit}
          className="active:scale-95 transition transition-all duration-150 col-span-1 justify-self-start w-2/3 h-10 rounded-md text-white bg-red-500 hover:bg-red-600 sm:text-lg"
        >
          <MdClear className="mx-auto" />
        </button>
      </div>
    </>
  );
};
