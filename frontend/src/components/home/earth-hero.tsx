"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4";
const POSTER_URL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp";

const primaryButton: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 11,
  minHeight: 48, padding: "0 24px", borderRadius: 999, background: "#f5f1ff",
  color: "#100c1c", border: "1px solid rgba(255,255,255,.9)", textDecoration: "none",
  fontSize: 13, fontWeight: 700, letterSpacing: "-.015em",
  boxShadow: "0 8px 30px rgba(167,139,250,.22)",
};
const secondaryButton: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 11,
  minHeight: 48, padding: "0 24px", borderRadius: 999,
  background: "rgba(15,12,28,.72)", color: "#f4f0ff",
  border: "1px solid rgba(222,213,255,.34)", textDecoration: "none",
  fontSize: 13, fontWeight: 650, letterSpacing: "-.015em",
  backdropFilter: "blur(12px)",
};

function Arrow() {
  return (
    <svg width="13" height="11" viewBox="0 0 12 10" fill="none" aria-hidden="true">
      <path d="M.8 5h10M7.1 1.4 10.9 5l-3.8 3.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EarthHero() {
  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const first = videoA.current;
    const second = videoB.current;
    if (!first || !second) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      first.pause();
      second.pause();
      try { first.currentTime = 0; } catch {}
      return;
    }

    const fade = 1.4;
    let current = first;
    let next = second;
    let swapping = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const play = (video: HTMLVideoElement) => {
      const result = video.play();
      if (result && typeof result.catch === "function") result.catch(() => undefined);
    };

    const tick = () => {
      if (swapping || !Number.isFinite(current.duration) || !current.duration) return;
      if (current.duration - current.currentTime > fade) return;
      swapping = true;
      const outgoing = current;
      try { next.currentTime = 0; } catch {}
      play(next);
      next.classList.add("earth-hero__video--active");
      outgoing.classList.remove("earth-hero__video--active");
      current = next;
      next = outgoing;
      timer = setTimeout(() => {
        outgoing.pause();
        try { outgoing.currentTime = 0; } catch {}
        swapping = false;
      }, fade * 1000 + 100);
    };

    first.addEventListener("timeupdate", tick);
    second.addEventListener("timeupdate", tick);
    play(first);
    return () => {
      first.removeEventListener("timeupdate", tick);
      second.removeEventListener("timeupdate", tick);
      if (timer) clearTimeout(timer);
      first.pause();
      second.pause();
    };
  }, []);

  return (
    <section className="earth-hero" aria-labelledby="earth-hero-title">
      <div className="earth-hero__media" aria-hidden="true">
        <video ref={videoA} className="earth-hero__video earth-hero__video--active" autoPlay muted loop playsInline preload="auto" poster={POSTER_URL}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <video ref={videoB} className="earth-hero__video" muted loop playsInline preload="auto" poster={POSTER_URL}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="earth-hero__shade" />
        <div className="earth-hero__bottom" />
      </div>

      <div className="earth-hero__content">
        <div className="earth-hero__eyebrow"><span /> HORIZONX · THE WEB3 LAUNCH ECOSYSTEM</div>
        <h1 id="earth-hero-title">Build what&apos;s next.<br /><span>Launch it here.</span></h1>
        <p>
          Create tokens, launch projects and grow your Web3 community —
          <br className="earth-hero__desktop-break" /> from your first idea to a thriving ecosystem.
        </p>
        <div className="earth-hero__actions">
          <Link href="/explore" style={primaryButton} className="earth-hero__button">
            Explore HorizonX <Arrow />
          </Link>
          <Link href="/tokens/create" style={secondaryButton} className="earth-hero__button">
            Create a token <Arrow />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .earth-hero {
          position:relative; isolation:isolate; width:100vw; height:min(850px,100svh); min-height:690px;
          margin:-5.5rem calc(50% - 50vw) 0; overflow:hidden; display:grid; place-items:center;
          background:#05040b; color:#fff;
        }
        .earth-hero__media { position:absolute; z-index:-1; inset:0; overflow:hidden; background:#05040b; }
        .earth-hero__media:before {
          content:""; position:absolute; z-index:2; inset:0; pointer-events:none;
          background:radial-gradient(ellipse at 50% 43%,transparent 27%,rgba(3,2,10,.2) 73%,rgba(3,2,10,.65) 100%);
        }
        .earth-hero__video {
          position:absolute; inset:0; width:100%; height:100%; display:block; object-fit:cover;
          object-position:51% 8%; opacity:0; transition:opacity 1.4s linear; pointer-events:none;
        }
        .earth-hero__video--active { opacity:1; }
        .earth-hero__shade {
          position:absolute; z-index:3; inset:0; pointer-events:none;
          background:linear-gradient(180deg,rgba(5,4,11,.18),transparent 27%,rgba(5,4,11,.08) 65%,rgba(5,4,11,.42));
        }
        .earth-hero__bottom {
          position:absolute; z-index:4; left:0; right:0; bottom:0; height:45%; pointer-events:none;
          background:linear-gradient(180deg,rgba(5,4,11,0),rgba(5,4,11,.38) 38%,rgba(5,4,11,.86) 78%,#080711 100%);
        }
        .earth-hero__content {
          position:relative; z-index:5; width:min(920px,calc(100% - 40px)); margin-top:2.3rem;
          text-align:center; animation:hero-in 1.05s cubic-bezier(.16,1,.3,1) both;
        }
        .earth-hero__eyebrow {
          display:inline-flex; align-items:center; justify-content:center; gap:11px; margin-bottom:23px;
          color:rgba(238,235,255,.8); font-size:10px; font-weight:700; letter-spacing:.22em;
        }
        .earth-hero__eyebrow span { width:24px; height:1px; background:#b8a5ff; box-shadow:0 0 14px #8b5cf6; }
        h1 {
          margin:0; color:#fff; font-size:clamp(58px,7.6vw,100px); font-weight:500;
          line-height:.99; letter-spacing:-.075em; text-wrap:balance; text-shadow:0 4px 38px rgba(0,0,0,.3);
        }
        h1 span { color:#d8ccff; }
        p {
          max-width:700px; margin:25px auto 0; color:rgba(246,244,255,.86); font-size:clamp(15px,1.35vw,17px);
          font-weight:400; line-height:1.75; letter-spacing:-.025em; text-shadow:0 2px 20px rgba(0,0,0,.72);
        }
        .earth-hero__actions { display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:11px; margin-top:31px; }
        .earth-hero__button { transition:transform .2s ease,background .2s ease,border-color .2s ease,box-shadow .2s ease; }
        .earth-hero__button:hover { transform:translateY(-2px); }
        @keyframes hero-in { from { opacity:0; transform:translateY(22px); filter:blur(5px); } to { opacity:1; transform:translateY(0); filter:blur(0); } }
        @media(max-width:640px) {
          .earth-hero { height:min(780px,100svh); min-height:680px; margin-top:-4.5rem; }
          .earth-hero__video { object-position:52% 48%; }
          .earth-hero__content { width:calc(100% - 34px); margin-top:1.8rem; }
          .earth-hero__eyebrow { margin-bottom:19px; font-size:9px; letter-spacing:.15em; }
          h1 { font-size:clamp(48px,12vw,70px); line-height:1.03; }
          p { margin-top:19px; font-size:14px; line-height:1.7; }
          .earth-hero__desktop-break { display:none; }
          .earth-hero__actions { gap:9px; margin-top:25px; }
          .earth-hero__bottom { height:39%; }
        }
        @media(prefers-reduced-motion:reduce) {
          .earth-hero__content { animation:none; }
          .earth-hero__video { transition:none; }
        }
      `}</style>
    </section>
  );
}
