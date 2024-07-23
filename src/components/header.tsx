import { LogoutButton } from "@/components/logout-button";
import { IconBallFootball } from "@tabler/icons-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <IconBallFootball />
          <span className="hidden sm:inline">Premier Poli League</span>
          <span className="sm:hidden">PPL</span>
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
