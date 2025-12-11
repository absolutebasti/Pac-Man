import { TILE_SIZE, MAZE_WIDTH, TILE } from './maze.js';

export class Pacman {
    constructor(maze) {
        this.maze = maze;
        this.reset();

        // Animation
        this.mouthAngle = 0;
        this.mouthSpeed = 0.3;
        this.mouthDirection = 1;
        this.maxMouthAngle = 0.4; // in radians (about 23 degrees)

        // Movement
        this.baseSpeed = 0.08; // tiles per millisecond at 100%
        this.speedMultiplier = 0.8; // 80% of max speed normally
        this.currentDirection = null;
        this.nextDirection = null;
        this.corneringBuffer = 4; // pixels of tolerance for cornering
    }

    reset() {
        // Start position (center of starting tile)
        // Pac-Man starts at tile (14, 23) in classic Pac-Man
        // Adding 0.5 centers Pac-Man in the middle of the tile
        this.tileX = 14;
        this.tileY = 23;
        // Position at CENTER of the tile (add half tile to get center)
        this.x = (this.tileX + 0.5) * TILE_SIZE;
        this.y = (this.tileY + 0.5) * TILE_SIZE;
        this.currentDirection = null;
        this.nextDirection = null;
    }

    setDirection(direction) {
        // Buffer the next direction for smooth cornering
        this.nextDirection = direction;
    }

    update(deltaTime) {
        // Try to change to buffered direction
        if (this.nextDirection) {
            if (this.canChangeDirection(this.nextDirection)) {
                this.currentDirection = this.nextDirection;
                this.nextDirection = null;
                this.alignToGrid();
            }
        }

        // Move in current direction
        if (this.currentDirection) {
            const speed = this.baseSpeed * this.speedMultiplier * deltaTime;
            let newX = this.x;
            let newY = this.y;

            switch (this.currentDirection) {
                case 'left':
                    newX -= speed;
                    break;
                case 'right':
                    newX += speed;
                    break;
                case 'up':
                    newY -= speed;
                    break;
                case 'down':
                    newY += speed;
                    break;
            }

            // Check for wall collision
            if (this.canMoveTo(newX, newY)) {
                this.x = newX;
                this.y = newY;
            } else {
                // Stop at the wall edge, aligned to grid
                this.alignToWall();
            }

            // Handle tunnel wrapping
            this.handleTunnel();
        }

        // Update tile position (subtract 0.5 because position is center of tile)
        this.tileX = this.x / TILE_SIZE - 0.5;
        this.tileY = this.y / TILE_SIZE - 0.5;

        // Animate mouth
        this.updateMouthAnimation(deltaTime);
    }

    canChangeDirection(direction) {
        // Check if Pac-Man can turn in the given direction
        // Get current tile (floor because tileX/Y already reflects the tile we're on)
        const currentTileX = Math.floor(this.tileX + 0.5);
        const currentTileY = Math.floor(this.tileY + 0.5);

        // Get the tile in the desired direction
        let targetTileX = currentTileX;
        let targetTileY = currentTileY;

        switch (direction) {
            case 'left':
                targetTileX = currentTileX - 1;
                break;
            case 'right':
                targetTileX = currentTileX + 1;
                break;
            case 'up':
                targetTileY = currentTileY - 1;
                break;
            case 'down':
                targetTileY = currentTileY + 1;
                break;
        }

        return this.maze.canMove(targetTileX, targetTileY, false);
    }

    canMoveTo(newX, newY) {
        // Calculate the bounding box corners
        const halfSize = TILE_SIZE / 2 - 1;

        // Check all four corners of Pac-Man's hitbox
        const corners = [
            { x: newX - halfSize, y: newY - halfSize },
            { x: newX + halfSize, y: newY - halfSize },
            { x: newX - halfSize, y: newY + halfSize },
            { x: newX + halfSize, y: newY + halfSize }
        ];

        for (const corner of corners) {
            const tileX = Math.floor(corner.x / TILE_SIZE);
            const tileY = Math.floor(corner.y / TILE_SIZE);
            if (!this.maze.canMove(tileX, tileY, false)) {
                return false;
            }
        }

        return true;
    }

    alignToGrid() {
        // Align to the center of the current tile when changing direction
        // First get which tile we're on, then center on it
        if (this.currentDirection === 'up' || this.currentDirection === 'down') {
            const tileX = Math.floor(this.x / TILE_SIZE);
            this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
        } else {
            const tileY = Math.floor(this.y / TILE_SIZE);
            this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
        }
    }

    alignToWall() {
        // Align Pac-Man to the center of the current tile when hitting a wall
        const tileX = Math.floor(this.x / TILE_SIZE);
        const tileY = Math.floor(this.y / TILE_SIZE);
        this.x = tileX * TILE_SIZE + TILE_SIZE / 2;
        this.y = tileY * TILE_SIZE + TILE_SIZE / 2;
    }

    handleTunnel() {
        // Wrap around when going through the tunnel
        const mazePixelWidth = MAZE_WIDTH * TILE_SIZE;
        if (this.x < -TILE_SIZE) {
            this.x = mazePixelWidth;
        } else if (this.x > mazePixelWidth) {
            this.x = -TILE_SIZE;
        }
    }

    updateMouthAnimation(deltaTime) {
        if (this.currentDirection) {
            this.mouthAngle += this.mouthSpeed * this.mouthDirection * deltaTime * 0.02;

            if (this.mouthAngle >= this.maxMouthAngle) {
                this.mouthAngle = this.maxMouthAngle;
                this.mouthDirection = -1;
            } else if (this.mouthAngle <= 0) {
                this.mouthAngle = 0;
                this.mouthDirection = 1;
            }
        }
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

        // Rotate based on direction
        let rotation = 0;
        switch (this.currentDirection) {
            case 'up':
                rotation = -Math.PI / 2;
                break;
            case 'down':
                rotation = Math.PI / 2;
                break;
            case 'left':
                rotation = Math.PI;
                break;
            case 'right':
            default:
                rotation = 0;
                break;
        }
        ctx.rotate(rotation);

        // Draw Pac-Man
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(0, 0, TILE_SIZE / 2 - 1, this.mouthAngle, Math.PI * 2 - this.mouthAngle);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    // Death animation
    renderDeath(ctx, progress) {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = '#ffff00';
        ctx.beginPath();

        // Expand the mouth opening as death progresses
        const deathAngle = Math.PI * progress;
        ctx.arc(0, 0, TILE_SIZE / 2 - 1, deathAngle, Math.PI * 2 - deathAngle);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
