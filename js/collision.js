import { TILE_SIZE } from './maze.js';

export class CollisionDetector {
    constructor() {
        this.collisionRadius = TILE_SIZE / 2;
    }

    // Check collision between Pac-Man and a ghost
    checkPacmanGhostCollision(pacman, ghost) {
        const pacPos = pacman.getPixelPosition();
        const ghostPos = ghost.getPixelPosition();

        const dx = pacPos.x - ghostPos.x;
        const dy = pacPos.y - ghostPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Collision occurs when distance is less than combined radius
        return distance < this.collisionRadius;
    }

    // Check if Pac-Man is eating pellets
    checkPelletCollision(pacman, maze) {
        const tilePos = pacman.getTilePosition();
        const pellet = maze.eatPellet(tilePos.x, tilePos.y);
        return pellet;
    }

    // Check collision between Pac-Man and all ghosts
    checkAllGhostCollisions(pacman, ghosts) {
        const collisions = [];

        for (const ghost of ghosts) {
            if (this.checkPacmanGhostCollision(pacman, ghost)) {
                collisions.push(ghost);
            }
        }

        return collisions;
    }
}
