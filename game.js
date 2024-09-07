import Maze from './maze.js';
import Player from './player.js';

class Game {
    constructor(canvas, levelDisplay) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.levelDisplay = levelDisplay;
        this.cellSize = 20;
        this.gridSize = 15;
        this.canvas.width = this.cellSize * this.gridSize;
        this.canvas.height = this.cellSize * this.gridSize;
        this.level = 1;
        this.maze = new Maze(this.gridSize, this.cellSize);
        this.player = new Player(this.cellSize, this.cellSize, this.cellSize - 2);
        this.goal = { x: this.canvas.width - this.cellSize * 2, y: this.canvas.height - this.cellSize * 2, size: this.cellSize - 2 };

        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (this.isMobile) {
            this.setupMobileControls();
        }
    }

    start() {
        this.maze.generate();
        this.draw();
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        if (this.isMobile) {
            this.setupMobileControls();
        }
        console.log('Game started');
    }


    setupMobileControls() {
        const mobileControls = document.getElementById('mobileControls');
        mobileControls.style.display = 'flex';

        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach(dir => {
            const btn = document.getElementById(`${dir}Btn`);
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleMove(dir);
            }, { passive: false });
        });

        // Impedisci lo scrolling della pagina durante il gioco
        document.body.addEventListener('touchmove', (e) => {
            if (e.target.closest('#mobileControls')) {
                e.preventDefault();
            }
        }, { passive: false });

        console.log('Mobile controls setup completed');
    }


    handleKeyPress(e) {
        const keyToDirection = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        const direction = keyToDirection[e.key];
        if (direction) {
            e.preventDefault(); // Previene lo scrolling della pagina con le frecce
            this.handleMove(direction);
        }
    }


    handleMove(direction) {
        console.log(`Attempting to move: ${direction}`);
        const oldX = this.player.x;
        const oldY = this.player.y;

        let newX = this.player.x;
        let newY = this.player.y;

        switch (direction) {
            case 'up':
                newY -= this.cellSize;
                break;
            case 'down':
                newY += this.cellSize;
                break;
            case 'left':
                newX -= this.cellSize;
                break;
            case 'right':
                newX += this.cellSize;
                break;
        }

        console.log(`Current position: (${oldX}, ${oldY}), New position: (${newX}, ${newY})`);

        if (this.checkCollision({x: newX, y: newY}) || this.checkBorderCollision({x: newX, y: newY})) {
            console.log('Collision detected, restarting from level 1');
            this.resetGame();
        } else {
            this.player.move(newX, newY);
            console.log(`Movement successful. New position: x=${this.player.x}, y=${this.player.y}`);

            if (this.checkGoal()) {
                console.log('Goal reached');
                this.nextLevel();
            }
        }

        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.maze.draw(this.ctx);
        this.player.draw(this.ctx);
        this.drawGoal();
    }

    drawGoal() {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.goal.x, this.goal.y, this.goal.size, this.goal.size);
    }

    checkCollision(position) {
        const gridX = Math.floor(position.x / this.cellSize);
        const gridY = Math.floor(position.y / this.cellSize);
        console.log(`Checking collision at grid position: (${gridX}, ${gridY})`);
        console.log(`Is wall: ${this.maze.isWall(gridX, gridY)}`);
        return this.maze.isWall(gridX, gridY);
    }

    checkBorderCollision(position) {
        return position.x < 0 || position.x >= this.canvas.width ||
               position.y < 0 || position.y >= this.canvas.height;
    }



    checkGoal() {
        return this.player.x === this.goal.x && this.player.y === this.goal.y;
    }

    nextLevel() {
        this.level++;
        if (this.level > 4) {
            alert('Hai completato tutti i livelli!');
            this.resetGame();
        } else {
            this.levelDisplay.textContent = this.level;
            this.player = new Player(this.cellSize, this.cellSize, this.cellSize - 2);
            this.maze.generate();
            this.draw();
        }
    }

    resetGame() {
        this.level = 1;
        this.levelDisplay.textContent = this.level;
        this.player.x = this.cellSize;
        this.player.y = this.cellSize;
        this.maze.generate();
        this.draw();
        alert('Hai toccato un muro! Il gioco ricomincia dal livello 1.');
    }
}

export default Game;
