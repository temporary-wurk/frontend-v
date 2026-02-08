// About page – project info, credits, and safety message
import { Globe, Shield, Heart, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">About Cosmic Watch</h1>
          <p className="text-muted-foreground">
            Making asteroid tracking accessible, beautiful, and trustworthy.
          </p>
        </div>

        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Project Purpose</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cosmic Watch is an interstellar asteroid tracker that provides real-time
            visualization of near-Earth objects. Our mission is to make planetary defense
            data accessible to everyone — from curious students to space enthusiasts.
          </p>
        </div>

        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">NASA API Credit</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All asteroid data is sourced from NASA's Near-Earth Object Web Service (NeoWs),
            part of the NASA Open APIs initiative. We are deeply grateful for their commitment
            to open science and public data.
          </p>
          <a
            href="https://api.nasa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Visit NASA Open APIs <ExternalLink size={12} />
          </a>
        </div>

        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-safe" />
            <h2 className="text-lg font-semibold text-foreground">Safety & Awareness</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            While we track potentially hazardous asteroids, it's important to understand that
            "potentially hazardous" is a technical classification — not a prediction of impact.
            NASA and international agencies continuously monitor all known NEOs. There are currently
            no known asteroid threats to Earth in the foreseeable future.
          </p>
        </div>
      </div>
    </div>
  );
}
