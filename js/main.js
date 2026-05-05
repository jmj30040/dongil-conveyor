const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const heroVideo = document.querySelector(".hero-video");
const heroVideos = [
  "/videos/video1.mp4",
  "/videos/video2.mp4",
  "/videos/video3.mp4",
  "/videos/video4.mp4",
];
const heroVideoInterval = 8000;

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (heroVideo) {
  let currentVideoIndex = 0;

  heroVideo.autoplay = true;
  heroVideo.loop = true;
  heroVideo.muted = true;
  heroVideo.playsInline = true;

  const playHeroVideo = () => {
    const playRequest = heroVideo.play();

    if (playRequest) {
      playRequest.catch(() => {
        // Autoplay can be blocked until the browser has enough user or media context.
      });
    }
  };

  const changeHeroVideo = () => {
    currentVideoIndex = (currentVideoIndex + 1) % heroVideos.length;
    heroVideo.src = heroVideos[currentVideoIndex];
    heroVideo.load();
    playHeroVideo();
  };

  heroVideo.src = heroVideos[currentVideoIndex];
  playHeroVideo();
  window.setInterval(changeHeroVideo, heroVideoInterval);
}
