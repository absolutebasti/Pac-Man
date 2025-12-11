import { TILE_SIZE, MAZE_WIDTH, MAZE_HEIGHT, TILE } from './maze.js';

// Ghost behavior modes
export const GHOST_MODE = {
    CHASE: 'chase',
    SCATTER: 'scatter',
    FRIGHTENED: 'frightened',
    EATEN: 'eaten'
};

// Ghost names
export const GHOST_NAME = {
    BLINKY: 'blinky',
    PINKY: 'pinky',
    INKY: 'inky',
    CLYDE: 'clyde'
};

export class Ghost {
    constructor(name, color, maze, pacman) {
        this.name = name;
        this.color = color;
        this.maze = maze;
        this.pacman = pacman;
        this.reset();

        // Movement
        this.baseSpeed = 0.075; // tiles per millisecond
        this.currentDirection = 'left';
        this.nextDirection = null;

        // AI
        this.mode = GHOST_MODE.SCATTER;
        this.modeTimer = 0;
        this.frightenedTimer = 0;
        this.frightenedDuration = 6000; // 6 seconds

        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 200; // ms per frame

        // Scatter targets (corners of maze)
        this.scatterTargets = {
            [GHOST_NAME.BLINKY]: { x: 25, y: 0 },   // Top right
            [GHOST_NAME.PINKY]: { x: 2, y: 0 },     // Top left
            [GHOST_NAME.INKY]: { x: 27, y: 30 },    // Bottom right
            [GHOST_NAME.CLYDE]: { x: 0, y: 30 }     // Bottom left
        };
    }

    reset() {
        // Start in ghost house - positions are tile coordinates
        const startPositions = {
            [GHOST_NAME.BLINKY]: { x: 14, y: 11 },  // Above ghost house
            [GHOST_NAME.PINKY]: { x: 14, y: 14 },   // Center of ghost house
            [GHOST_NAME.INKY]: { x: 12, y: 14 },    // Left in ghost house
            [GHOST_NAME.CLYDE]: { x: 16, y: 14 }    // Right in ghost house
        };

        const pos = startPositions[this.name];
        this.tileX = pos.x;
        this.tileY = pos.y;
        // Position at CENTER of the tile
        this.x = (this.tileX + 0.5) * TILE_SIZE;
        this.y = (this.tileY + 0.5) * TILE_SIZE;
        this.currentDirection = 'left';
        this.mode = GHOST_MODE.SCATTER;
        this.frightenedTimer = 0;
    }

    setMode(mode) {
        if (mode === GHOST_MODE.FRIGHTENED) {
            this.frightenedTimer = this.frightenedDuration;
            this.reverseDirection();
        }
        this.mode = mode;
    }

