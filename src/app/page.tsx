"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const video = videoRef.current;
      if (!video) return;

      const setup = () => {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise.then(() => video.pause()).catch(() => video.pause());
        }

        const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 1;

        const smoothTime = gsap.quickTo(video, "currentTime", {
          duration: 0.2,
          ease: "none",
        });

        ScrollTrigger.create({
          trigger: "#hero",
          start: "top top",
          end: "+=300%",
          scrub: 0.25,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            smoothTime(self.progress * duration);
          },
        });
      };

      if (video.readyState >= 1) {
        setup();
      } else {
        video.addEventListener("loadedmetadata", setup, { once: true });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main id="top" ref={containerRef} className="relative min-h-screen overflow-hidden">
      <section id="hero" className="relative h-screen w-full">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          preload="auto"
          muted
          playsInline
          src="/parte1.mp4"
        />
      </section>
    </main>
  );
}
