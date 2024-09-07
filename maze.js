class Maze {
    constructor(gridSize, cellSize) {
        this.gridSize = gridSize;
        this.cellSize = cellSize;
        this.maze = [];
    }

    generate() {
        this.maze = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(1));

        const carve = (x, y) => {
            const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
            directions.sort(() => Math.random() - 0.5);

            for (let [dx, dy] of directions) {
                let nx = x + dx * 2, ny = y + dy * 2;
                if (nx >= 0 && nx < this.gridSize && ny >= 0 && ny < this.gridSize && this.maze[ny][nx] === 1) {
                    this.maze[y + dy][x + dx] = 0;
                    this.maze[ny][nx] = 0;
                    carve(nx, ny);
                }
            }
        };

        this.maze[1][1] = 0;
        carve(1, 1);
        this.maze[1][1] = 0;
        this.maze[this.gridSize - 2][this.gridSize - 2] = 0;
        console.log('Generated maze:');
        for (let row of this.maze) {
            console.log(row.join(' '));
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.maze[y][x] === 1) {
                    ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }
    }

    isWall(x, y) {
        // Assicuriamoci che le coordinate siano all'interno dei limiti del labirinto
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
            return true; // Consideriamo fuori dai limiti come un muro
        }
        console.log(`Maze at (${x}, ${y}): ${this.maze[y][x]}`);
        return this.maze[y][x] === 1;
    }
}

export default Maze;
