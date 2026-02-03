# 🌐 Open Minded Life

<p align="center">
  <img src="static/images/logo.png" width="120px" alt="Open Minded Life Logo">
  <br>
  <b>A digital sanctuary for authentic, judgment-free, and open-minded connections.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active--Development-orange" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/Platform-Google%20Apps%20Script-green" alt="Platform">
</p>

---

## ✨ Our Philosophy
**Open Minded Life** is more than just a forum; it is a movement. In a world of rigid boxes and social labels, we provide a fluid space for those who live life on their own terms. Inspired by the minimalist elegance of modern social threads, this platform is designed to facilitate deep conversations about alternative lifestyles, personal freedom, and authentic living.

> *"Enter with an open heart, speak with an open mind, and live with an open soul."*

---

## 🚀 Experience The Features

* **🧶 Thread-Style Conversations:** A clean, vertical feed focused on thoughts and ideas rather than distractions.
* **🛡️ Serverless Infrastructure:** Hosted entirely on Google Cloud (Apps Script), ensuring 99.9% uptime with zero hosting costs.
* **⚡ Lightweight & Fast:** Optimized for mobile browsing, ensuring your community is always just a tap away.
* **🔒 Privacy-Focused:** Powered by Google's secure ecosystem. Your data belongs to your story.

---

## 🛠️ The Tech Stack (Serverless Architecture)

This project leverages a clever integration of Google’s workspace tools to create a robust social experience:

* **Engine:** [Google Apps Script](https://developers.google.com/apps-script) — The backend logic handling requests and data flow.
* **Database:** [Google Sheets](https://www.google.com/sheets/about/) — A transparent and real-time database for community posts.
* **Frontend:** [Bootstrap 5](https://getbootstrap.com/) & Vanilla JS — A smooth, responsive, "Threads-inspired" interface.
* **AI Readiness:** Native integration support for **Google Gemini 1.5 Flash** for smart moderation and content insights.

---

📂 Repository Structure & File List (Full List)

```text
Open-Minded-Life/
├── .github/
│   └── workflows/
│       └── deploy.yml          # (Optional) For automation if using Clasp
├── src/                        # Core application source code
│   ├── Code.gs                 # Backend (Google Apps Script Logic)
│   ├── Index.html              # Main Structure (HTML)
│   ├── Styles.html             # Visual Design (CSS - Minimalist/Threads-style)
│   └── JavaScript.html         # Frontend Logic (Client-side JS)
├── images/                     # Visual assets folder
│   ├── logo.png                # Open Minded Life Logo
│   └── screenshot-preview.png  # App preview image for README
├── docs/                       # Supplemental documentation
│   └── setup-guide.md          # Guide for Google Sheets configuration
├── .gitignore                  # Prevents sensitive files from being tracked
├── LICENSE                     # MIT License (Copyright shiftcrypto69)
└── README.md                   # Repository landing page

---

📝 File Descriptions & Functions

1. Folder: src/ (The Application Heart)
Code.gs: This contains the server-side logic, including the doGet() function to serve the web app, the submitPost() function to write to the database, and the Gemini API integration. This engine runs on Google’s servers.

Index.html: The primary entry point for the UI. It integrates the Bootstrap framework and organizes the layout for the feed and the posting forms.

Styles.html: CSS is isolated here to keep the code clean. It contains the styling required to achieve a Threads-inspired aesthetic (e.g., rounded fonts, soft shadows, and minimalist whitespace).

JavaScript.html: Contains the logic to handle data transmission without refreshing the page (using google.script.run) to ensure a smooth, modern user experience.

2. Folder: images/
Crucial for the README.md. Visuals provide potential users and contributors with an immediate understanding of the app’s interface. It is recommended to keep at least one high-quality screenshot here.

3. Root Files
.gitignore: Essential for security. It ensures that sensitive files like .clasp.json or local environment variables are not accidentally pushed to the public repository, protecting your Google account credentials.

LICENSE: The legal framework for your project, using the MIT License (Copyright shiftcrypto69), which allows for open-source collaboration.

README.md: The face of your project. It explains the "Open Minded Life" philosophy, the tech stack, and how to get the project up and running

---

## 📂 Repository Structure

```text
Open-Minded-Life/
├── src/
│   ├── Code.gs         # Backend logic (Google Apps Script)
│   ├── Index.html      # Main UI & Frontend Logic
│   └── CSS.html        # Custom minimalist styling
├── images/             # Logos and screenshots
├── .gitignore          # Keeping Script IDs safe
├── LICENSE             # MIT License (shiftcrypto69)
└── README.md           # The blueprint you are reading

---

⚙️ Installation & Setup (Quick Start)
Since this is a Google Apps Script project, follow these steps to deploy:

1. Create a Google Sheet:
- Create a new sheet named Open Minded Life DB.
- Rename the first tab to Posts and add headers: Timestamp, Username, Content.

2. Open Apps Script:
- In your Sheet, go to Extensions > Apps Script.

3. Copy the Code:
- Copy the contents of src/Code.gs and src/Index.html from this repo into the Apps Script editor.

4. Deploy as Web App:
- Click Deploy > New Deployment.
- Select Web App.
- Set "Execute as" to Me and "Who has access" to Anyone.

5. Get your URL:
- Copy the provided Web App URL and share it with your community!

---

🤝 Community & Contribution
We believe in the power of collective wisdom. If you are a developer, designer, or thinker who believes in an open-minded world, we welcome your contributions.

Be Kind: Diversity of thought is our greatest asset.

Be Transparent: We value honest code and honest talk.

Be Open: Help us build a space that excludes no one.

---

📬 Stay Connected
Project Lead: shiftcrypto69

Vision: To redefine social interaction for the free-spirited.

---

<p align="center"> <i>"Living an open-minded life isn't just a choice; it's a journey."</i>

<b>© 2026 Open Minded Life</b> </p>
