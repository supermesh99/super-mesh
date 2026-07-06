"use client";

import { useEffect } from "react";
import { initLanding } from "@/lib/landing-fx";
import { landingHtml } from "./landing.html";
import "./landing.css";

export default function Landing() {
  useEffect(() => initLanding(), []);
  return <div dangerouslySetInnerHTML={{ __html: landingHtml }} />;
}
