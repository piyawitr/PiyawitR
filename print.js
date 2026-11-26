(() => {
  const root = document.createElement("main");
  root.id = "print-resume";
  root.setAttribute("aria-label", "Printable one-page CV");
  document.body.appendChild(root);

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  };
  const nonempty = (value) => value !== undefined && value !== null && String(value).trim() !== "";
  const appendText = (parent, tag, cls, value) => {
    if (nonempty(value)) parent.appendChild(el(tag, cls, value));
  };
  const section = (parent, title) => {
    const box = el("section", "cv-section");
    box.appendChild(el("h2", "", title));
    parent.appendChild(box);
    return box;
  };
  const entry = (parent, title, meta, date, description, bullets) => {
    if (![title, meta, date, description].some(nonempty) && !(bullets || []).length) return;
    const box = el("article", "cv-entry");
    const head = el("div", "cv-entry-head");
    appendText(head, "strong", "", title);
    appendText(head, "span", "cv-date", date);
    box.appendChild(head);
    appendText(box, "div", "cv-meta", meta);
    appendText(box, "p", "", description);
    if (Array.isArray(bullets) && bullets.length) {
      const list = el("ul");
      bullets.filter(nonempty).forEach(item => list.appendChild(el("li", "", item)));
      if (list.childElementCount) box.appendChild(list);
    }
    parent.appendChild(box);
  };
  const render = data => {
    root.replaceChildren();
    const inner = el("div", "cv-inner");
    const header = el("header", "cv-header");
    appendText(header, "h1", "", data.name || "Resume");
    appendText(header, "p", "cv-position", data.position);
    const contacts = (data.contact || []).filter(x => x && x.visible !== false && nonempty(x.value));
    if (contacts.length) {
      const row = el("div", "cv-contact");
      contacts.forEach(item => row.appendChild(el("span", "", [item.label, item.value].filter(nonempty).join(": "))));
      header.appendChild(row);
    }
    appendText(header, "p", "cv-summary", data.summary);
    inner.appendChild(header);

    const columns = el("div", "cv-columns");
    const primary = el("div", "cv-column");
    const sidebar = el("div", "cv-column");
    const visible = data.sectionVisibility || {};
    const isVisible = id => visible[id] !== false;

    if (isVisible("experience") && (data.workExperience || []).length) {
      const box = section(primary, "Experience");
      data.workExperience.forEach(job => entry(box, job.title, [job.company, job.location].filter(nonempty).join(" · "), job.period, job.description, job.highlights));
    }
    if (isVisible("projects") && (data.projects || []).length) {
      const box = section(primary, "Selected projects");
      data.projects.forEach(project => {
        const description = [project.description, (project.tools || []).filter(nonempty).join(" · ")].filter(nonempty).join(" — ");
        entry(box, project.title, "", "", description, []);
      });
    }
    if (isVisible("education") && (data.education || []).length) {
      const box = section(primary, "Education");
      data.education.forEach(item => entry(box, item.school || item.degree, item.school && item.degree ? item.degree : item.details, item.period, item.details && item.degree ? item.details : "", []));
    }

    if (isVisible("skills") && (data.skills || []).length) {
      const box = section(sidebar, "Skills");
      data.skills.forEach(group => {
        if (!(group.items || []).length) return;
        const line = el("div", "cv-skills");
        appendText(line, "strong", "", group.category);
        const tags = el("div", "cv-tags");
        (group.items || []).filter(nonempty).forEach(item => tags.appendChild(el("span", "", item)));
        line.appendChild(tags);
        box.appendChild(line);
      });
    }
    if (isVisible("certificates") && (data.certificates || []).length) {
      const box = section(sidebar, "Certificates");
      data.certificates.forEach(cert => entry(box, cert.title, cert.issuer, cert.year, "", []));
    }
    if (isVisible("languages") && (data.languages || []).length) {
      const box = section(sidebar, "Languages");
      data.languages.forEach(language => entry(box, language.name, language.level, "", "", []));
    }

    (data.customSections || []).filter(item => item && item.visible !== false).sort((a,b) => (a.order ?? 999) - (b.order ?? 999)).forEach(item => {
      const box = section(primary, item.title || "Additional information");
      appendText(box, "p", "", item.description);
      (item.paragraphs || []).forEach(text => appendText(box, "p", "", text));
      (item.items || []).forEach(child => entry(box, child.title, "", "", child.description, child.bullets));
      if (Array.isArray(item.bullets) && item.bullets.length) {
        const list = el("ul");
        item.bullets.filter(nonempty).forEach(text => list.appendChild(el("li", "", text)));
        box.appendChild(list);
      }
      (item.blocks || []).forEach(block => {
        if (block.type === "heading") appendText(box, "strong", "", block.text);
        if (block.type === "paragraph") appendText(box, "p", "", block.text);
        if (block.type === "bullets" && Array.isArray(block.items)) {
          const list = el("ul");
          block.items.filter(nonempty).forEach(text => list.appendChild(el("li", "", text)));
          box.appendChild(list);
        }
      });
    });
    columns.append(primary, sidebar);
    inner.appendChild(columns);
    root.appendChild(inner);
  };

  fetch("data/resume.json")
    .then(response => { if (!response.ok) throw new Error("Could not load resume data"); return response.json(); })
    .then(render)
    .catch(error => console.error("Printable CV could not be rendered:", error));

  const fit = () => {
    const inner = root.querySelector(".cv-inner");
    if (!inner) return;
    inner.style.setProperty("--cv-scale", "1");
    const available = root.clientHeight;
    const needed = inner.scrollHeight;
    if (needed > available && available > 0) {
      inner.style.setProperty("--cv-scale", String(available / needed));
    }
  };
  window.addEventListener("beforeprint", fit);
  window.addEventListener("afterprint", () => {
    const inner = root.querySelector(".cv-inner");
    if (inner) inner.style.removeProperty("--cv-scale");
  });
})();
