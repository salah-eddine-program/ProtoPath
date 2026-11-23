# ⚡ ProtoPath — Smart Electronics Prototyping Platform

**An Integrated Engineering Workbench for Embedded Systems & Electronics Prototyping**

<p align="center">
  <a href="https://salah-eddine-program.github.io/ProtoPath/">
    <img src="https://img.shields.io/badge/Live%20Demo-Open%20ProtoPath-00B8D9?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

---

## 🌐 Live Demo

**Explore ProtoPath:**  
https://salah-eddine-program.github.io/ProtoPath/

ProtoPath is a web-based engineering workspace designed to simplify electronics prototyping and embedded systems development.

It brings essential hardware planning tools together in one organized, interactive environment.

## 📸 Screenshots

<!-- Add your screenshots to a folder named screenshots -->

| Dashboard | Pin Planner |
|:---:|:---:|
| ![Dashboard](screenshots/dashboard.png) | ![Pin Planner](screenshots/pin-planner.png) |

| Engineering Calculators | Components Library |
|:---:|:---:|
| ![Calculators](screenshots/calculators.png) | ![Components](screenshots/components.png) |

## ✨ Features

### 📊 Engineering Dashboard
- Interactive project overview.
- Hardware project presets.
- Quick access to engineering tools.
- Project status overview.

### 🔌 ESP32 Pin Planner
- Interactive GPIO pin planning.
- Pin assignment management.
- Component-to-pin mapping.
- Wi-Fi configuration awareness.
- Organized hardware connections.

### 🧮 Electrical Calculators
- Dedicated electrical engineering calculation workspace.
- Tools for common electronics calculations.
- Faster and more organized design workflows.

### 🧰 Components Library
- Organized electronic components catalog.
- Component selection and management.
- Add components to the Bill of Materials.

### 📦 Bill of Materials (BOM)
- Automatic component list management.
- Quantity adjustment.
- Component status tracking.
- Remove and update components.

### 🌍 Multilingual Interface
- Arabic (RTL).
- English (LTR).
- Dynamic language switching.

### 💾 Project Management
- Save project data locally in the browser.
- Restore saved project information.
- Reset projects to predefined presets.
- Export project configuration as JSON.

### 🎨 Modern Interface
- Dark engineering-inspired design.
- Responsive layout.
- Technical grid background.
- Clear navigation and interactive components.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| TypeScript | Type safety |
| Vite 8 | Development and production build |
| Tailwind CSS 4 | Styling |
| Lucide React | Icons |
| Local Storage | Local project persistence |
| GitHub Pages | Hosting |

## 🚀 Getting Started

### Requirements
- Node.js 22 or later.
- npm.
- Git.

### Installation

Clone the repository:

```bash
git clone https://github.com/salah-eddine-program/ProtoPath.git
```

Navigate to the project directory:

```bash
cd ProtoPath
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## 📁 Project Structure

```text
ProtoPath/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── i18n/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 Project Goals

ProtoPath aims to make electronics prototyping more organized and accessible by combining hardware planning, component management, and engineering calculations in a single web platform.

It is designed for:
- Electronics engineering students.
- Embedded systems developers.
- Arduino and ESP32 enthusiasts.
- Electronics prototyping projects.
- Hardware designers and makers.

## 🔮 Future Improvements

Potential future development directions:

- Support for additional microcontrollers such as Arduino, ESP8266, and STM32.
- Advanced circuit design tools.
- More electrical engineering calculators.
- PDF project reports.
- Expanded electronic component database.
- Hardware compatibility checking.
- Enhanced project export and import.
- More languages.

## 👨‍💻 Author

**Salah Eddine Ben Ettouati**

Electronics Engineer | Embedded Systems Developer

- GitHub: https://github.com/salah-eddine-program
- Portfolio: https://bt-salahdine.netlify.app/

## 📄 License

This project is currently published as a personal engineering project.

Please contact the author before redistributing or commercially using the project.

---

<p align="center">
  **ProtoPath — Plan Smarter. Build Better.**
  <br>
  Made with ⚡ for the Electronics & Embedded Systems Community.
</p>
