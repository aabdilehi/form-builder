import { PrismaClient } from "@prisma/client";
import { ActionFunction, ActionFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/modules/auth/auth-session.server";
import { authenticator } from "~/modules/auth/auth.server";

export const action : ActionFunction = async ({request} : ActionFunctionArgs) => {
    const session = await authenticator.isAuthenticated(request, {
        failureRedirect: '/login',
      })
    
      const prisma = new PrismaClient();
      const user = await prisma.user.findUnique({ where: { id: session.id } })
      if (!user) return redirect('/login')
    
      // Delete user.
      await prisma.user.delete({ where: { id: session.id } })
    
      // Destroy session.
      return redirect('/', {
        headers: {
          'set-cookie': await destroySession(await getSession(request.headers.get('cookie'))),
        },
      })
}