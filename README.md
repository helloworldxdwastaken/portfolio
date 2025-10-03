# 🚀 Portfolio - Ready for GitHub Pages

Modern, responsive portfolio showcasing UI/UX design work and projects.

## Quick Deploy to GitHub Pages

1. Create repository at https://github.com/new
2. Name it `your-username.github.io` or `portfolio`
3. Upload all files from this folder
4. Settings → Pages → Deploy from `main` branch
5. Wait 1-2 minutes - your site is live!

## Before Deploying

Update these in your files:
- Email: Replace `info.dronx@gmail.com` with yours
- Social links in `components/footer.html`

## Local Testing (Optional)

```bash
cd portfolio-main
python3 -m http.server 8000
```

Visit: http://localhost:8000

## Features

✅ Dynamic navbar/footer components  
✅ Smooth animations (GSAP)  
✅ Fully responsive  
✅ SEO optimized  
✅ Fast loading  

## Project Structure

```
portfolio-main/
├── index.html          # Homepage
├── about.html          # About page  
├── work.html           # Projects
├── 404.html            # Error page
├── components/
│   ├── navbar.html     # Navigation
│   └── footer.html     # Footer
└── assets/
    ├── css/main.css    # Styles
    ├── js/             # Scripts
    ├── images/         # Images
    └── media/          # Videos
```

## Customization

**Edit Navigation**: `components/navbar.html`  
**Edit Footer**: `components/footer.html`  
**Edit Styles**: `assets/css/main.css`

## Analytics Note

The `admin.html` analytics dashboard uses browser localStorage and won't work on GitHub Pages (requires a backend). For real analytics, use:
- Google Analytics
- Plausible Analytics  
- Vercel Analytics (if hosted on Vercel)

---

Made with ❤️ and Wolt takeaways
