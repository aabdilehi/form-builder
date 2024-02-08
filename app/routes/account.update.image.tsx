import { PrismaClient } from "@prisma/client";
import { ActionFunction, ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/modules/auth/auth-session.server";
import { authenticator } from "~/modules/auth/auth.server";

export const action : ActionFunction = async ({request} : ActionFunctionArgs) => {
  return null;
}