export const dynamic = "force-dynamic";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { getLocale, t } from "@/lib/i18n";
import { contactAction } from "./actions";
import { ContactForm } from "./contact-form";

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

  const formLabels = {
    sendMessage: t(locale, "contact.sendMessage"),
    fullName: t(locale, "contact.fullName"),
    email: t(locale, "contact.email"),
    organisation: t(locale, "contact.organisation"),
    topic: t(locale, "contact.topic"),
    chooseTopic: t(locale, "contact.chooseTopic"),
    info: t(locale, "contact.info"),
    enrollment: t(locale, "contact.enrollment"),
    partnership: t(locale, "contact.partnership"),
    press: t(locale, "contact.press"),
    technical: t(locale, "contact.technical"),
    other: t(locale, "contact.other"),
    message: t(locale, "contact.message"),
    send: t(locale, "contact.send"),
    responseTime: t(locale, "contact.responseTime"),
  };

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
              <ContactForm action={contactAction} locale={locale} labels={formLabels} />

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

