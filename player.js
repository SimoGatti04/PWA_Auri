class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    move(direction, cellSize) {
        switch(direction) {
            case 'up': this.y -= cellSize; break;
            case 'down': this.y += cellSize; break;
            case 'left': this.x -= cellSize; break;
            case 'right': this.x += cellSize; break;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

export default Player;
