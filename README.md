# 🕹️ PAC-MAN Clone

A faithful recreation of the classic 1980 arcade game, built entirely with **vanilla HTML, CSS, and JavaScript**. No frameworks, no dependencies—just pure web technologies.

![Pac-Man](https://img.shields.io/badge/Pac--Man-Clone-yellow?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🎮 Authentic Gameplay
- **Classic 28x31 maze** with original layout
- **4 unique ghosts** with distinct AI personalities:
  - 🔴 **Blinky** - Aggressive chaser, targets Pac-Man directly
  - 🩷 **Pinky** - Ambusher, targets 4 tiles ahead of Pac-Man
  - 🩵 **Inky** - Unpredictable, uses complex targeting
  - 🟠 **Clyde** - Shy ghost, retreats when close
- **Ghost modes**: Chase, Scatter, and Frightened
- **Power pellets** that turn ghosts blue and vulnerable
- **Tunnel wrapping** on both sides of the maze

### 🎨 Visual Effects
- **CRT scanlines overlay** for authentic retro arcade feel
- **Floating score popups** (+10, +50, +200)
- **Screen shake** on ghost collision
- **Power pellet flash** effect
- **Animated particle background**
- **Neon glow effects** throughout

### 🔊 Synthesized Audio
- **Waka-waka** eating sound
- **Power pellet** activation
- **Ghost siren** background
- **Ghost eaten** sound effect
- **Death** sound
- All audio generated via Web Audio API—no external files needed!

### 📱 Responsive Design
- Scales beautifully on any screen size
- Pixel-perfect rendering at 2x scale on larger displays

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/pacman.git
   cd pacman
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python3 -m http.server 8080
   
   # Or using Node.js
   npx serve
   ```

3. **Open in browser**
   ```
   http://localhost:8080
   ```

4. **Press SPACE to start!**

## 🎯 Controls

| Key | Action |
|-----|--------|
| ⬆️ Arrow Up | Move Up |
| ⬇️ Arrow Down | Move Down |
| ⬅️ Arrow Left | Move Left |
| ➡️ Arrow Right | Move Right |
| Space | Start / Restart Game |

## 📁 Project Structure

```
pacman/
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── js/
│   ├── game.js         # Main game loop and state management
│   ├── maze.js         # Maze layout and rendering
│   ├── pacman.js       # Pac-Man movement and animation
│   ├── ghost.js        # Ghost AI and behaviors
│   ├── collision.js    # Collision detection
│   └── audio.js        # Web Audio API sound synthesis
└── assets/
    └── sounds/         # (Empty - all audio is synthesized)
```

## 🏆 Scoring

| Action | Points |
|--------|--------|
| Eat Pellet | 10 |
| Eat Power Pellet | 50 |
| Eat Frightened Ghost | 200 |

## 🛠️ Technical Highlights

- **Zero dependencies** - Pure vanilla JavaScript
- **Modular architecture** - Clean separation of concerns with ES6 modules
- **Canvas rendering** - Smooth 60fps gameplay
- **Tile-based collision** - Accurate movement and wall detection
- **State machine** - Clean game state management (START, READY, PLAYING, DYING, GAME_OVER)
- **Local storage** - High score persistence

## 🎨 Customization

### Change Colors
Edit the ghost colors in `js/ghost.js`:
```javascript
const colors = {
    blinky: '#ff0000',  // Red
    pinky: '#ffb8ff',   // Pink
    inky: '#00ffff',    // Cyan
    clyde: '#ffb852'    // Orange
};
```

### Adjust Difficulty
Modify speed values in `js/pacman.js` and `js/ghost.js`:
```javascript
this.baseSpeed = 0.08;  // Increase for faster gameplay
```

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Original Pac-Man by **Namco** (1980)
- Game design by **Toru Iwatani**
- Inspired by the golden age of arcade gaming

---

<div align="center">
  <strong>Made with ❤️ and vanilla JavaScript</strong>
  <br>
  <sub>No ghosts were harmed in the making of this game 👻</sub>
</div>
