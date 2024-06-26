import { Inter } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/dashboard/SideBar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { connectMongoDb } from "@/lib/dbConnect";
import { UserPage } from "@/models/Onboarding";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }

  await connectMongoDb();
  const exists = await UserPage.findOne({
    owner: session.user?.email,
  });

  if (!exists) {
    redirect("/onboarding");
  }

  console.log(session);
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 flex`}>
        <div>
          <SideBar session={session} />
        </div>
        <div  className="p-4 m-8 shadow-md shadow-white/10 bg-gray-950/70 h-min w-full">{children}</div>
      </body>
    </html>
  );
}
