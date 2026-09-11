"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Mail, MapPin, 
  Clock, ChevronRight, Briefcase, ExternalLink 
} from "lucide-react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
};

interface CareersPageProps {
  positions: Job[];
}

function formatJobType(type: string) {
  switch (type) {
    case "FULL_TIME":
      return "Full-time";
    case "PART_TIME":
      return "Part-time";
    case "CONTRACT":
      return "Contract";
    case "REMOTE":
      return "Remote";
    case "INTERNSHIP":
      return "Internship";
    default:
      return type.replace(/_/g, " ");
  }
}

export default function CareersPage({ positions = [] }: CareersPageProps) {
  const [filter, setFilter] = useState<string>("All");

  const departments = ["All", ...Array.from(new Set(positions.map(job => job.department)))];

  const filteredJobs = filter === "All" 
    ? positions 
    : positions.filter(job => job.department === filter);

  return (
    <PageLayout variant="subtle">
      <main className="min-h-screen pt-24 xs:pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl 3xl:max-w-[1600px] px-3 xs:px-4 sm:px-6">
          {/* Header */}
          <div className="mb-12 border-b border-border pb-8 sm:mb-20 sm:pb-12">
            <p className="mb-2 sm:mb-4 text-[10px] xs:text-xs font-bold uppercase tracking-[0.24em] text-accent-dark dark:text-accent-light">
              Careers at Bezalel
            </p>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground">
                Engineering work focused on substance over noise.
              </h1>
              <p className="max-w-xl text-xs sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
                We work directly with scale-ups, global enterprises, and regional institutions to build mission-critical software and digital infrastructure that cannot afford downtime.
              </p>
            </div>

            {/* Department Filter Tabs */}
            {departments.length > 2 && (
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-1.5 sm:gap-2">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setFilter(dept)}
                    className={`rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] xs:text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${
                      filter === dept
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Job Postings Grid */}
          <div className="mb-14 sm:mb-20 space-y-4 sm:space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-6 sm:p-12 text-center text-muted-foreground">
                <Briefcase className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/40 mb-3 sm:mb-4" />
                <h2 className="text-base sm:text-lg font-bold text-foreground mb-1">No open positions currently listed</h2>
                <p className="text-xs sm:text-sm max-w-xl mx-auto">
                  We post new openings as project demands expand across remote and on-site engineering pipelines. You are welcome to send a speculative application with your CV and GitHub / portfolio links.
                </p>
                <a
                  href="mailto:bezaleltech@gmail.com?subject=Speculative Engineering Application"
                  className="mt-5 sm:mt-6 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-accent-dark dark:text-accent-light hover:underline"
                >
                  Email Bezalel Engineering
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </div>

          {/* Speculative Application Note */}
          <div className="rounded-lg border border-border bg-card p-4 xs:p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-xl xs:text-2xl font-black text-foreground">
                  Don&apos;t see an exact match for your skills?
                </h2>
                <p className="mt-2 text-xs sm:text-base text-muted-foreground">
                  We are always interested in senior software engineers, distributed systems architects, and infrastructure technicians worldwide.
                </p>
              </div>
              <a
                href="mailto:bezaleltech@gmail.com?subject=Speculative Application"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent text-center"
              >
                Send CV directly
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

function JobCard({ job }: { job: Job }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-accent/40">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer p-4 xs:p-6 sm:p-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 text-[11px] sm:text-xs text-muted-foreground mb-2.5 sm:mb-3">
              <span className="rounded bg-primary/10 px-2 py-0.5 font-bold uppercase tracking-wider text-accent-dark dark:text-accent-light">
                {job.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatJobType(job.type)}
              </span>
            </div>

            <h2 className="text-xl xs:text-2xl font-bold tracking-tight text-foreground">
              {job.title}
            </h2>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href={`/careers/${job.id}/apply`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-xs font-bold text-accent-foreground transition-colors hover:bg-accent-light"
            >
              Apply now
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-border bg-background/50 p-4 xs:p-6 sm:p-8"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Role Overview
                </h3>
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Requirements & Experience
                  </h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-dark dark:bg-accent-light" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4">
                <Link
                  href={`/careers/${job.id}/apply`}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Submit application for this role
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
