"use client";

import { logoutAction } from "@/app/(auth)/_actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  async function handleLogout() {
    await logoutAction();
  }

  return <Button onClick={handleLogout}>Logout</Button>;
}
