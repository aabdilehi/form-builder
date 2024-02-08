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
  const currentEmail = formData.get("current-email");
  const newEmail = formData.get("new-email");
  const confirmEmail = formData.get("confirm-email");

  if (currentEmail !== user.email) {
    // Make sure this is actually their email
    // Please make sure your current email is correct

    cookie.flash("error", "current-email");
    cookie.flash("message", "Please make sure your current email is correct");
    return json(
      { currentEmail, newEmail, confirmEmail },
      {
        headers: {
          "Set-Cookie": await commitSession(cookie),
        },
      }
    );
  }

  if (currentEmail == newEmail) {
    cookie.flash("error", "same-email");
    cookie.flash(
      "message",
      "Please make sure your new email is different from your current email"
    );
    return json(
      { currentEmail, newEmail, confirmEmail },
      {
        headers: {
          "Set-Cookie": await commitSession(cookie),
        },
      }
    );
  }

  if (!currentEmail || !newEmail || !confirmEmail) {
    // This should be required on client side but if it somehow gets past despite that then throw an error
    // Please fill in all required data
    cookie.flash("error", "missing-email-fields");
    cookie.flash("message", "Please make sure all required fields are filled");
    return json(
      { currentEmail, newEmail, confirmEmail },
      {
        headers: {
          "Set-Cookie": await commitSession(cookie),
        },
      }
    );
  }

  if (newEmail !== confirmEmail) {
    // Please make sure your new email has been typed correctly or something

    cookie.flash("error", "mismatched");
    cookie.flash(
      "message",
      "Please make sure you have typed your new email correctly"
    );
    return json(
      { currentEmail, newEmail, confirmEmail },
      {
        headers: {
          "Set-Cookie": await commitSession(cookie),
        },
      }
    );
  }

  const regex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;
  if (!regex.test(newEmail)) {
    // testing if the new email's formatting is valid
    cookie.flash("error", "invalid");
    cookie.flash("message", "Please make sure the new email is valid");
    return json(
      { currentEmail, newEmail, confirmEmail },
      {
        headers: {
          "Set-Cookie": await commitSession(cookie),
        },
      }
    );
  }

  // then update if good

  // Update user.
  await prisma.user.update({
    where: { id: session.id },
    data: { email: newEmail },
  });

  // Update user in session (must be an easier way to do this)
  cookie.set("user", { ...cookie.data.user, email: newEmail });
  cookie.flash("message", "Successfully updated email");
  // Destroy session.
  return json(
    { user },
    {
      headers: {
        "Set-Cookie": await commitSession(cookie),
      },
    }
  );
};
