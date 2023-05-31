import { SignInButton, SignOutButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import Image from "next/image";

const PageLayout = (props: PropsWithChildren) => {
  const user = useUser();

  const paying = false;

  return (
    <div>
      <nav className="flex w-full flex-row items-center justify-between space-x-6 bg-white p-4 text-xl font-bold">
        <div>
          <Link href="/">MonsterGPT</Link>
        </div>
        <div className="flex flex-row items-center justify-center space-x-12">
          {/* if not logged - display pricing  */}
          {!user.isSignedIn && <Link href="/pricing">Sign Up</Link>}
          {!!user.isSignedIn && !paying && <Link href="/pricing">Pricing</Link>}

          {/* if logged in and not paying - display pricing  */}

          {!user.isSignedIn && <SignInButton />}
          {!!user.isSignedIn && (
            <div className="text-md flex flex-row space-x-2">
              <Image
                alt="Profile Image"
                src={user.user?.profileImageUrl}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full"
              />
              <SignOutButton />
            </div>
          )}
        </div>
      </nav>

      {props.children}
    </div>
  );
};

export default PageLayout;
