import { trendingAnime } from "./data/catalog.js";

const grid = document.querySelector("#trending-grid");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".main-nav");
const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderAnimeCard(anime) {
  return `<article class="anime-card reveal"><a href="pages/anime.html" class="anime-art art-${anime.art}" aria-label="Explore ${anime.title}"><span class="art-orb"></span><span class="art-figure"></span><span class="art-slice"></span><span class="status-pill">${anime.status}</span></a><div class="anime-details"><div><p>${anime.genre}</p><h3><a href="pages/anime.html">${anime.title}</a></h3></div><div class="anime-meta"><span class="rating">★ ${anime.rating}</span><span>${anime.year}</span></div></div></article>`;
}

grid.innerHTML = trendingAnime.map(renderAnimeCard).join("");

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
});

nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
}));

if (!motionReduced) {
  const particleLayer = document.querySelector("#particles");
  for (let index = 0; index < 36; index += 1) {
    const particle = document.createElement("span");
    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--y", `${Math.random() * 100}%`);
    particle.style.setProperty("--size", `${1 + Math.random() * 3}px`);
    particle.style.setProperty("--delay", `${Math.random() * -12}s`);
    particle.style.setProperty("--duration", `${8 + Math.random() * 12}s`);
    particleLayer.append(particle);
  }

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}
