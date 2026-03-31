import exifr from 'https://cdn.jsdelivr.net/npm/exifr/dist/full.esm.js';

// Default location mappings - the user can edit these later
const imageLocations = {
  "20230825_193104-Enhanced-SR.jpg": "47.13663660826303, -88.57477830922298",
  "20230825_194941-Enhanced-SR.jpg": "47.135418922379486, -88.57306467459586",
  "_DSC0001-Enhanced-SR.jpg": "47.13647297897375, -88.57419366956556",
  "_DSC0003-Enhanced-SR.jpg": "47.1362907567125, -88.5744489511495",
  "_DSC0006-Enhanced-SR.jpg": "47.13622547152467, -88.57335574424795",
  "20231126-_DSC0169-Enhanced-SR.jpg": "47.13482517144999, -88.8235099873385",
  "20231129-_DSC0294-Enhanced-NR.jpg": "47.117462408178945, -88.53913290413206",
  "20240120-_DSC0422-Enhanced-NR.jpg": "47.2382402234809, -88.61302796194012",
  "20240128-_DSC0579-Enhanced-NR.jpg": "47.168374008546266, -88.43449354635118",
  "20240202-_DSC0657-Enhanced-NR.jpg": "47.12706026226108, -88.68119482084703",
  "20240218-_DSC0909-Enhanced-NR.jpg": "47.19072038675849, -88.40961156805083",
  "20240218-_DSC0911-Enhanced-NR.jpg": "47.192604110997024, -88.40880552115641",
  "20240324-_DSC1691-2-Enhanced-NR.jpg": "47.22923585425073, -88.63633909855109",
  "20240329-_DSC1798-Enhanced-NR.jpg": "47.13216476912266, -88.57896642930429",
  "20240917-_DSC9353-Enhanced-SR-HDR.jpg": "47.116481528805096, -88.55230582383594",
  "_DSC9388.jpg": "47.34366560544107, -88.45227583669768",
  "_DSC9394.jpg": "47.34366560544107, -88.45227583669768",
  "20241007-_DSC9400-Enhanced-NR.jpg": "47.12120154429611, -88.57862947796201",
  "20241007-_DSC9417-Enhanced-NR.jpg": "47.12705149651573, -88.68149277594235",
  "20241007-_DSC9449-Enhanced-NR.jpg": "47.127060306551215, -88.68119635172964",
  "20241007-_DSC9451-Enhanced-NR.jpg": "47.127060306551215, -88.68119635172964",
  "20241010-_DSC9453-Enhanced-NR.jpg": "47.34367804319603, -88.45233320241297",
  "20241010-_DSC9457-Enhanced-NR.jpg": "47.34367804319603, -88.45233320241297",
  "20241010-_DSC9477-Enhanced-NR.jpg": "47.34367804319603, -88.45233320241297",
  "20241010-_DSC9504-Enhanced-NR.jpg": "47.34367804319603, -88.45233320241297",
  "20250906-_DSC4618.jpg": "47.126861217614774, -88.6820597241228",
  "20250906-_DSC4625.jpg": "47.126861217614774, -88.6820597241228",
  "20250906-_DSC4635.jpg": "47.12703500629876, -88.68220718062065",
  "20250906-_DSC4693.jpg": "47.13516010875379, -88.72231418012247",
  "20250914-_DSC5210.jpg": "47.12268082006214, -88.57162881555064",
  "20250914-_DSC5226.jpg": "47.14623396591915, -88.4603878458599",
  "20251011-_DSC5789.jpg": "47.38625191299074, -87.82729645933667",
  "20251011-_DSC5799.jpg": "47.38625191299074, -87.82729645933667",
  "20251011-_DSC5813.jpg": "47.386705083860015, -87.82796420269155",
  "20251011-_DSC5816.jpg": "47.387943003544315, -87.82812110934796",
  "20251011-_DSC5826.jpg": "47.3876957626374, -87.82853258605157",
  "20251011-_DSC5829.jpg": "47.3883763986404, -87.82806612640721",
  "20251011-_DSC5849.jpg": "47.39246673289279, -87.84151546758524",
  "20251011-_DSC5861.jpg": "47.39246673289279, -87.84151546758524",
  "20251011-_DSC5866.jpg": "47.39246673289279, -87.84151546758524",
  "20251011-_DSC5867.jpg": "47.39246673289279, -87.84151546758524",
  "20260313-_DSC7936.jpg": "47.274338820449664, -88.53066191498257",
  "20260313-_DSC7960.jpg": "47.274338820449664, -88.53066191498257",
};