    reverseDirection() {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };
        this.currentDirection = opposites[this.currentDirection];
    }

    update(deltaTime) {
        // Update frightened timer
        if (this.mode === GHOST_MODE.FRIGHTENED) {
            this.frightenedTimer -= deltaTime;
            if (this.frightenedTimer <= 0) {
                this.mode = GHOST_MODE.CHASE;
            }
        }

        // Update animation
        this.animationTimer += deltaTime;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 2;
        }

        // Move
        const speed = this.mode === GHOST_MODE.FRIGHTENED ?
            this.baseSpeed * 0.5 : this.baseSpeed;

        let newX = this.x;
        let newY = this.y;

        switch (this.currentDirection) {
            case 'left':
                newX -= speed * deltaTime;
                break;
            case 'right':
                newX += speed * deltaTime;
                break;
            case 'up':
                newY -= speed * deltaTime;
                break;
            case 'down':
                newY += speed * deltaTime;
                break;
        }

        // Check if we can move
        const newTileX = Math.round(newX / TILE_SIZE);
        const newTileY = Math.round(newY / TILE_SIZE);

        if (this.maze.canMove(newTileX, newTileY, true)) {
            this.x = newX;
            this.y = newY;
        }

        // Update tile position (subtract 0.5 because position is center of tile)
        this.tileX = this.x / TILE_SIZE - 0.5;
        this.tileY = this.y / TILE_SIZE - 0.5;

        // Handle tunnel wrapping
        this.handleTunnel();

        // AI decision making at intersections
        if (this.isAtIntersection()) {
            this.makeDecision();
        }
    }

    handleTunnel() {
        const mazePixelWidth = MAZE_WIDTH * TILE_SIZE;
        if (this.x < -TILE_SIZE) {
            this.x = mazePixelWidth;
        } else if (this.x > mazePixelWidth) {
            this.x = -TILE_SIZE;
        }
    }

    isAtIntersection() {
        // Check if ghost is centered on a tile
        // tileX/Y are the actual tile indices, so check if we're close to an integer
        const fracX = Math.abs(this.tileX - Math.round(this.tileX));
        const fracY = Math.abs(this.tileY - Math.round(this.tileY));
        return fracX < 0.1 && fracY < 0.1;
    }

    makeDecision() {
        const target = this.getTargetTile();
        const possibleDirections = this.getPossibleDirections();

        if (possibleDirections.length === 0) return;

        // Choose direction that minimizes distance to target
        let bestDirection = possibleDirections[0];
        let bestDistance = Infinity;

        for (const dir of possibleDirections) {
            const testPos = this.getPositionInDirection(dir);
            const distance = this.getDistance(testPos, target);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestDirection = dir;
            }
        }

        this.currentDirection = bestDirection;
    }

    getPossibleDirections() {
        const directions = ['up', 'down', 'left', 'right'];
        const opposite = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        const possible = [];
        const currentTileX = Math.round(this.tileX);
        const currentTileY = Math.round(this.tileY);

        for (const dir of directions) {
            // Don't reverse direction unless necessary
            if (dir === opposite[this.currentDirection]) continue;

            const testPos = this.getPositionInDirection(dir);
            if (this.maze.canMove(testPos.x, testPos.y, true)) {
                possible.push(dir);
            }
        }

        // If no valid moves, allow reversing
        if (possible.length === 0) {
            const reverseDir = opposite[this.currentDirection];
            const testPos = this.getPositionInDirection(reverseDir);
            if (this.maze.canMove(testPos.x, testPos.y, true)) {
                possible.push(reverseDir);
            }
        }

        return possible;
    }

    getPositionInDirection(direction) {
        const currentTileX = Math.round(this.tileX);
        const currentTileY = Math.round(this.tileY);

        switch (direction) {
            case 'up': return { x: currentTileX, y: currentTileY - 1 };
            case 'down': return { x: currentTileX, y: currentTileY + 1 };
            case 'left': return { x: currentTileX - 1, y: currentTileY };
            case 'right': return { x: currentTileX + 1, y: currentTileY };
        }
    }

    getTargetTile() {
        if (this.mode === GHOST_MODE.FRIGHTENED) {
            // Random movement when frightened
            return {
                x: Math.floor(Math.random() * MAZE_WIDTH),
                y: Math.floor(Math.random() * MAZE_HEIGHT)
            };
        }

        if (this.mode === GHOST_MODE.SCATTER) {
            return this.scatterTargets[this.name];
        }

        // Chase mode - each ghost has unique targeting
        const pacPos = this.pacman.getTilePosition();

        switch (this.name) {
            case GHOST_NAME.BLINKY:
                // Directly target Pac-Man
                return pacPos;

            case GHOST_NAME.PINKY:
                // Target 4 tiles ahead of Pac-Man
                const offset = 4;
                switch (this.pacman.currentDirection) {
                    case 'up': return { x: pacPos.x, y: pacPos.y - offset };
                    case 'down': return { x: pacPos.x, y: pacPos.y + offset };
                    case 'left': return { x: pacPos.x - offset, y: pacPos.y };
                    case 'right': return { x: pacPos.x + offset, y: pacPos.y };
                    default: return pacPos;
                }

            case GHOST_NAME.INKY:
                // Complex targeting using Blinky's position
                // (This is a simplified version)
                return {
                    x: pacPos.x * 2 - Math.round(this.tileX),
                    y: pacPos.y * 2 - Math.round(this.tileY)
                };

            case GHOST_NAME.CLYDE:
                // Target Pac-Man when far, scatter when close
                const distance = this.getDistance(
                    { x: Math.round(this.tileX), y: Math.round(this.tileY) },
                    pacPos
                );
                return distance > 8 ? pacPos : this.scatterTargets[this.name];

            default:
                return pacPos;
        }
    }

    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    getTilePosition() {
        return {
            x: Math.round(this.tileX),
            y: Math.round(this.tileY)
        };
    }

    getPixelPosition() {
        return { x: this.x, y: this.y };
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.mode === GHOST_MODE.FRIGHTENED) {
            this.renderFrightened(ctx);
        } else {
            this.renderNormal(ctx);
        }

        ctx.restore();
    }

    renderNormal(ctx) {
        const size = TILE_SIZE / 2 - 1;

        // Body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, -size / 2, size, Math.PI, 0, false);
        ctx.lineTo(size, size);

        // Wavy bottom
        const waveWidth = size * 2 / 3;
        if (this.animationFrame === 0) {
            ctx.lineTo(size * 2 / 3, size - 2);
            ctx.lineTo(size / 3, size);
            ctx.lineTo(0, size - 2);
            ctx.lineTo(-size / 3, size);
            ctx.lineTo(-size * 2 / 3, size - 2);
        } else {
            ctx.lineTo(size * 2 / 3, size);
            ctx.lineTo(size / 3, size - 2);
            ctx.lineTo(0, size);
            ctx.lineTo(-size / 3, size - 2);
            ctx.lineTo(-size * 2 / 3, size);
        }

        ctx.lineTo(-size, size);
        ctx.closePath();
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-2, -1, 2, 0, Math.PI * 2);
        ctx.arc(2, -1, 2, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#000';
        let pupilX = 0;
        let pupilY = 0;
        switch (this.currentDirection) {
            case 'left': pupilX = -1; break;
            case 'right': pupilX = 1; break;
            case 'up': pupilY = -1; break;
            case 'down': pupilY = 1; break;
        }
        ctx.beginPath();
        ctx.arc(-2 + pupilX, -1 + pupilY, 1, 0, Math.PI * 2);
        ctx.arc(2 + pupilX, -1 + pupilY, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    renderFrightened(ctx) {
        const size = TILE_SIZE / 2 - 1;

        // Flash between blue and white when timer is low
        const flashTime = 2000;
        const isFlashing = this.frightenedTimer < flashTime;
        const flashOn = isFlashing && Math.floor(this.frightenedTimer / 200) % 2 === 0;

        ctx.fillStyle = flashOn ? '#fff' : '#2121de';

        // Body
        ctx.beginPath();
        ctx.arc(0, -size / 2, size, Math.PI, 0, false);
        ctx.lineTo(size, size);

        // Wavy bottom
        if (this.animationFrame === 0) {
            ctx.lineTo(size * 2 / 3, size - 2);
            ctx.lineTo(size / 3, size);
            ctx.lineTo(0, size - 2);
            ctx.lineTo(-size / 3, size);
            ctx.lineTo(-size * 2 / 3, size - 2);
        } else {
            ctx.lineTo(size * 2 / 3, size);
            ctx.lineTo(size / 3, size - 2);
            ctx.lineTo(0, size);
            ctx.lineTo(-size / 3, size - 2);
            ctx.lineTo(-size * 2 / 3, size);
        }

        ctx.lineTo(-size, size);
        ctx.closePath();
        ctx.fill();

        // Frightened face
        ctx.fillStyle = flashOn ? '#2121de' : '#fff';
        ctx.beginPath();
        ctx.arc(-2, -1, 1, 0, Math.PI * 2);
        ctx.arc(2, -1, 1, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.strokeStyle = flashOn ? '#2121de' : '#fff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-3, 2);
        ctx.lineTo(-2, 1);
        ctx.lineTo(-1, 2);
        ctx.lineTo(0, 1);
        ctx.lineTo(1, 2);
        ctx.lineTo(2, 1);
        ctx.lineTo(3, 2);
        ctx.stroke();
    }
}
