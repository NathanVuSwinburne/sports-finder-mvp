"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileState } from "@/app/profile/actions";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SKILL_OPTIONS, SPORT_OPTIONS } from "@/lib/constants";
import type { ProfileRow } from "@/types/database";

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(
    updateProfileAction,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="display_name">Display name</Label>
        <Input id="display_name" name="display_name" required defaultValue={profile.display_name} />
      </div>

      <div>
        <Label htmlFor="avatar_url" hint="(optional)">Avatar image URL</Label>
        <Input id="avatar_url" name="avatar_url" type="url" defaultValue={profile.avatar_url ?? ""} placeholder="https://…" />
        <p className="mt-1 text-xs text-slate-400">Leave blank to use your initials.</p>
      </div>

      <div>
        <Label htmlFor="bio" hint="(optional)">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={profile.bio ?? ""} placeholder="A sentence about you and how you play." />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="suburb" hint="(general area, not home address)">Suburb</Label>
          <Input id="suburb" name="suburb" defaultValue={profile.suburb ?? ""} placeholder="Clayton" />
        </div>
        <div>
          <Label htmlFor="university" hint="(or 'not a student')">University</Label>
          <Input id="university" name="university" defaultValue={profile.university ?? ""} placeholder="Monash University" />
        </div>
      </div>

      <div>
        <Label htmlFor="skill_level">Badminton skill level</Label>
        <Select id="skill_level" name="skill_level" defaultValue={profile.skill_level}>
          {SKILL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-800">Preferred sports</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SPORT_OPTIONS.map((s) => (
            <label key={s.slug} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="preferred_sports"
                value={s.slug}
                defaultChecked={profile.preferred_sports.includes(s.slug)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && <FieldError>{state.error}</FieldError>}
      {state?.ok && <p className="text-sm text-emerald-700">{state.ok}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
