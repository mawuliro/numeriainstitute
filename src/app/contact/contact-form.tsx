"use client";

import { useActionState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Locale = string;
type Labels = {
  sendMessage: string;
  fullName: string;
  email: string;
  organisation: string;
  topic: string;
  chooseTopic: string;
  info: string;
  enrollment: string;
  partnership: string;
  press: string;
  technical: string;
  other: string;
  message: string;
  send: string;
  responseTime: string;
};
type FormState = { error?: string; success?: string } | null;

export function ContactForm({
  action,
  locale,
  labels,
}: {
  action: (formData: FormData) => Promise<{ error?: string; success?: string } | void>;
  locale: Locale;
  labels: Labels;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    async (_prev, formData) => {
      const res = await action(formData);
      if (!res) return null;
      return { error: res.error, success: res.success };
    },
    null,
  );

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-semibold">{labels.sendMessage}</h2>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {state.success}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">{labels.fullName}</Label>
            <Input id="name" name="name" placeholder={labels.fullName} required maxLength={80} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{labels.email}</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org">{labels.organisation}</Label>
            <Input id="org" name="org" placeholder={labels.organisation} maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">{labels.topic}</Label>
            <Select name="topic">
              <SelectTrigger>
                <SelectValue placeholder={labels.chooseTopic} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">{labels.info}</SelectItem>
                <SelectItem value="enrollment">{labels.enrollment}</SelectItem>
                <SelectItem value="partnership">{labels.partnership}</SelectItem>
                <SelectItem value="press">{labels.press}</SelectItem>
                <SelectItem value="technical">{labels.technical}</SelectItem>
                <SelectItem value="other">{labels.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{labels.message}</Label>
            <Textarea
              id="message"
              name="message"
              rows={5}
              placeholder={labels.message}
              required
              maxLength={5000}
            />
          </div>
          <Button type="submit" disabled={pending} className="w-full bg-[#1B2A4E] hover:bg-[#1B2A4E]/90">
            {pending ? "..." : labels.send}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {labels.responseTime}
        </p>
      </CardContent>
    </Card>
  );
}
