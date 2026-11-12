// All copy, verbatim from design/*.reference.html. Do not edit without Vijayaganth.

import type { StaticImageData } from "next/image";
// Real screens, captured from each app running locally (see assets/work/).
import paadamShot from "@/assets/work/paadam.webp";
import remoShot from "@/assets/work/remo.webp";
import atsShot from "@/assets/work/ats.webp";

export type Accent = "teal" | "blue" | "magenta" | "yellow";

/** "browser" frames a web app screen; "phone" frames a mobile screen. */
export type Shot = { src: StaticImageData; alt: string; frame: "browser" | "phone" };

export const site = {
  name: "Vijayaganth",
  email: "vijayaganth.sivalingam@gmail.com",
  linkedin: "https://www.linkedin.com/in/vijayaganth-s-87a0865b/",

  nav: [
    { label: "Work", href: "#work" },
    { label: "Journey", href: "#journey" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
  cta: "Let's talk",

  hero: {
    eyebrow: "Portfolio 2026 · Chennai, India",
    title: "Frontend lead turned AI product engineer.",
    body: "12 years in web development, 10+ building enterprise apps with React, Next.js and TypeScript. Now building agentic AI workflows and MCP integrations.",
    cue: "Scroll to explore",
  },

  // Intro statement split around the two highlighted phrases.
  intro: [
    { text: "Twelve years of shipping frontends. Now I build " },
    { text: "whole products", highlight: "magenta" },
    { text: " on my own, from Figma and system architecture to NestJS backends and the " },
    { text: "AI workflows", highlight: "yellow" },
    { text: " behind the button." },
  ] as { text: string; highlight?: "magenta" | "yellow" }[],

  work: {
    title: "Selected work",
    count: "3 projects",
    projects: [
      {
        index: "01",
        status: "In development",
        name: "Paadam",
        description:
          "AI-powered SaaS that generates syllabus-aligned weekly worksheets and exam papers for CBSE and Tamil Nadu State Board schools.",
        tags: ["Next.js", "TypeScript", "Claude / OpenAI APIs"],
        accent: "teal",
        shot: { src: paadamShot, alt: "Paadam worksheet builder: textbook, chapters and a 25-mark blueprint preview", frame: "browser" },
      },
      {
        index: "02",
        status: "In development",
        name: "Remo",
        description:
          "A home TV remote for iPhone and Google TV. No ads, with watch history and a doorbell pause.",
        tags: ["Mobile", "iOS", "Google TV"],
        accent: "blue",
        shot: { src: remoShot, alt: "Remo iPhone remote: D-pad, back, home, pause and volume controls", frame: "phone" },
      },
      {
        index: "03",
        status: "Freelance client project",
        name: "ATS",
        description:
          "A full-stack applicant tracking system for an Indian HR client, with role-based access. I owned the Figma UI/UX, system architecture and a 13-week milestone plan.",
        tags: ["React", "NestJS", "PostgreSQL"],
        accent: "magenta",
        shot: { src: atsShot, alt: "ATS job listing: jobs with client, status, positions and submissions", frame: "browser" },
      },
    ] as {
      index: string;
      status: string;
      name: string;
      description: string;
      tags: string[];
      accent: Accent;
      shot: Shot;
    }[],
  },

  journey: {
    title: "The journey",
    jobs: [
      {
        period: "2014 – 2018",
        role: "UI Developer",
        company: "Made By Fire",
        summary:
          "Turned Photoshop designs into responsive, pixel-perfect pages with HTML5, CSS3 and jQuery.",
      },
      {
        period: "2018 – 2019",
        role: "Senior Member of Technical Staff",
        company: "Latitude Fintech",
        summary:
          "Built reusable React components and integrated REST and GraphQL APIs for fintech products.",
      },
      {
        period: "2019 – 2020",
        role: "Senior Frontend Developer",
        company: "F22 Labs",
        summary: "Led a 3-member frontend team and built reusable component infrastructure.",
      },
      {
        period: "2020 – 2023",
        role: "Senior Software Engineer",
        company: "Entrans Technologies",
        summary:
          "Led architectural R&D and set the React component patterns adopted across the organization.",
      },
      {
        period: "2023 – Present",
        role: "Senior Technical Specialist, Frontend Lead",
        company: "HCL Technologies",
        summary:
          "Lead 4 frontend engineers on enterprise React apps, with MCP-powered, AI-assisted engineering workflows.",
      },
    ],
  },

  skills: {
    title: "What I work with",
    groups: [
      {
        name: "Frontend",
        accent: "teal",
        items: ["React", "Next.js", "React Native", "TypeScript", "Redux Toolkit"],
      },
      {
        name: "AI & LLM",
        accent: "blue",
        items: ["Claude API", "OpenAI API", "Agentic AI workflows", "Prompt engineering"],
      },
      {
        name: "MCP",
        accent: "magenta",
        items: ["Figma MCP", "GitHub MCP", "SonarQube MCP", "MCP server integration"],
      },
      {
        name: "Backend & Data",
        accent: "yellow",
        items: ["Node.js", "NestJS", "Prisma", "PostgreSQL", "GraphQL"],
      },
      {
        name: "Cloud & DevOps",
        accent: "teal",
        items: ["GitHub Actions", "Vercel", "Netlify", "Railway", "Cloudflare R2"],
      },
    ] as { name: string; accent: Accent; items: string[] }[],
    education: "Bachelor of Computer Science, University of Madras, Chennai.",
  },

  contact: {
    title: "Got a big idea? Let's build it.",
    linkedinLabel: "LinkedIn",
  },

  footer: {
    copyright: "© 2026 Vijayaganth",
    backToTop: "Back to top",
  },
};
