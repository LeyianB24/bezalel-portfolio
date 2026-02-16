"use client";

import { motion } from "framer-motion";
import { FiCpu, FiDatabase, FiServer } from "react-icons/fi";
import InteractiveCard from "./InteractiveCard";

export default function TechShowcase() {
  const technologies = [
    {
      title: "Full-Stack Development",
      description: "Next.js, React, Node.js, TypeScript - Building scalable web applications",
      icon: <FiCpu className="w-full h-full" />,
    },
    {
      title: "Database Architecture",
      description: "PostgreSQL, MongoDB, Redis - Designing robust data solutions",
      icon: <FiDatabase className="w-full h-full" />,
    },
    {
      title: "Cloud Infrastructure",
      description: "AWS, Docker, Kubernetes - Deploying at scale",
      icon: <FiServer className="w-full h-full" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {technologies.map((tech, index) => (
        <InteractiveCard
          key={index}
          title={tech.title}
          description={tech.description}
          icon={tech.icon}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
}
