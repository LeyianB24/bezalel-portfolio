import { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Engineering & Consultations | Bezalel Technologies",
  description:
    "Direct contact with Bezalel Technologies engineering leads. Request architecture assessments, custom systems scoping, SLA support, or project briefs.",
  openGraph: {
    title: "Contact Engineering & Consultations | Bezalel Technologies",
    description:
      "Direct technical consultation with Bezalel Technologies. HQ in Nairobi, Kenya, delivering mission-critical software and infrastructure worldwide.",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
