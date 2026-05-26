
const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");
const menuLinks = document.querySelectorAll(".site-menu a");
const revealElements = document.querySelectorAll(".reveal");
const audio = document.querySelector("#bg-audio");
const audioToggle = document.querySelector("#audio-toggle");
const audioStatus = document.querySelector("#audio-status");
const easterInput = document.querySelector("#easter-trigger");
const screamerOverlay = document.querySelector("#screamer-overlay");
const screamerClose = document.querySelector("#screamer-close");
const fireworksCanvas = document.querySelector("#fireworks-canvas");

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

if (easterInput && screamerOverlay && screamerClose && fireworksCanvas) {
  const canvasContext = fireworksCanvas.getContext("2d");
  const fireworks = [];
  const particles = [];
  let overlayTimer;
  let fireworkTimer;
  let animationFrame;
  let isScreamerActive = false;
  let easterTriggered = false;

  const resizeCanvas = () => {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  };

  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const launchFirework = () => {
    fireworks.push({
      x: randomBetween(0.18, 0.82) * fireworksCanvas.width,
      y: fireworksCanvas.height + 20,
      targetY: randomBetween(0.18, 0.62) * fireworksCanvas.height,
      speed: randomBetween(7, 11),
      hue: randomBetween(180, 340),
    });
  };

  const burstFirework = (firework) => {
    const total = 28;

    for (let index = 0; index < total; index += 1) {
      const angle = (Math.PI * 2 * index) / total;
      const velocity = randomBetween(2.5, 6.8);

      particles.push({
        x: firework.x,
        y: firework.y,
        dx: Math.cos(angle) * velocity,
        dy: Math.sin(angle) * velocity,
        life: 1,
        decay: randomBetween(0.012, 0.022),
        hue: firework.hue + randomBetween(-22, 22),
        size: randomBetween(2, 4.5),
      });
    }
  };

  const renderFireworks = () => {
    canvasContext.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    canvasContext.globalCompositeOperation = "lighter";

    for (let i = fireworks.length - 1; i >= 0; i -= 1) {
      const firework = fireworks[i];
      firework.y -= firework.speed;

      canvasContext.beginPath();
      canvasContext.arc(firework.x, firework.y, 2.2, 0, Math.PI * 2);
      canvasContext.fillStyle = `hsla(${firework.hue} 100% 68% / 1)`;
      canvasContext.shadowBlur = 22;
      canvasContext.shadowColor = `hsla(${firework.hue} 100% 68% / 0.9)`;
      canvasContext.fill();

      if (firework.y <= firework.targetY) {
        burstFirework(firework);
        fireworks.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];
      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.dy += 0.04;
      particle.life -= particle.decay;

      if (particle.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      canvasContext.beginPath();
      canvasContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      canvasContext.fillStyle = `hsla(${particle.hue} 100% 68% / ${particle.life})`;
      canvasContext.shadowBlur = 18;
      canvasContext.shadowColor = `hsla(${particle.hue} 100% 68% / ${particle.life})`;
      canvasContext.fill();
    }

    canvasContext.shadowBlur = 0;
    animationFrame = requestAnimationFrame(renderFireworks);
  };

  const stopFireworks = () => {
    clearInterval(fireworkTimer);
    cancelAnimationFrame(animationFrame);
    fireworks.length = 0;
    particles.length = 0;
    canvasContext.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  };

  const closeScreamer = () => {
    if (!isScreamerActive) return;

    isScreamerActive = false;
    screamerOverlay.classList.remove("is-active");
    screamerOverlay.setAttribute("aria-hidden", "true");
    clearTimeout(overlayTimer);
    stopFireworks();
  };

  const openScreamer = () => {
    if (isScreamerActive) return;

    isScreamerActive = true;
    screamerOverlay.classList.add("is-active");
    screamerOverlay.setAttribute("aria-hidden", "false");
    resizeCanvas();
    launchFirework();
    launchFirework();
    renderFireworks();

    fireworkTimer = window.setInterval(() => {
      launchFirework();
    }, 380);

    overlayTimer = window.setTimeout(() => {
      closeScreamer();
    }, 4200);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  easterInput.addEventListener("input", (event) => {
    const value = event.target.value.trim().toLowerCase();

    if (value === "ninja" && !easterTriggered) {
      easterTriggered = true;
      openScreamer();
      event.target.value = "";
      window.setTimeout(() => {
        easterTriggered = false;
      }, 1500);
    }
  });

  screamerClose.addEventListener("click", closeScreamer);
  screamerOverlay.addEventListener("click", (event) => {
    if (event.target === screamerOverlay) {
      closeScreamer();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeScreamer();
    }
  });
}
