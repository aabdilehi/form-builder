import { PrismaClient } from "@prisma/client";
import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/modules/auth/auth-session.server";
import { authenticator } from "~/modules/auth/auth.server";
import { type user } from "@prisma/client";

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  // check if user even exists first
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const cookie = await getSession(request.headers.get("cookie"));

  // redirect away if not
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return redirect("/login");

  // validate here probably??
  const formData = await request.formData();
  const username = formData.get("username");

  if (username == user.username) {
    // Make sure new username is different from old username
    cookie.flash("error", "same-username");
    cookie.flash(
      "message",
      "Please make sure your new username is different from your old username"
    );
    return json(
      { username },
      {
        headers: {
          "Set-Cookie": await commitSession(cookie),
        },
      }
    );
  }

  // Update user.
  await prisma.user.update({ where: { id: session.id }, data: { username } });

  // Update user in session (must be an easier way to do this)
  cookie.set("user", { ...cookie.data.user, username });
  cookie.flash("message", "Successfully updated username");
  // Destroy session.
  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitSession(cookie),
      },
    }
  );
};
