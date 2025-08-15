# Karthikeyan M - Personal Portfolio Website

A professional portfolio website showcasing the skills, projects, and experience of Karthikeyan M (Software Development Engineer | Data Science Undergraduate).

## 🌐 Live Website

**URL:** [https://karthikeyan-muthu-5u.github.io/portfolio-karthikeyan](https://karthikeyan-muthu-5u.github.io/portfolio-karthikeyan)

## 🚀 Features

- **Responsive Design:** Optimized for all devices (desktop, tablet, mobile)
- **Modern UI/UX:** Clean, professional design with smooth animations
- **SEO Optimized:** Meta tags, Open Graph tags, and semantic HTML
- **Accessibility:** ARIA labels, keyboard navigation, high contrast support
- **Performance:** Optimized loading, lazy loading images, minified assets
- **Contact Form:** Integrated with Formspree for direct messaging

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Framework:** Bootstrap 5 for responsive design
- **Icons:** FontAwesome 6
- **Fonts:** Google Fonts (Poppins)
- **Form Service:** Formspree
- **Hosting:** GitHub Pages

## 📁 Project Structure

```
portfolio-karthikeyan/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── portfolio-style.css  # Custom stylesheet
│   ├── js/
│   │   └── portfolio-script.js  # JavaScript functionality
│   └── images/
│       └── profile-photo.jpg    # Profile picture
├── assets/resume.pdf       # Resume download
└── README.md              # Project documentation
```

## 🎨 Design Features

### Color Palette
- **Primary:** #2c3e50 (Dark Blue)
- **Secondary:** #3498db (Blue)
- **Accent:** #e67e22 (Orange)
- **Background:** #f8f9fa (Light Gray)
- **Text:** #2c3e50 (Dark) / #7f8c8d (Light)

### Typography
- **Font Family:** Poppins (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700

### Sections
1. **Home/Landing:** Introduction with call-to-action buttons
2. **About Me:** Personal bio and education details
3. **Skills:** Technical skills organized by category
4. **Projects:** Featured projects with descriptions and links
5. **Experience:** Professional work experience
6. **Contact:** Contact information and message form

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/KARTHIKEYAN-MUTHU-5U/guvi_intern.git
cd guvi_intern
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

### GitHub Pages Deployment

1. Push code to your GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Save and wait for deployment

## 📝 Customization Guide

### Updating Content

#### Personal Information
Edit the following sections in `index.html`:

```html
<!-- Update name and title -->
<h1 class="hero-title">Hi, I'm <span class="text-primary">Your Name</span></h1>
<h2 class="hero-subtitle">Your Title Here</h2>

<!-- Update contact information -->
<a href="mailto:your-email@gmail.com">your-email@gmail.com</a>
<a href="tel:+1234567890">+1234567890</a>
```

#### Projects
Update the projects section with your own projects:

```html
<div class="project-card">
    <div class="project-header">
        <h4 class="project-title">Your Project Name</h4>
        <div class="project-links">
            <a href="your-github-link" class="btn btn-sm btn-outline-primary">
                <i class="fab fa-github me-1"></i>GitHub
            </a>
        </div>
    </div>
    <p class="project-description">Your project description...</p>
    <div class="project-tech">
        <span class="badge bg-secondary">Technology 1</span>
        <span class="badge bg-secondary">Technology 2</span>
    </div>
</div>
```

#### Skills
Modify the skills section to reflect your expertise:

```html
<div class="skill-card">
    <div class="skill-icon text-center mb-3">
        <i class="fas fa-code fa-3x text-primary"></i>
    </div>
    <h4 class="text-center mb-3">Your Skill Category</h4>
    <ul class="list-unstyled text-center">
        <li class="mb-2"><span class="badge bg-primary">Skill 1</span></li>
        <li class="mb-2"><span class="badge bg-primary">Skill 2</span></li>
    </ul>
</div>
```

### Assets Replacement

#### Profile Picture
Replace `assets/images/profile-photo.jpg` with your professional headshot:
- Recommended size: 350x350px
- Format: JPG or PNG
- Keep the same filename or update the `src` attribute in HTML

#### Resume
Replace `assets/resume.pdf` with your actual resume:
- Format: PDF
- Keep the same filename or update the `href` attribute in HTML

#### Favicon
Add a favicon to the root directory:
```html
<!-- Add to <head> section -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
```

### Contact Form Setup

1. Create a Formspree account at [formspree.io](https://formspree.io)
2. Get your form endpoint
3. Update the form action in `index.html`:
```html
<form action="https://formspree.io/f/your-form-id" method="POST" id="contactForm">
```

4. Update the JavaScript in `assets/js/portfolio-script.js` to enable actual form submission

### Analytics (Optional)

Add Google Analytics:
```html
<!-- Add before closing </head> tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎯 SEO Optimization

The website includes:
- Meta descriptions and keywords
- Open Graph tags for social sharing
- Semantic HTML structure
- Alt text for images
- Structured data (can be added)

## ♿ Accessibility Features

- ARIA labels for navigation
- Keyboard navigation support
- Color contrast compliance (WCAG 2.1 AA)
- Screen reader friendly
- Reduced motion support
- High contrast mode support

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly navigation
- Optimized loading on slow connections
- Progressive Web App ready

## 🚀 Performance

- Optimized images
- Minified CSS and JavaScript
- Lazy loading for images
- Efficient animations
- Fast loading times

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio. If you find any bugs or have suggestions for improvements, please open an issue.

## 📞 Contact

**Karthikeyan M**
- Email: anjumuthu98@gmail.com
- Phone: +91 87785 05697
- GitHub: [KARTHIKEYAN-MUTHU-5U](https://github.com/KARTHIKEYAN-MUTHU-5U)
- LinkedIn: [karthikeyan-m](https://linkedin.com/in/karthikeyan-m)

---

**Building scalable software & data-driven solutions** 🚀