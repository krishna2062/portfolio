# Krishna Prasad Bhandari — Developer Portfolio

A modern, cinematic developer portfolio for **Krishna Prasad Bhandari** — Computer Engineering student and Full Stack Developer. Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and EmailJS.

---

## 🚀 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Email Service**: EmailJS Browser SDK

---

## 🛠️ Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/krishnaprasadbhandari/portfolio.git
cd portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional for Contact Form)
Create a `.env.local` file in the project root:
```env
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified by Vite) in your browser.

---

## 📦 Production Build & Preview

### Build for production
```bash
npm run build
```

### Preview production build locally
```bash
npm run preview
```

---

## 🌐 Deployment Guides

### A. Deploy to Vercel (Zero-Config)
1. Push this repository to your GitHub account.
2. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your portfolio repository.
4. (Optional) Add your EmailJS keys in **Settings → Environment Variables**:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
5. Click **Deploy**.
> Note: `vercel.json` is included in this repository to automatically handle SPA client-side routing.

---

### B. Deploy to GitHub Pages (Automated via GitHub Actions)
1. Go to your repository on GitHub.
2. Navigate to **Settings → Pages**.
3. Under **Build and deployment → Source**, select **"GitHub Actions"**.
4. Push a commit to `main` or `master`. The included `.github/workflows/deploy.yml` workflow will automatically build and deploy the site to `https://<USERNAME>.github.io/<REPO>/`.
> Note: `public/404.html` and the SPA decoder in `index.html` ensure direct URL access (e.g. `/about`, `/projects`) loads seamlessly without 404 errors.

---

## ⚙️ Environment Variables Reference

| Variable | Description | Where to Configure |
| :--- | :--- | :--- |
| `VITE_EMAILJS_SERVICE_ID` | Your EmailJS service identifier | `.env.local` / Vercel / GitHub Actions Secrets |
| `VITE_EMAILJS_TEMPLATE_ID` | Your EmailJS email template identifier | `.env.local` / Vercel / GitHub Actions Secrets |
| `VITE_EMAILJS_PUBLIC_KEY` | Your EmailJS public API key | `.env.local` / Vercel / GitHub Actions Secrets |
| `VITE_BASE_PATH` | (Optional) Subpath base override for custom hosting | Environment variable |

---

## 📄 License
MIT License. Created by Krishna Prasad Bhandari.
