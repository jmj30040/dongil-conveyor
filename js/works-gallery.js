const gallery = document.getElementById("works-gallery");
const lightbox = document.getElementById("gallery-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

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

  gallery.innerHTML = images.map((image) => {
    const title = formatTitle(image.name);

    return `
      <article class="work-card">
        <button class="work-media" type="button" data-full-image="${image.download_url}" data-title="${title}">
          <img src="${image.download_url}" alt="${title} 사진" loading="lazy">
        </button>
      </article>
    `;
  }).join("");
};

const openLightbox = (imageUrl, title) => {
  if (!lightbox || !lightboxImage) return;

  lightboxImage.src = imageUrl;
  lightboxImage.alt = `${title} 확대 이미지`;
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

    renderImages(images);
  } catch (error) {
    renderEmpty("이미지 목록을 불러오지 못했습니다. GitHub Pages 배포 후 다시 확인해 주세요.");
  }
};

loadWorksImages();

gallery?.addEventListener("click", (event) => {
  const target = event.target.closest(".work-media");

  if (!target) return;

  openLightbox(target.dataset.fullImage, target.dataset.title || "시공사례");
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
