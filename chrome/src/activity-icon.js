const ICON_SIZE = 19;
const BORDER_WIDTH = 2;


// 3 => [1, 1, 1]
function fill(count) {
  const arr = []
  for(let i = 0; i < count; i += 1) {
    arr.push(1)
  }
  return arr
}

export default class ActivityIcon {
  constructor(colour) {
    const canvas = document.createElement('canvas')
    canvas.width = ICON_SIZE
    canvas.height = ICON_SIZE
    this.ctx = canvas.getContext('2d')
    this.colour = colour;
    this.cpuIdleArray = fill(ICON_SIZE);
  }

  clear() {
    this.ctx.clearRect(0, 0, ICON_SIZE, ICON_SIZE)
  }

  drawBorder() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, ICON_SIZE);
    this.ctx.lineTo(ICON_SIZE, ICON_SIZE);
    this.ctx.lineTo(ICON_SIZE, 0);
    this.ctx.closePath();
    this.ctx.lineWidth = BORDER_WIDTH;
    this.ctx.strokeStyle = this.colour.border;
    this.ctx.stroke();
  }

  drawBackground() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, ICON_SIZE);
    this.cpuIdleArray.forEach((cpu, i) => {
      this.ctx.lineTo(i, cpu * ICON_SIZE);
    })
    this.ctx.lineTo(ICON_SIZE, ICON_SIZE);
    this.ctx.lineWidth = 2;
    this.ctx.fillStyle = this.colour.background;
    this.ctx.fill();
  }

  update(idle) {
    this.cpuIdleArray.push(idle);
    this.cpuIdleArray.shift();

    this.clear();
    this.drawBackground();
    this.drawBorder();
  }

  getImageData() {
    return this.ctx.getImageData(0, 0, ICON_SIZE, ICON_SIZE);
  }
}