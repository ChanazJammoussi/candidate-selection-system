import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

// Données stockées dans le cookie de session
export interface SessionData {
  candidatId?: string;
  candidatEmail?: string;
  adminId?: string;
  adminEmail?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "sgci_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

// Utiliser dans les Server Actions et Server Components
export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