// Shutter Speed formatter function
function formatShutterSpeed(time) {
  if (!time) return '';
  if (time >= 1) return time + '"';
  let fraction = Math.round(1 / time);
  return '1/' + fraction + '"';
}

// Ensure the code runs after DOM is fully ready
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  let currentZoom = 1;

  // Close lightbox on tap/click
  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("active");
    setTimeout(() => {
      currentZoom = 1;
      lightboxImg.style.transform = `scale(1)`;
    }, 300); // Wait for fade out
  });

  // Scroll to zoom inside lightbox
  lightbox.addEventListener("wheel", (e) => {
    if (!lightbox.classList.contains("active")) return;
    e.preventDefault();
    currentZoom += e.deltaY * -0.002;
    currentZoom = Math.min(Math.max(0.5, currentZoom), 6); // constrain zoom
    lightboxImg.style.transform = `scale(${currentZoom})`;
  }, { passive: false });

  // Iterate and create elements
  Object.keys(imageLocations).forEach((filename, index) => {
    const location = imageLocations[filename];
    const imagePath = `Gallery Project/${filename}`;
    const thumbPath = `Gallery Project/thumbnails/${filename}`;

    // Create wrapper and image
    const itemDiv = document.createElement("figure");
    itemDiv.className = "gallery-item";

    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";

    // Bind click to open lightbox
    wrapper.addEventListener("click", () => {
      lightboxImg.src = imagePath;
      lightbox.classList.add("active");
    });
    const imgElement = document.createElement("img");
    imgElement.src = thumbPath;
    imgElement.alt = `Gallery Image ${index + 1}`;

    // Lazy loading for large images
    imgElement.loading = "lazy";

    // Create text metadata container
    const metaDiv = document.createElement("figcaption");
    metaDiv.className = "metadata";
    metaDiv.innerHTML = `
      <div class="meta-row meta-model skeleton"></div>
      <div class="meta-row skeleton" style="width: 150px"></div>
    `; // skeleton loading state

    imgElement.onload = () => {
      imgElement.classList.add("loaded");

      // Parse metadata from the THUMBNAIL file (much faster than fetching the huge originals)
      exifr.parse(thumbPath, {
        pick: ['Model', 'FNumber', 'FocalLength', 'FocalLengthIn35mmFormat', 'ISO', 'ExposureTime'],
        tiff: true,
        ifd0: true,
        exif: true
      })
        .then(metadata => {
          if (metadata) {
            let model = metadata.Model || 'Unknown Camera';
            if (model.includes('SM-S901U') || model.includes('sm-s901u') || model.toUpperCase().includes('SM-S901U')) {
              model = 'Samsung Galaxy S22';
            }
            let speed = formatShutterSpeed(metadata.ExposureTime) || 'N/A';
            let fstop = metadata.FNumber ? 'ƒ/' + metadata.FNumber : 'N/A';
            let calcFocal = metadata.FocalLengthIn35mmFormat || metadata.FocalLength || 'N/A';
            let focalLength = calcFocal !== 'N/A' ? calcFocal + 'mm' : 'N/A';
            let iso = metadata.ISO ? 'ISO ' + metadata.ISO : 'N/A';

            metaDiv.innerHTML = `
              <div class="meta-model">${model}</div>
              <div class="meta-row">
                <span class="meta-value">${fstop}</span> —
                <span class="meta-value">${focalLength}</span> —
                <span class="meta-value">${iso}</span> —
                <span class="meta-value">${speed}</span>
              </div>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}" target="_blank" rel="noopener noreferrer" class="location-tag">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                 </svg>
                 <span>${location}</span>
              </a>
            `;
          } else {
            metaDiv.innerHTML = `<div class="meta-model">Metadata Unavailable</div>`;
          }
        })
        .catch(err => {
          console.error("EXIF Parsing Error for " + filename, err);
          metaDiv.innerHTML = `<div class="meta-model">Metadata Error</div>`;
        });
    };

    wrapper.appendChild(imgElement);
    itemDiv.appendChild(wrapper);
    itemDiv.appendChild(metaDiv);

    gallery.appendChild(itemDiv);
  });
});
