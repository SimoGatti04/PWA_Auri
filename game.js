import Maze from './maze.js';
import Player from './player.js';

class Game {
    constructor(canvas, levelDisplay) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.levelDisplay = levelDisplay;
        this.levelTexts = [
            "Sorrisone",
            "Occhioni",
            "Guanciotte",
            "Culone"
        ];
        this.currentLevelText = this.levelTexts[0];
        this.cellSize = 20;
        this.gridSize = 15;
        this.canvas.width = this.cellSize * this.gridSize;
        this.canvas.height = this.cellSize * this.gridSize;
        this.level = 1;
        this.maze = new Maze(this.gridSize, this.cellSize);
        this.player = new Player(this.cellSize, this.cellSize, this.cellSize - 2);
        this.goal = { x: this.canvas.width - this.cellSize * 2, y: this.canvas.height - this.cellSize * 2, size: this.cellSize - 2 };
        this.isGameStarted = false;

        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (this.isMobile) {
            this.setupMobileControls();
        }
    }

    init() {
        this.maze.generate();
        this.draw();
        this.setupStartOverlay();
    }

     start() {
        this.isGameStarted = true;
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        if (this.isMobile) {
            this.setupMobileControls();
        }
    }

    setupStartOverlay() {
        const startButton = document.getElementById('startButton');
        const startOverlay = document.getElementById('startOverlay');

        startButton.addEventListener('click', () => {
            startOverlay.style.display = 'none';
            this.start();
        });
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
        if (!this.isGameStarted) return;{
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
    }


    handleMove(direction) {
        if (!this.isGameStarted) return;{
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
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Disegna il labirinto
        this.maze.draw(this.ctx);

        // Disegna il giocatore
        this.player.draw(this.ctx);

        // Disegna l'obiettivo
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.goal.x, this.goal.y, this.goal.size, this.goal.size);

        // Funzione per disegnare testo con contorno
        const drawTextWithOutline = (text, x, y) => {
            this.ctx.font = '14px Arial';
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(text, x, y);
            this.ctx.fillStyle = 'black';
            this.ctx.fillText(text, x, y);
        };

        // Aggiungi le scritte con contorno
        drawTextWithOutline('Simo', this.cellSize, this.cellSize - 5);

        // Posiziona il testo del livello alla destra del quadrato verde
        let levelTextX = this.goal.x + this.cellSize + 5;
        let levelTextY = this.goal.y + this.cellSize / 2 + 5;

        // Assicurati che il testo non esca dal canvas
        const textWidth = this.ctx.measureText(this.currentLevelText).width;
        if (levelTextX + textWidth > this.canvas.width) {
            levelTextX = this.canvas.width - textWidth - 5;
        }
        if (levelTextY > this.canvas.height) {
            levelTextY = this.canvas.height - 5;
        }

        drawTextWithOutline(this.currentLevelText, levelTextX, levelTextY);
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
        if (this.level > this.levelTexts.length) {
            this.endGame();
        } else {
            this.levelDisplay.textContent = this.level;
            this.currentLevelText = this.levelTexts[this.level - 1];
            this.player = new Player(this.cellSize, this.cellSize, this.cellSize - 2);
            this.maze.generate();
            this.draw();
        }
    }


   resetGame() {
        this.level = 1;
        this.levelDisplay.textContent = this.level;
        this.currentLevelText = this.levelTexts[0];
        this.player = new Player(this.cellSize, this.cellSize, this.cellSize - 2);
        this.maze.generate();
        this.draw();
        alert('Hai toccato un muro! Il gioco ricomincia dal livello 1.');
    }

    endGame() {
        const endOverlay = document.getElementById('endOverlay');
        const openCameraButton = document.getElementById('openCameraButton');

        endOverlay.style.display = 'flex';

        openCameraButton.addEventListener('click', () => {
            this.openFrontCamera();
        });

        this.isGameStarted = false;
    }

    openFrontCamera() {
        const constraints = {
            video: { facingMode: "user" }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                const videoElement = document.getElementById('cameraFeed');
                videoElement.srcObject = stream;
                videoElement.play();
                videoElement.style.display = 'block';
                document.getElementById('endOverlay').style.display = 'none';

                // Mostra il messaggio
                this.showCameraMessage();
            })
            .catch(err => {
                console.error("Errore nell'accesso alla fotocamera: ", err);
                alert("Non è stato possibile accedere alla fotocamera. Assicurati di aver concesso i permessi necessari.");
            });
    }

    showCameraMessage() {
        const cameraOverlay = document.getElementById('cameraOverlay');
        cameraOverlay.style.display = 'flex';

        // Nascondi il messaggio dopo 5 secondi
        setTimeout(() => {
            cameraOverlay.style.display = 'none';
        }, 5000);
    }
}

export default Game;
