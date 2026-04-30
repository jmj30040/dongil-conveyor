const gallery = document.getElementById("works-gallery");
const lightbox = document.getElementById("gallery-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const lightboxPrev = lightbox?.querySelector(".lightbox-prev");
const lightboxNext = lightbox?.querySelector(".lightbox-next");
const lightboxCount = lightbox?.querySelector(".lightbox-count");
let currentImages = [];
let currentIndex = 0;

const repoOwner = "jmj30040";
const repoName = "dongil-conveyor";
const worksPath = "images/works";
const branch = "main";
const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

const formatTitle = (filename) => {
  const name = filename.replace(/\.[^.]+$/, "");
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "시공사례";
};

const renderEmpty = (message) => {
  if (!gallery) return;
  gallery.innerHTML = `<div class="gallery-empty">${message}</div>`;
};

const renderImages = (images) => {
  if (!gallery) return;

  if (!images.length) {
    renderEmpty("등록된 시공사례 이미지가 없습니다.");
    return;
  }

  gallery.innerHTML = images.map((image, index) => {
    const title = formatTitle(image.name);

    return `
      <article class="work-card">
        <button class="work-media" type="button" data-index="${index}" aria-label="${title} 확대 보기">
          <img src="${image.download_url}" alt="${title} 사진" loading="lazy">
        </button>
      </article>
    `;
  }).join("");
};

const updateLightbox = () => {
  if (!lightboxImage || !lightboxCount || !currentImages[currentIndex]) return;

  const image = currentImages[currentIndex];
  const title = formatTitle(image.name);

  lightboxImage.src = image.download_url;
  lightboxImage.alt = `${title} 확대 이미지`;
  lightboxCount.textContent = `${currentIndex + 1} / ${currentImages.length}`;
};

const openLightbox = (index) => {
  if (!lightbox || !lightboxImage) return;

  currentIndex = index;
  updateLightbox();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
};

const showPrevImage = () => {
  if (!currentImages.length) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateLightbox();
};

const showNextImage = () => {
  if (!currentImages.length) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateLightbox();
};

const loadWorksImages = async () => {
  if (!gallery) return;

  const apiUrl = isLocalhost
    ? "/api/works-images"
    : `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${worksPath}?ref=${branch}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error("GitHub directory request failed");
    }

    const files = await response.json();
    const images = files
      .filter((file) => file.type === "file")
      .filter((file) => imageExtensions.some((extension) => file.name.toLowerCase().endsWith(extension)))
      .filter((file) => file.name !== ".gitkeep")
      .sort((a, b) => a.name.localeCompare(b.name, "ko"));

    currentImages = images;
    renderImages(images);
  } catch (error) {
    renderEmpty("이미지 목록을 불러오지 못했습니다. GitHub Pages 배포 후 다시 확인해 주세요.");
  }
};

loadWorksImages();

gallery?.addEventListener("click", (event) => {
  const target = event.target.closest(".work-media");

  if (!target) return;

  openLightbox(Number(target.dataset.index || 0));
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", showPrevImage);
lightboxNext?.addEventListener("click", showNextImage);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }

  if (!lightbox?.classList.contains("is-open")) return;

  if (event.key === "ArrowLeft") {
    showPrevImage();
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }
});
