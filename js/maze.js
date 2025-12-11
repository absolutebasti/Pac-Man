// Maze layout for classic Pac-Man
// 28 tiles wide × 31 tiles tall
// Legend:
// 0 = empty (path)
// 1 = wall
// 2 = pellet
// 3 = power pellet
// 4 = ghost house door
// 5 = ghost house interior
// 6 = tunnel (slow zone for ghosts)

export const TILE_SIZE = 8;
export const MAZE_WIDTH = 28;
export const MAZE_HEIGHT = 31;

// Classic Pac-Man maze layout
export const mazeLayout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,5,5,5,5,5,5,1,0,1,1,2,1,1,1,1,1,1],
    [6,0,0,0,0,0,2,0,0,0,1,5,5,5,5,5,5,1,0,0,0,2,0,0,0,0,0,6],
    [1,1,1,1,1,1,2,1,1,0,1,5,5,5,5,5,5,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
    [0,0,0,0,0,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,0,0,0,0,0],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Tile type constants
export const TILE = {
    EMPTY: 0,
    WALL: 1,
    PELLET: 2,
    POWER_PELLET: 3,
    GHOST_DOOR: 4,
    GHOST_HOUSE: 5,
    TUNNEL: 6
};

// Colors
const WALL_COLOR = '#2121de';
const PELLET_COLOR = '#ffb897';
const POWER_PELLET_COLOR = '#ffb897';

export class Maze {
    constructor() {
        // Create a copy of the maze layout that can be modified
        this.tiles = mazeLayout.map(row => [...row]);
        this.pelletsRemaining = this.countPellets();
        this.totalPellets = this.pelletsRemaining;
        this.powerPelletBlink = false;
        this.blinkTimer = 0;
    }

    reset() {
        this.tiles = mazeLayout.map(row => [...row]);
        this.pelletsRemaining = this.countPellets();
    }

    countPellets() {
        let count = 0;
        for (let y = 0; y < MAZE_HEIGHT; y++) {
            for (let x = 0; x < MAZE_WIDTH; x++) {
                if (this.tiles[y][x] === TILE.PELLET || this.tiles[y][x] === TILE.POWER_PELLET) {
                    count++;
                }
            }
        }
        return count;
    }

    getTile(x, y) {
        // Handle tunnel wrapping
        if (x < 0) x = MAZE_WIDTH - 1;
        if (x >= MAZE_WIDTH) x = 0;
        if (y < 0 || y >= MAZE_HEIGHT) return TILE.WALL;
        return this.tiles[y][x];
    }

    setTile(x, y, value) {
        if (x >= 0 && x < MAZE_WIDTH && y >= 0 && y < MAZE_HEIGHT) {
            this.tiles[y][x] = value;
        }
    }

    isWall(x, y) {
        const tile = this.getTile(x, y);
        return tile === TILE.WALL;
    }

    canMove(x, y, isGhost = false) {
        const tile = this.getTile(x, y);
        if (tile === TILE.WALL) return false;
        if (tile === TILE.GHOST_DOOR && !isGhost) return false;
        return true;
    }

    eatPellet(x, y) {
        const tile = this.getTile(x, y);
        if (tile === TILE.PELLET) {
            this.setTile(x, y, TILE.EMPTY);
            this.pelletsRemaining--;
            return { type: 'pellet', points: 10 };
        } else if (tile === TILE.POWER_PELLET) {
            this.setTile(x, y, TILE.EMPTY);
            this.pelletsRemaining--;
            return { type: 'powerPellet', points: 50 };
        }
        return null;
    }

    isLevelComplete() {
        return this.pelletsRemaining === 0;
    }

    update(deltaTime) {
        // Blink power pellets
        this.blinkTimer += deltaTime;
        if (this.blinkTimer >= 200) {
            this.blinkTimer = 0;
            this.powerPelletBlink = !this.powerPelletBlink;
        }
    }

    render(ctx) {
        for (let y = 0; y < MAZE_HEIGHT; y++) {
            for (let x = 0; x < MAZE_WIDTH; x++) {
                const tile = this.tiles[y][x];
                const px = x * TILE_SIZE;
                const py = y * TILE_SIZE;

                switch (tile) {
                    case TILE.WALL:
                        this.drawWall(ctx, x, y, px, py);
                        break;
                    case TILE.PELLET:
                        this.drawPellet(ctx, px, py);
                        break;
                    case TILE.POWER_PELLET:
                        if (!this.powerPelletBlink) {
                            this.drawPowerPellet(ctx, px, py);
                        }
                        break;
                    case TILE.GHOST_DOOR:
                        this.drawGhostDoor(ctx, px, py);
                        break;
                }
            }
        }
    }

    drawWall(ctx, tileX, tileY, px, py) {
        ctx.fillStyle = WALL_COLOR;
        
        // Check neighboring tiles for connected walls
        const top = this.getTile(tileX, tileY - 1) === TILE.WALL;
        const bottom = this.getTile(tileX, tileY + 1) === TILE.WALL;
        const left = this.getTile(tileX - 1, tileY) === TILE.WALL;
        const right = this.getTile(tileX + 1, tileY) === TILE.WALL;
        
        // Draw wall with rounded corners based on neighbors
        const r = 2; // Corner radius
        
        ctx.beginPath();
        
        // Top-left corner
        if (top && left) {
            ctx.moveTo(px, py);
        } else {
            ctx.moveTo(px + r, py);
        }
        
        // Top-right corner
        if (top && right) {
            ctx.lineTo(px + TILE_SIZE, py);
        } else {
            ctx.lineTo(px + TILE_SIZE - r, py);
            ctx.quadraticCurveTo(px + TILE_SIZE, py, px + TILE_SIZE, py + r);
        }
        
        // Bottom-right corner
        if (bottom && right) {
            ctx.lineTo(px + TILE_SIZE, py + TILE_SIZE);
        } else {
            ctx.lineTo(px + TILE_SIZE, py + TILE_SIZE - r);
            ctx.quadraticCurveTo(px + TILE_SIZE, py + TILE_SIZE, px + TILE_SIZE - r, py + TILE_SIZE);
        }
        
        // Bottom-left corner
        if (bottom && left) {
            ctx.lineTo(px, py + TILE_SIZE);
        } else {
            ctx.lineTo(px + r, py + TILE_SIZE);
            ctx.quadraticCurveTo(px, py + TILE_SIZE, px, py + TILE_SIZE - r);
        }
        
        // Back to top-left
        if (top && left) {
            ctx.lineTo(px, py);
        } else {
            ctx.lineTo(px, py + r);
            ctx.quadraticCurveTo(px, py, px + r, py);
        }
        
        ctx.fill();
    }

    drawPellet(ctx, px, py) {
        ctx.fillStyle = PELLET_COLOR;
        ctx.beginPath();
        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 1, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPowerPellet(ctx, px, py) {
        ctx.fillStyle = POWER_PELLET_COLOR;
        ctx.beginPath();
        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawGhostDoor(ctx, px, py) {
        ctx.fillStyle = '#ffb8ff';
        ctx.fillRect(px, py + 3, TILE_SIZE, 2);
    }
}
