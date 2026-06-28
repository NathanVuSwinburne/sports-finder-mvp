"use client";

import { useActionState } from "react";
import { createEventAction, type CreateState } from "@/app/events/new/actions";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SKILL_OPTIONS } from "@/lib/constants";

export function CreateEventForm() {
  const [state, action, pending] = useActionState<CreateState, FormData>(
    createEventAction,
    null,
  );

  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder="e.g. Friday CBD Beginner Badminton" />
      </div>

      <div>
        <Label htmlFor="description" hint="(optional)">What's the session like?</Label>
        <Textarea id="description" name="description" placeholder="Relaxed doubles, rotate everyone in, beginners welcome…" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="venue_name">Venue name</Label>
          <Input id="venue_name" name="venue_name" required placeholder="Melbourne City Badminton Centre" />
        </div>
        <div>
          <Label htmlFor="suburb">Suburb</Label>
          <Input id="suburb" name="suburb" required placeholder="Melbourne" />
        </div>
      </div>

      <div>
        <Label htmlFor="address" hint="(address or Google Maps link)">Where exactly?</Label>
        <Input id="address" name="address" placeholder="120 Spencer St, or a maps.google link" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>
        <div>
          <Label htmlFor="time">Start time</Label>
          <Input id="time" name="time" type="time" required />
        </div>
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Select id="duration" name="duration" defaultValue="120">
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
            <option value="150">2.5 hours</option>
            <option value="180">3 hours</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="price" hint="(AUD, 0 = free)">Price per player</Label>
          <Input id="price" name="price" type="number" min="0" step="0.5" defaultValue="0" />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" name="capacity" type="number" min="2" defaultValue="8" required />
        </div>
        <div>
          <Label htmlFor="min_players">Min players</Label>
          <Input id="min_players" name="min_players" type="number" min="1" defaultValue="4" required />
        </div>
      </div>

      <div>
        <Label htmlFor="skill_level">Skill level</Label>
        <Select id="skill_level" name="skill_level" defaultValue="casual">
          {SKILL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          name="beginner_friendly"
          value="1"
          defaultChecked
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        🌱 This session is beginner-friendly
      </label>

      <div>
        <Label htmlFor="rules" hint="(optional)">Rules &amp; notes</Label>
        <Textarea id="rules" name="rules" placeholder="Non-marking shoes required. Meet at the main entrance." />
      </div>

      {state?.error && <FieldError>{state.error}</FieldError>}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Creating…" : "Create event"}
      </Button>
    </form>
  );
}
