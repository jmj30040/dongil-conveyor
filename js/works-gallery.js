const gallery = document.getElementById("works-gallery");

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
        <div class="work-media">
          <img src="${image.download_url}" alt="${title} 사진" loading="lazy">
        </div>
        <div class="work-body">
          <span>시공사례 ${String(index + 1).padStart(2, "0")}</span>
          <h3>${title}</h3>
          <p>동일컨베어 현장 시공 및 설치 사진입니다.</p>
        </div>
      </article>
    `;
  }).join("");
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
