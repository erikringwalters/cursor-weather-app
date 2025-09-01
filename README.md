# Weather App

A beautiful, responsive weather application built with Angular 20 that provides real-time weather information for cities around the world.

## Features

- 🌍 Search for cities, countries, or locations worldwide
- 🌤️ Real-time weather data with beautiful UI
- 📱 Fully responsive design for all devices
- ⚡ Fast and efficient search with suggestions
- 🎨 Modern, glassmorphism design with smooth animations

## Technologies Used

- **Angular 20** - Modern web framework
- **SCSS** - Advanced CSS preprocessing
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe JavaScript
- **GitHub Pages** - Free hosting

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm 9+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Deployment to GitHub Pages

This app is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Steps:

1. **Push your code to GitHub** (if you haven't already)
2. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)
   - Folder: `/ (root)`
3. **Enable GitHub Actions** (should be enabled by default)
4. **Push to main branch** - the workflow will automatically:
   - Build your Angular app
   - Deploy it to GitHub Pages
   - Make it available at `https://yourusername.github.io/weather-app/`

### Manual Build (if needed):

```bash
npm run build:gh-pages
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── search-bar/          # Search functionality
│   │   ├── weather-card/        # Weather display cards
│   │   └── weather-dashboard/   # Main dashboard
│   ├── models/                  # TypeScript interfaces
│   └── services/                # Weather API service
├── styles.scss                  # Global styles
└── main.ts                     # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Live Demo

🌐 **Live Demo**: [https://yourusername.github.io/weather-app/](https://yourusername.github.io/weather-app/)

---

Built with ❤️ using Angular 20
