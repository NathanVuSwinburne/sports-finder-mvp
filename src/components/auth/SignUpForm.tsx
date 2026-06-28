"use client";

import { useActionState } from "react";
import { signUpAction, type AuthState } from "@/app/auth/actions";
import { Input, Label, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function SignUpForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUpAction,
    null,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="display_name">Display name</Label>
        <Input id="display_name" name="display_name" autoComplete="name" required placeholder="e.g. Grace L." />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="password" hint="(min 6 characters)">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={6} placeholder="••••••••" />
      </div>
      {state?.error && <FieldError>{state.error}</FieldError>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
