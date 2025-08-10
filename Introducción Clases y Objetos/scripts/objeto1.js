// No basta con solo tener la clase, hay que hacerla visible para otros archivos con linea window al final


// objeto1.js
// Clase compartida
class CirculoAnimado {
  constructor(p, x, y, r, velocidad) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.r = r;
    this.velocidad = velocidad;
    this.direccion = 1;
  }

  mover() {
    this.x += this.velocidad * this.direccion;
    if (this.x > this.p.width - this.r || this.x < this.r) {
      this.direccion *= -1;
    }
  }

  dibujar() {
    this.p.fill(100, 150, 250);
    this.p.ellipse(this.x, this.y, this.r * 2);
  }
}

// **AGREGA ESTA LÍNEA:**
window.CirculoAnimado = CirculoAnimado;