# GitHub Resume & Portfolio

A responsive, one-page professional resume website. The site reads all resume content from `data/resume.json`; edit the JSON file to update the website without changing HTML, CSS, or JavaScript.

## 1. Publish with GitHub Pages

1. Open your repository on GitHub.
2. Select **Add file → Upload files**.
3. Upload the contents of this project folder (not the outer folder itself). Keep the folder structure.
4. Scroll down and click **Commit changes**.
5. Open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select branch **main** and folder **/(root)**, then click **Save**.
8. Wait for GitHub Pages to finish publishing. Your site address will be shown on the Pages settings screen.

> If your repository is named `PiyawitR.github.io`, the usual site address is `https://piyawitr.github.io/`. Confirm the actual repository name before relying on that address.

## 2. Edit your resume

1. Open `data/resume.json` in your repository.
2. Click the pencil icon to edit.
3. Change the sample values to your real information. Keep the JSON syntax: double quotes around text, commas between items, and no comma after the final item in an object or array.
4. Click **Commit changes**.
5. Refresh the website after GitHub Pages deploys the update.

The website is designed so that normal content edits happen in `data/resume.json`. Do not edit `index.html`, `style.css`, or `script.js` unless you want to change the website itself.

## 3. Add a profile photo, certificate, or project image

1. Open the relevant folder under `assets/` (for example `assets/certificates/`).
2. Choose **Add file → Upload files** and upload the image.
3. In `data/resume.json`, set the image field to its repository path, for example:
   - `"profileImage": "assets/profile/profile.jpg"`
   - `"image": "assets/certificates/sql-certificate.jpg"`
4. Commit the changes.

You can also use a public image URL. Avoid private or temporary image links.

## 4. Add a custom section

Inside the `customSections` array in `data/resume.json`, add an object like this:

```json
{
  "title": "Training",
  "description": "Courses and workshops I have completed.",
  "order": 2,
  "visible": true,
  "paragraphs": ["A longer paragraph can be added here."],
  "bullets": ["First point", "Second point"],
  "image": "",
  "links": [
    {"label": "Course details", "url": "https://example.com"}
  ],
  "items": [
    {
      "title": "MySQL Training",
      "description": "Practiced SQL queries and data analysis.",
      "bullets": ["SELECT and JOIN", "GROUP BY and aggregate functions"],
      "url": "https://example.com",
      "linkLabel": "View course"
    }
  ]
}
```

Supported custom section fields:
- `title`: heading shown on the page.
- `description`: short description.
- `paragraphs`: array of paragraphs.
- `bullets`: array of bullet points.
- `image`: image path or public URL.
- `links`: array of `{ "label": "...", "url": "..." }`.
- `items`: repeatable sub-items with title, description, bullets, and optional link.
- `blocks`: rich content blocks in the order you want them displayed. Supported types: `heading`, `paragraph`, `bullets`, `image`, and `links`.
- `order`: smaller numbers appear first.
- `visible`: set to `false` to hide the section without deleting it.

Example of rich content blocks:

```json
"blocks": [
  {"type": "heading", "text": "What I learned"},
  {"type": "paragraph", "text": "A paragraph with more detail."},
  {"type": "bullets", "items": ["First point", "Second point"]},
  {"type": "image", "src": "assets/projects/workflow.png", "alt": "Workflow"},
  {"type": "links", "items": [{"label": "Project source", "url": "https://github.com/yourname/project"}]}
]
```

## 5. Reorder or move sections

Edit `sectionOrder` in `data/resume.json` to change the display order. Move the section keys into the order you want. The keys are `experience`, `projects`, `education`, `customSections`, `skills`, `certificates`, `languages`, and `contact`.

Edit `sectionColumns` to choose which desktop column contains each section: `main` or `side`. On mobile, all sections automatically stack into one column.

Example:

```json
"sectionOrder": ["profile", "skills", "experience", "projects", "education", "certificates", "languages", "contact", "customSections"],
"sectionColumns": {
  "experience": "main",
  "projects": "main",
  "education": "main",
  "customSections": "main",
  "skills": "side",
  "certificates": "side",
  "languages": "side",
  "contact": "side"
}
```

## 6. Show or hide standard sections

## 6. Show or hide standard sections

In `sectionVisibility`, use `true` or `false`. Example:

```json
"sectionVisibility": {
  "experience": true,
  "skills": true,
  "projects": false,
  "education": true,
  "certificates": true,
  "languages": false,
  "contact": true
}
```

To change the order of standard sections, move their `<section>` blocks in `index.html`. Custom sections are sorted using their `order` value in JSON.

## 7. Change the website colors

Open `style.css` and edit the variables at the top:

```css
:root {
  --primary: #123b68;
  --primary-dark: #0b2949;
  --accent: #2e6fae;
}
```

The initial theme is white and navy blue (Corporate Professional).

## 8. Download or print as PDF

Open the published website and click **Print / Save PDF**. In the browser print dialog, choose **Save as PDF** or a printer.

## 9. Example files

The `examples/` folder contains sample JSON structures for skills, projects, and custom sections. These are references; the live website reads `data/resume.json`.

## Important

- All sample personal details are placeholders. Replace them before sharing the site with employers.
- Check every public contact detail before publishing.
- Use image paths that match the exact filename and capitalization.
- GitHub Pages is a static website host. This project intentionally has no login-protected admin panel; content is edited in GitHub.
