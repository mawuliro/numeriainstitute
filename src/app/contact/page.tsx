export const dynamic = "force-dynamic";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { getLocale, t } from "@/lib/i18n";

export default async function ContactPage() {
  const locale = await getLocale();

  const contactItems = [
    { icon: MapPin, label: t(locale, "contact.address"), value: t(locale, "contact.addressValue") },
    { icon: Mail, label: t(locale, "contact.email"), value: "numeriainstitude@gmail.com" },
    { icon: Phone, label: t(locale, "contact.phone"), value: "+228 XX XX XX XX" },
    { icon: Clock, label: t(locale, "contact.hours"), value: t(locale, "contact.hoursValue") },
  ];

  const faqs = [
    { q: t(locale, "contact.faq1q"), a: t(locale, "contact.faq1a") },
    { q: t(locale, "contact.faq2q"), a: t(locale, "contact.faq2a") },
    { q: t(locale, "contact.faq3q"), a: t(locale, "contact.faq3a") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">
        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t(locale, "contact.title")}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {t(locale, "contact.subtitle")}
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {/* Contact form */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">
                    {t(locale, "contact.sendMessage")}
                  </h2>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t(locale, "contact.fullName")}</Label>
                      <Input id="name" name="name" placeholder={t(locale, "contact.fullName")} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t(locale, "contact.email")}</Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org">{t(locale, "contact.organisation")}</Label>
                      <Input id="org" name="org" placeholder={t(locale, "contact.organisation")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic">{t(locale, "contact.topic")}</Label>
                      <Select name="topic">
                        <SelectTrigger>
                          <SelectValue placeholder={t(locale, "contact.chooseTopic")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">{t(locale, "contact.info")}</SelectItem>
                          <SelectItem value="enrollment">{t(locale, "contact.enrollment")}</SelectItem>
                          <SelectItem value="partnership">{t(locale, "contact.partnership")}</SelectItem>
                          <SelectItem value="press">{t(locale, "contact.press")}</SelectItem>
                          <SelectItem value="technical">{t(locale, "contact.technical")}</SelectItem>
                          <SelectItem value="other">{t(locale, "contact.other")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t(locale, "contact.message")}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder={t(locale, "contact.message")}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#1B2A4E] hover:bg-[#1B2A4E]/90">
                      {t(locale, "contact.send")}
                    </Button>
                  </form>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    {t(locale, "contact.responseTime")}
                  </p>
                </CardContent>
              </Card>

              {/* Contact info + FAQ */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                      {t(locale, "contact.contactDetails")}
                    </h2>
                    <div className="space-y-4">
                      {contactItems.map((item) => (
                        <div key={item.label} className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-muted-foreground">
                              {item.label}
                            </p>
                            <p className="text-sm">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                      {t(locale, "contact.faq")}
                    </h2>
                    <div className="space-y-4">
                      {faqs.map((faq) => (
                        <div key={faq.q}>
                          <p className="text-sm font-semibold">{faq.q}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {faq.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
