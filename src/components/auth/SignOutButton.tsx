import { signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" size="sm">
        Sign out
      </Button>
    </form>
  );
}
