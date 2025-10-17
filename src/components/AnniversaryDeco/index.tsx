import { useEffect, useRef } from "react";
import classes from "./style.module.css";

export default function AnniversaryDeco() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const spawnParticle = (type: number) => {
    if (!containerRef.current) return;

    const particle = document.createElement("div");
    particle.classList.add(classes.p);
    switch (type) {
      case 0:
        particle.classList.add(classes.round);
        break;
      case 1:
        particle.classList.add(classes.tri);
        break;
    }

    const left = `${containerRef.current.clientWidth * Math.random()}px`;
    const backgroundColor = `hsl(${360 * Math.random()} 80% 80%)`;
    const animation = particle.animate(
      [
        {
          top: `${-500 + 490 * Math.random()}px`,
          left,
          rotate: "1 1 1 0turn",
          backgroundColor,
          easing: "linear",
        },
        {
          opacity: 1,
          offset: 0.8,
          easing: "ease-out",
        },
        {
          top: `${80 + 40 * Math.random()}%`,
          left,
          rotate: `${-1 + 2 * Math.random()} ${-1 + 2 * Math.random()} ${-1 + 2 * Math.random()} 3turn`,
          backgroundColor,
          opacity: 0,
        },
      ],
      {
        duration: 5000,
        delay: Math.random() * 10000,
        iterations: 2,
        fill: "forwards",
      }
    );

    containerRef.current.appendChild(particle);
    animation.onfinish = () => particle.remove();
  };

  const spawnParticles = () => {
    for (let i = 0; i < 50; i++) spawnParticle(i % 3);
  };

  useEffect(spawnParticles, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}
