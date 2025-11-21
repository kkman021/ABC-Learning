# 🎨 ABC Learning Game

Interactive alphabet learning application designed for children to learn English letters A-Z through engaging visual images, word associations, voice pronunciation, and fun mini-games.

🔗 **Live Demo**: [https://kkman021.github.io/ABC-Learning/](https://kkman021.github.io/ABC-Learning/)

## ✨ Features

### 📚 Learning Mode
- **26 Alphabet Cards**: Beautiful, colorful cards for each letter A-Z
- **Visual Learning**: Each letter paired with an associated image and word (e.g., A for Apple)
- **Voice Pronunciation**: Web Speech API integration for audio pronunciation of words
- **Interactive Design**: Tap-to-speak functionality for repetitive learning

### 🎮 Game Mode
- **"Find It Out" Mini-Game**: Quiz-style game to test letter recognition
- **4-Choice Questions**: Select the correct image from 4 options
- **Audio Feedback**: Success and error sounds using Web Audio API
- **Victory Celebration**: Confetti animation on correct answers
- **Auto-Navigation**: Automatic return to grid view after successful completion

### 🎨 User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Smooth Animations**: Pop-in, slide-down, and fade transitions
- **Color-Coded Cards**: Each letter has a unique vibrant color
- **Touch-Friendly**: Large buttons and interactive areas for kids

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) with Composition API
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Scoped CSS with CSS Variables
- **Animation**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Speech API & Web Audio API
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/kkman021/ABC-Learning.git

# Navigate to project directory
cd ABC-Learning

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Development Commands

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
ABC-Learning/
├── src/
│   ├── assets/
│   │   └── images/        # All 26 alphabet images (A-Z)
│   ├── components/
│   │   ├── App.vue        # Root component
│   │   ├── LetterGrid.vue # Grid view of all letters
│   │   ├── LetterCard.vue # Individual letter card
│   │   └── DetailView.vue # Detail view with game mode
│   ├── data/
│   │   └── alphabet.js    # Alphabet data structure
│   ├── main.js
│   └── style.css          # Global styles & CSS variables
├── public/
├── index.html
├── vite.config.js
├── package.json
└── CLAUDE.md              # Development documentation
```

## 🎯 Component Architecture

```
App.vue (root)
├── LetterGrid.vue - Grid view of all 26 letters
│   └── LetterCard.vue - Individual letter card (clickable)
└── DetailView.vue - Detail view with normal & game modes
```

### State Management
- Uses Vue 3 Composition API (`ref`/`computed`)
- No external state management library (Vuex/Pinia)
- Parent-child communication via props and events

## 🌐 Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions.

**Deployment Workflow**:
1. Push to `master` branch
2. GitHub Actions triggers build process
3. Build output (`dist/`) is deployed to `gh-pages` branch
4. Site becomes available at: https://kkman021.github.io/ABC-Learning/

**Manual Deployment**:
```bash
# Build the project
npm run build

# The dist/ folder is ready for deployment
```

## 🎨 Customization

### Adding New Images
1. Add image to `src/assets/images/`
2. Update `src/data/alphabet.js`:
   ```javascript
   import newImg from '../assets/images/newImage.png';
   // Update the corresponding letter object
   ```

### Changing Colors
Edit the color values in `src/data/alphabet.js`:
```javascript
{ letter: 'A', word: 'Apple', image: appleImg, color: '#FF6B6B' }
```

### Modifying Speech Settings
Edit voice parameters in `DetailView.vue`:
```javascript
utterance.rate = 0.8;  // Speech speed
utterance.pitch = 1.2; // Voice pitch
```

## 🧩 Key Features Implementation

### Web Speech API
- Automatic pronunciation when entering detail view
- Click-to-repeat functionality
- Optimized rate and pitch for children's learning

### Web Audio API
- Dynamic sound generation (no audio files needed)
- Success: Multi-tone victory fanfare (C-E-G-C chord progression)
- Error: Descending sawtooth buzz sound

### Game Logic
- Randomized 4-option quiz generation
- Prevents duplicate letters in options
- Auto-reset after success with 2.5s delay

## 📱 Browser Compatibility

- Modern browsers with ES6+ support
- Web Speech API support (Chrome, Edge, Safari)
- Web Audio API support (all modern browsers)
- Tested on mobile devices (iOS Safari, Chrome Android)

## 📄 License

MIT License - feel free to use this project for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Project Link: [https://github.com/kkman021/ABC-Learning](https://github.com/kkman021/ABC-Learning)

---

Made with ❤️ for children's education
