
const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");
const menuLinks = document.querySelectorAll(".site-menu a");
const revealElements = document.querySelectorAll(".reveal");
const audio = document.querySelector("#bg-audio");
const audioToggle = document.querySelector("#audio-toggle");
const audioStatus = document.querySelector("#audio-status");

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
    {
      threshold: 0.16,
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (audio && audioToggle && audioStatus) {
  const setAudioState = (isPlaying) => {
    audioToggle.textContent = isPlaying ? "Pausar música" : "Reproducir música";
    audioStatus.textContent = isPlaying ? "Audio activo" : "Audio inactivo";
  };

  audioToggle.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        setAudioState(true);
      } catch {
        audioStatus.textContent = "El navegador bloqueó el autoplay. Pulsa otra vez.";
      }
    } else {
      audio.pause();
      setAudioState(false);
    }
  });

  audio.addEventListener("ended", () => setAudioState(false));
  audio.addEventListener("pause", () => {
    if (!audio.ended) setAudioState(false);
  });
  audio.addEventListener("play", () => setAudioState(true));
}
