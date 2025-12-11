import { Maze, TILE_SIZE } from './maze.js';
import { Pacman } from './pacman.js';
import { Ghost, GHOST_NAME, GHOST_MODE } from './ghost.js';
import { CollisionDetector } from './collision.js';
import { AudioManager } from './audio.js';

// Game states
const GAME_STATE = {
    START: 'start',
    READY: 'ready',
    PLAYING: 'playing',
    PAUSED: 'paused',
    DYING: 'dying',
    GAME_OVER: 'gameOver',
    LEVEL_COMPLETE: 'levelComplete'
};

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Game objects
        this.maze = new Maze();
        this.pacman = new Pacman(this.maze);
        this.ghosts = [];
        this.collision = new CollisionDetector();
        this.audio = new AudioManager();

        // Create ghosts
        this.ghosts.push(new Ghost(GHOST_NAME.BLINKY, '#ff0000', this.maze, this.pacman));
        this.ghosts.push(new Ghost(GHOST_NAME.PINKY, '#ffb8ff', this.maze, this.pacman));
        this.ghosts.push(new Ghost(GHOST_NAME.INKY, '#00ffff', this.maze, this.pacman));
        this.ghosts.push(new Ghost(GHOST_NAME.CLYDE, '#ffb852', this.maze, this.pacman));

        // Game state
        this.state = GAME_STATE.START;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('pacmanHighScore')) || 0;
        this.lives = 3;
        this.level = 1;

        // Timers
        this.lastTime = 0;
        this.deathTimer = 0;
        this.deathDuration = 2000;
        this.readyTimer = 0;
        this.readyDuration = 2000;
        this.ghostModeTimer = 0;
        this.ghostModeIndex = 0;
        this.ghostModeDurations = [
            { mode: GHOST_MODE.SCATTER, duration: 7000 },
            { mode: GHOST_MODE.CHASE, duration: 20000 },
            { mode: GHOST_MODE.SCATTER, duration: 7000 },
            { mode: GHOST_MODE.CHASE, duration: 20000 },
            { mode: GHOST_MODE.SCATTER, duration: 5000 },
            { mode: GHOST_MODE.CHASE, duration: 20000 },
            { mode: GHOST_MODE.SCATTER, duration: 5000 },
            { mode: GHOST_MODE.CHASE, duration: Infinity }
        ];

        // Pellet eating sound timer
        this.pelletSoundTimer = 0;
        this.pelletSoundInterval = 150;

        // UI elements
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.readyScreen = document.getElementById('ready-screen');
        this.finalScoreElement = document.getElementById('final-score');

        // Visual effects elements
        this.shakeWrapper = document.getElementById('shake-wrapper');
        this.scorePopupsContainer = document.getElementById('score-popups');
        this.powerFlash = document.getElementById('power-flash');

        // Input handling
        this.keys = {};
        this.setupInput();

        // Update UI
        this.updateUI();

        // Start game loop - initialize lastTime to prevent huge first delta
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Handle game state changes
            if (e.key === ' ') {
                e.preventDefault();
                if (this.state === GAME_STATE.START) {
                    this.startGame();
                } else if (this.state === GAME_STATE.GAME_OVER) {
                    this.resetGame();
                } else if (this.state === GAME_STATE.PLAYING) {
                    this.pauseGame();
                } else if (this.state === GAME_STATE.PAUSED) {
                    this.resumeGame();
                }
            }

            // Handle Pac-Man movement
            if (this.state === GAME_STATE.PLAYING) {
                if (e.key === 'ArrowLeft') {
                    this.pacman.setDirection('left');
                } else if (e.key === 'ArrowRight') {
                    this.pacman.setDirection('right');
                } else if (e.key === 'ArrowUp') {
                    this.pacman.setDirection('up');
                } else if (e.key === 'ArrowDown') {
                    this.pacman.setDirection('down');
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    startGame() {
        this.audio.init();
        this.state = GAME_STATE.READY;
        this.readyTimer = this.readyDuration;
        this.startScreen.classList.add('hidden');
        this.readyScreen.classList.remove('hidden');
    }

    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.maze.reset();
        this.pacman.reset();
        this.ghosts.forEach(ghost => ghost.reset());
        this.ghostModeIndex = 0;
        this.ghostModeTimer = 0;
        this.updateUI();
        this.startGame();
        this.gameOverScreen.classList.add('hidden');
    }

    pauseGame() {
        if (this.state === GAME_STATE.PLAYING) {
            this.state = GAME_STATE.PAUSED;
        }
    }

    resumeGame() {
        if (this.state === GAME_STATE.PAUSED) {
            this.state = GAME_STATE.PLAYING;
        }
    }

    nextLevel() {
        this.level++;
        this.maze.reset();
        this.pacman.reset();
        this.ghosts.forEach(ghost => ghost.reset());
        this.ghostModeIndex = 0;
        this.ghostModeTimer = 0;
        this.state = GAME_STATE.READY;
        this.readyTimer = this.readyDuration;
        this.readyScreen.classList.remove('hidden');
        this.updateUI();
    }

    loseLife() {
        this.lives--;
        this.updateUI();

        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.state = GAME_STATE.DYING;
            this.deathTimer = this.deathDuration;
            this.audio.playDeath();
        }
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        this.finalScoreElement.textContent = this.score;
        this.gameOverScreen.classList.remove('hidden');

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pacmanHighScore', this.highScore);
            this.updateUI();
        }
    }

    addScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.updateUI();
    }

    updateUI() {
        this.scoreElement.textContent = String(this.score).padStart(2, '0');
        this.highScoreElement.textContent = String(this.highScore).padStart(2, '0');

        // Update lives display
        this.livesElement.innerHTML = '';
        for (let i = 0; i < this.lives; i++) {
            const lifeIcon = document.createElement('div');
            lifeIcon.className = 'life-icon';
            this.livesElement.appendChild(lifeIcon);
        }
    }

    // ====== VISUAL EFFECTS ======

    triggerScreenShake() {
        if (!this.shakeWrapper) return;
        this.shakeWrapper.classList.remove('shake');
        // Force reflow to restart animation
        void this.shakeWrapper.offsetWidth;
        this.shakeWrapper.classList.add('shake');

        // Remove class after animation
        setTimeout(() => {
            this.shakeWrapper.classList.remove('shake');
        }, 500);
    }

    showScorePopup(x, y, points, type = 'pellet') {
        if (!this.scorePopupsContainer) return;

        const popup = document.createElement('div');
        popup.className = `score-popup ${type}`;
        popup.textContent = `+${points}`;

        // Position relative to canvas (accounting for scaling)
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;

        this.scorePopupsContainer.appendChild(popup);

        // Remove after animation
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    triggerPowerFlash() {
        if (!this.powerFlash) return;
        this.powerFlash.classList.remove('active');
        void this.powerFlash.offsetWidth;
        this.powerFlash.classList.add('active');

        setTimeout(() => {
            this.powerFlash.classList.remove('active');
        }, 300);
    }

    updateGhostModes(deltaTime) {
        this.ghostModeTimer += deltaTime;

        const currentMode = this.ghostModeDurations[this.ghostModeIndex];
        if (this.ghostModeTimer >= currentMode.duration) {
            this.ghostModeTimer = 0;
            this.ghostModeIndex++;

            if (this.ghostModeIndex >= this.ghostModeDurations.length) {
                this.ghostModeIndex = this.ghostModeDurations.length - 1;
            }

            const newMode = this.ghostModeDurations[this.ghostModeIndex];
            this.ghosts.forEach(ghost => {
                if (ghost.mode !== GHOST_MODE.FRIGHTENED) {
                    ghost.setMode(newMode.mode);
                }
            });
        }
    }

    update(deltaTime) {
        if (this.state === GAME_STATE.READY) {
            this.readyTimer -= deltaTime;
            if (this.readyTimer <= 0) {
                this.state = GAME_STATE.PLAYING;
                this.readyScreen.classList.add('hidden');
            }
            return;
        }

        if (this.state === GAME_STATE.DYING) {
            this.deathTimer -= deltaTime;
            if (this.deathTimer <= 0) {
                this.pacman.reset();
                this.ghosts.forEach(ghost => ghost.reset());
                this.ghostModeIndex = 0;
                this.ghostModeTimer = 0;
                this.state = GAME_STATE.READY;
                this.readyTimer = this.readyDuration;
                this.readyScreen.classList.remove('hidden');
            }
            return;
        }

        if (this.state !== GAME_STATE.PLAYING) {
            return;
        }

        // Update maze (for power pellet blinking)
        this.maze.update(deltaTime);

        // Update Pac-Man
        this.pacman.update(deltaTime);

        // Check pellet collision
        const pellet = this.collision.checkPelletCollision(this.pacman, this.maze);
        if (pellet) {
            this.addScore(pellet.points);

            // Get Pac-Man position for popup
            const pacPos = this.pacman.getPixelPosition();

            if (pellet.type === 'pellet') {
                // Show score popup occasionally (not every pellet to avoid spam)
                if (Math.random() < 0.3) {
                    this.showScorePopup(pacPos.x, pacPos.y, pellet.points, 'pellet');
                }
                this.pelletSoundTimer += deltaTime;
                if (this.pelletSoundTimer >= this.pelletSoundInterval) {
                    this.audio.playWaka();
                    this.pelletSoundTimer = 0;
                }
            } else if (pellet.type === 'powerPellet') {
                this.audio.playPowerPellet();
                this.ghosts.forEach(ghost => ghost.setMode(GHOST_MODE.FRIGHTENED));
                // Trigger power flash and show popup
                this.triggerPowerFlash();
                this.showScorePopup(pacPos.x, pacPos.y, pellet.points, 'power');
            }
        }

        // Check level complete
        if (this.maze.isLevelComplete()) {
            this.nextLevel();
            return;
        }

        // Update ghost modes
        this.updateGhostModes(deltaTime);

        // Update ghosts
        this.ghosts.forEach(ghost => ghost.update(deltaTime));

        // Check ghost collisions
        const ghostCollisions = this.collision.checkAllGhostCollisions(this.pacman, this.ghosts);
        for (const ghost of ghostCollisions) {
            if (ghost.mode === GHOST_MODE.FRIGHTENED) {
                // Eat ghost - show score popup and effects
                const ghostPos = ghost.getPixelPosition();
                this.addScore(200);
                this.showScorePopup(ghostPos.x, ghostPos.y, 200, 'ghost');
                this.audio.playEatGhost();
                ghost.reset();
            } else {
                // Pac-Man dies - trigger screen shake
                this.triggerScreenShake();
                this.loseLife();
                break;
            }
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render maze
        this.maze.render(this.ctx);

        // Render ghosts
        this.ghosts.forEach(ghost => ghost.render(this.ctx));

        // Render Pac-Man
        if (this.state === GAME_STATE.DYING) {
            const progress = 1 - (this.deathTimer / this.deathDuration);
            this.pacman.renderDeath(this.ctx, progress);
        } else {
            this.pacman.render(this.ctx);
        }
    }

    gameLoop(currentTime) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
