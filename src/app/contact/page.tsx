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

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="py-16">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Contact us
              </h1>
              <p className="mt-3 text-muted-foreground">
                A question, a partnership idea, or simply want to know more? We
                are here for you.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact form */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Send a message</h2>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">FULL NAME *</Label>
                      <Input id="name" name="name" placeholder="Your full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">EMAIL *</Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="org">ORGANISATION (optionnel)</Label>
                      <Input id="org" name="org" placeholder="University, company, NGO..." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic">TOPIC *</Label>
                      <Select name="topic">
                        <SelectTrigger>
                          <SelectValue placeholder="— Choose a subject —" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Information request</SelectItem>
                          <SelectItem value="enrollment">Programme enrollment</SelectItem>
                          <SelectItem value="partnership">Partnership proposal</SelectItem>
                          <SelectItem value="press">Press / media contact</SelectItem>
                          <SelectItem value="technical">Technical issue</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">MESSAGE *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Your message..."
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-[#1B2A4E] hover:bg-[#1B2A4E]/90">
                      Send message 📨
                    </Button>
                  </form>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    We respond within 24 to 48 business hours.
                  </p>
                </CardContent>
              </Card>

              {/* Contact info + FAQ */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                      Our contact details
                    </h2>
                    <div className="space-y-4">
                      {[
                        { icon: MapPin, label: "Adresse", value: "Lomé, Togo" },
                        { icon: Mail, label: "Email", value: "numeriainstitude@gmail.com" },
                        { icon: Phone, label: "Phone", value: "+228 XX XX XX XX" },
                        { icon: Clock, label: "Hours", value: "Mon-Fri: 9am-6pm (Lomé time, GMT+0)" },
                      ].map((item) => (
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
                      Frequently asked questions
                    </h2>
                    <div className="space-y-4">
                      {[
                        {
                          q: "Are online courses free?",
                          a: "Yes, the majority of online courses are free. Some advanced courses are paid.",
                        },
                        {
                          q: "How do I apply for in-person programmes?",
                          a: "Applications are made online. Create an account and follow the application process.",
                        },
                        {
                          q: "Do you offer scholarships?",
                          a: "Yes, scholarships are available for deserving candidates. Contact us for more information.",
                        },
                      ].map((faq) => (
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
