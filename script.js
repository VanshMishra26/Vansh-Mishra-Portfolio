const projects = {
  void: {
    title: "Void",
    subtitle: "Modular PDF Processing Backend",
    cover: "cover-void",
    stack: ["Python", "Flask", "PyMuPDF", "PyPDF2", "SQLite"],
    bullets: [
      "Built a 5-endpoint Flask REST API for merge, split, compress, download, and job status workflows.",
      "Designed a 5-layer validation system for file type checks, 100 MB limits, corrupted PDFs, encrypted PDFs, and invalid split points.",
      "Engineered a job-based processing pipeline with unique job IDs, status tracking, download endpoints, and SQLite metadata persistence.",
      "Implemented centralized logging and cleanup utilities, with a path toward Redis, Celery, and S3."
    ]
  },
  cache: {
    title: "Multi-Level Cache Performance Analyzer",
    subtitle: "Cache Hierarchy Simulator",
    cover: "cover-cache",
    stack: ["Python", "Matplotlib", "NumPy", "LRU"],
    bullets: [
      "Simulated a full L1/L2/L3 cache hierarchy from 32 KB to 128 KB to 512 KB with LRU eviction.",
      "Added a Markov-based AI prefetcher that learns access patterns and pre-loads likely future addresses.",
      "Reduced average memory access time from about 8.7 to about 5.9 cycles on sequential traces.",
      "Built what-if cost analysis for silicon area and power consumption across cache configurations."
    ]
  },
  asclepius: {
    title: "Asclepius FastAPI",
    subtitle: "Medical Symptom Triage API",
    cover: "cover-asclepius",
    stack: ["Python", "FastAPI", "Pydantic v2", "OpenAPI"],
    bullets: [
      "Built a 6-endpoint RESTful triage API for diagnosis, history retrieval, clearing, health checks, and echo flows.",
      "Implemented Pydantic v2 validators for symptom length, severity scale, age range, and duration constraints.",
      "Added middleware, structured exception handling, and Swagger/OpenAPI documentation for all endpoints.",
      "Maintained a clean Git history through disciplined rebasing workflows."
    ]
  }
};

const topbar = document.querySelector("#topbar");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("[data-section]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const searchInput = document.querySelector("#site-search");
const modal = document.querySelector("#project-modal");
const modalContent = document.querySelector("#modal-content");
const modalClose = document.querySelector("#modal-close");
const moreButton = document.querySelector("#more-button");
const moreMenu = document.querySelector("#more-menu");

function setActiveSection(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === id);
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveSection(visible.target.id);
    }
  },
  { rootMargin: "-20% 0px -55% 0px", threshold: [0.18, 0.35, 0.6] }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener("scroll", () => {
  topbar.classList.toggle("solid", window.scrollY > 80);
}, { passive: true });

document.querySelectorAll("[data-row-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const row = document.querySelector(`#${button.dataset.rowTarget}`);
    const direction = Number(button.dataset.dir || 1);
    row.scrollBy({ left: direction * Math.min(560, row.clientWidth * 0.9), behavior: "smooth" });
  });
});

document.querySelectorAll("[data-scroll-row]").forEach((button) => {
  button.addEventListener("click", () => {
    const row = document.querySelector(`#${button.dataset.scrollRow}`);
    row.scrollTo({ left: row.scrollLeft > 0 ? 0 : row.scrollWidth, behavior: "smooth" });
  });
});

function openProject(projectId) {
  const project = projects[projectId];
  if (!project) return;

  modalContent.innerHTML = `
    <div class="modal-hero">
      <div class="album-cover ${project.cover}"><span>${project.title.split(" ")[0]}</span></div>
      <div>
        <p class="eyebrow">Project detail</p>
        <h2>${project.title}</h2>
        <p>${project.subtitle}</p>
        <div class="tags">${project.stack.map((item) => `<span>${item}</span>`).join("")}</div>
      </div>
    </div>
    <div class="modal-body">
      <ul>${project.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
      <a class="green-pill" href="https://github.com/VanshMishra26" target="_blank" rel="noreferrer">View GitHub</a>
    </div>
  `;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

document.querySelectorAll("[data-project]").forEach((card) => {
  card.addEventListener("click", (event) => {
    event.preventDefault();
    openProject(card.dataset.project);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProject(card.dataset.project);
    }
  });
});

modalClose.addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  const searchableItems = [...document.querySelectorAll(".searchable")];

  searchableItems.forEach((item) => {
    const haystack = `${item.dataset.search || ""} ${item.textContent}`.toLowerCase();
    item.classList.toggle("hidden-by-search", query.length > 0 && !haystack.includes(query));
  });
});

const bioToggle = document.querySelector("#bio-toggle");
const bioExtra = document.querySelector("#bio-extra");
bioToggle.addEventListener("click", () => {
  const isClosed = bioExtra.classList.toggle("closed");
  bioToggle.textContent = isClosed ? "Show more" : "Show less";
  bioToggle.setAttribute("aria-expanded", String(!isClosed));
});

moreButton.addEventListener("click", () => {
  const open = moreMenu.classList.toggle("open");
  moreButton.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (event) => {
  if (!moreMenu.contains(event.target) && event.target !== moreButton) {
    moreMenu.classList.remove("open");
    moreButton.setAttribute("aria-expanded", "false");
  }
});

document.querySelector("#copy-email").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("vansh26mishra@gmail.com");
    moreButton.textContent = "ok";
    setTimeout(() => {
      moreButton.textContent = "...";
    }, 1200);
  } catch {
    window.location.href = "mailto:vansh26mishra@gmail.com";
  }
});

document.querySelector("#accent-picker").addEventListener("change", (event) => {
  const value = event.target.value;
  document.documentElement.style.setProperty("--brand-green", value);
  document.documentElement.style.setProperty("--brand-green-hover", value);
});

const counters = [...document.querySelectorAll("[data-counter]")];
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.counter);
    let value = 0;
    const step = Math.ceil(target / 32);
    const timer = setInterval(() => {
      value = Math.min(target, value + step);
      entry.target.textContent = `${value}+`;
      if (value >= target) clearInterval(timer);
    }, 24);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

counters.forEach((counter) => counterObserver.observe(counter));
