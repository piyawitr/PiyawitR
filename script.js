const $ = (id) => document.getElementById(id);
const safe = (value = "") => String(value);
const hasText = (value) => value !== undefined && value !== null && String(value).trim() !== "";
const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const addLink = (parent, label, url) => {
  if (!hasText(url)) return;
  const a = make("a", "", label);
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  parent.appendChild(a);
};
const addBullets = (parent, items) => {
  if (!Array.isArray(items) || !items.length) return;
  const ul = make("ul", "detail-list");
  items.forEach(item => ul.appendChild(make("li", "", item)));
  parent.appendChild(ul);
};

function renderContact(items, target, chips = false) {
  target.replaceChildren();
  (items || []).filter(x => x && x.visible !== false && hasText(x.value)).forEach(item => {
    const wrapper = chips ? make("span", "contact-chip") : make("div", "contact-item");
    if (item.url) addLink(wrapper, `${item.label}: ${item.value}`, item.url);
    else wrapper.textContent = `${item.label}: ${item.value}`;
    target.appendChild(wrapper);
  });
}

function renderResume(data) {
  document.title = `${data.name || "Resume"} | Resume & Portfolio`;
  $("person-name").textContent = data.name || "Your Name";
  $("person-position").textContent = data.position || "Your Professional Position";
  $("person-summary").textContent = data.summary || "";
  $("footer-name").textContent = data.name || "Your Name";
  if (data.profileImage) {
    $("profile-photo").src = data.profileImage;
    $("profile-photo-wrap").hidden = false;
  }
  renderContact(data.contact, $("hero-contact"), true);
  renderContact(data.contact, $("contact-list"), false);

  const experience = $("experience-list");
  experience.replaceChildren();
  (data.workExperience || []).forEach(job => {
    const item = make("article", "timeline-item");
    const top = make("div", "item-top");
    const heading = make("div");
    heading.appendChild(make("h3", "item-title", job.title || "Position"));
    heading.appendChild(make("div", "item-meta", [job.company, job.location].filter(Boolean).join(" · ")));
    top.appendChild(heading);
    top.appendChild(make("span", "date", job.period || ""));
    item.appendChild(top);
    if (job.description) item.appendChild(make("p", "item-description", job.description));
    addBullets(item, job.highlights);
    experience.appendChild(item);
  });

  const skills = $("skills-list");
  skills.replaceChildren();
  (data.skills || []).forEach(group => {
    const wrap = make("div", "skill-group");
    if (group.category) wrap.appendChild(make("h3", "", group.category));
    const tags = make("div", "tag-list");
    (group.items || []).forEach(skill => tags.appendChild(make("span", "tag", skill)));
    wrap.appendChild(tags);
    skills.appendChild(wrap);
  });

  const projects = $("projects-list");
  projects.replaceChildren();
  (data.projects || []).forEach(project => {
    const card = make("article", "project-card");
    if (project.image) {
      const img = make("img");
      img.src = project.image;
      img.alt = project.title || "Project image";
      card.appendChild(img);
    }
    const body = make("div", "project-body");
    body.appendChild(make("h3", "", project.title || "Project"));
    body.appendChild(make("p", "", project.description || ""));
    const tags = make("div", "tag-list");
    (project.tools || []).forEach(tool => tags.appendChild(make("span", "tag", tool)));
    body.appendChild(tags);
    const links = make("div", "link-row");
    addLink(links, "GitHub", project.github);
    addLink(links, "Live Demo", project.demo);
    body.appendChild(links);
    card.appendChild(body);
    projects.appendChild(card);
  });

  const education = $("education-list");
  education.replaceChildren();
  (data.education || []).forEach(entry => {
    const item = make("div", "stack-item");
    item.appendChild(make("strong", "", entry.school || entry.degree || "Education"));
    if (entry.degree && entry.school) item.appendChild(make("div", "", entry.degree));
    item.appendChild(make("small", "", [entry.period, entry.details].filter(Boolean).join(" · ")));
    education.appendChild(item);
  });

  const certificates = $("certificates-list");
  certificates.replaceChildren();
  (data.certificates || []).forEach(cert => {
    const item = make("div", "certificate-item");
    if (cert.image) {
      const img = make("img");
      img.src = cert.image;
      img.alt = cert.title || "Certificate";
      item.appendChild(img);
    } else {
      const placeholder = make("div", "certificate-placeholder", "CERT");
      item.appendChild(placeholder);
    }
    const info = make("div");
    info.appendChild(make("strong", "", cert.title || "Certificate"));
    info.appendChild(make("small", "", [cert.issuer, cert.year].filter(Boolean).join(" · ")));
    if (cert.url) addLink(info, "View certificate", cert.url);
    item.appendChild(info);
    certificates.appendChild(item);
  });

  const languages = $("languages-list");
  languages.replaceChildren();
  (data.languages || []).forEach(language => {
    const item = make("div", "stack-item");
    item.appendChild(make("strong", "", language.name || "Language"));
    if (language.level) item.appendChild(make("small", "", language.level));
    languages.appendChild(item);
  });

  const customRoot = $("custom-sections-list");
  customRoot.replaceChildren();
  (data.customSections || []).filter(section => section.visible !== false).sort((a,b) => (a.order ?? 999) - (b.order ?? 999)).forEach(section => {
    const box = make("section", "custom-section");
    box.appendChild(make("p", "eyebrow", "ADDITIONAL INFORMATION"));
    box.appendChild(make("h2", "", section.title || "Additional Section"));
    if (section.description) box.appendChild(make("p", "", section.description));
    if (section.paragraphs) section.paragraphs.forEach(p => box.appendChild(make("p", "", p)));
    if (section.image) {
      const img = make("img");
      img.src = section.image;
      img.alt = section.title || "Section image";
      box.appendChild(img);
    }
    if (Array.isArray(section.links)) {
      const links = make("div", "link-row");
      section.links.forEach(link => addLink(links, link.label || "Open link", link.url));
      box.appendChild(links);
    }
    if (Array.isArray(section.items)) {
      section.items.forEach(entry => {
        const child = make("div", "custom-item");
        child.appendChild(make("h3", "item-title", entry.title || ""));
        if (entry.description) child.appendChild(make("p", "item-description", entry.description));
        addBullets(child, entry.bullets);
        if (entry.url) addLink(child, entry.linkLabel || "Learn more", entry.url);
        box.appendChild(child);
      });
    }
    if (Array.isArray(section.blocks)) {
      section.blocks.forEach(block => {
        if (block.type === "heading") box.appendChild(make("h3", "item-title", block.text || ""));
        else if (block.type === "paragraph") box.appendChild(make("p", "", block.text || ""));
        else if (block.type === "bullets") addBullets(box, block.items);
        else if (block.type === "image" && block.src) {
          const img = make("img");
          img.src = block.src;
          img.alt = block.alt || section.title || "Section image";
          box.appendChild(img);
        } else if (block.type === "links" && Array.isArray(block.items)) {
          const links = make("div", "link-row");
          block.items.forEach(link => addLink(links, link.label || "Open link", link.url));
          box.appendChild(links);
        }
      });
    }
    addBullets(box, section.bullets);
    customRoot.appendChild(box);
  });

  // Hide empty standard sections. Set "visible": true in the data to retain an empty section.
  const sections = [
    ["experience", data.workExperience], ["skills", data.skills], ["projects", data.projects],
    ["education", data.education], ["certificates", data.certificates], ["languages", data.languages],
    ["contact", (data.contact || []).filter(x => x.visible !== false)]
  ];
  sections.forEach(([id, list]) => {
    const section = $(id);
    const explicit = data.sectionVisibility && data.sectionVisibility[id];
    section.hidden = explicit === false || (!explicit && (!Array.isArray(list) || list.length === 0));
  });
  if (data.sectionVisibility) {
    Object.entries(data.sectionVisibility).forEach(([id, visible]) => {
      const node = $(id);
      if (node && visible === false) node.hidden = true;
    });
  }

  // All standard sections can be reordered in sectionOrder and moved between columns in sectionColumns.
  
const layoutRoot = $("content-grid");

const mainColumn = make("div", "content-column main-column");
const sideColumn = make("div", "content-column side-column");

const defaultOrder = [
  "experience", "projects", "education",
  "customSections", "skills", "certificates",
  "languages", "contact"
];

const order = Array.isArray(data.sectionOrder)
  ? data.sectionOrder
  : defaultOrder;

const nodes = {
  experience: $("experience"),
  projects: $("projects"),
  education: $("education"),
  customSections: $("custom-sections-list"),
  skills: $("skills"),
  certificates: $("certificates"),
  languages: $("languages"),
  contact: $("contact")
};

order.forEach(key => {
  if (nodes[key]) {
    const column = (data.sectionColumns && data.sectionColumns[key])
      || (["skills", "certificates", "languages", "contact"].includes(key)
        ? "side"
        : "main");

    nodes[key].dataset.column = column;

    if (column === "side") {
      sideColumn.appendChild(nodes[key]);
    } else {
      mainColumn.appendChild(nodes[key]);
    }
  }
});

layoutRoot.replaceChildren(mainColumn, sideColumn);

$("print-button").addEventListener("click", () => window.print());

fetch("data/resume.json")
  .then(response => {
    if (!response.ok) throw new Error("Could not load data/resume.json");
    return response.json();
  })
  .then(renderResume)
  .catch(error => {
    console.error(error);
    $("person-summary").textContent = "Please check that data/resume.json exists and contains valid JSON. See README.md for editing instructions.";
  });
