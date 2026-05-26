
const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");
const menuLinks = document.querySelectorAll(".site-menu a");
const revealElements = document.querySelectorAll(".reveal");
const audio = document.querySelector("#site-audio");
const audioToggle = document.querySelector("#audio-toggle");

if (menuToggle && siteMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (audio && audioToggle) {
  const setAudioState = (isPlaying) => {
    audioToggle.classList.toggle("is-playing", isPlaying);
    audioToggle.setAttribute("aria-pressed", String(isPlaying));
    audioToggle.innerHTML = `
      <span class="audio-dot"></span>
      Música ${isPlaying ? "ON" : "OFF"}
    `;
  };

  setAudioState(false);

  audioToggle.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        setAudioState(true);
      } catch (error) {
        setAudioState(false);
        console.error("No se pudo reproducir el audio:", error);
      }
    } else {
      audio.pause();
      setAudioState(false);
    }
  });

  audio.addEventListener("ended", () => setAudioState(false));
  audio.addEventListener("pause", () => setAudioState(false));
  audio.addEventListener("play", () => setAudioState(true));
}
