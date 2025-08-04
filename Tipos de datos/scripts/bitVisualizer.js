class BitVisualizer {
  constructor(p) {
    this.p = p;
    this.tipoDato = "byte";
    this.bitsCount = this.datosPrimitivos[this.tipoDato];
    this.bits = new Array(this.bitsCount).fill(0);

    this.dropdown = this.p.select('#tipoDatoSelect');
    this.dropdown.changed(() => this.actualizarTipo());
    this.p.select('#resetButton').mousePressed(() => this.reiniciarBits());
  }

  datosPrimitivos = {
    byte: 8, short: 16, int: 32, long: 64,
    char: 16, float: 32, double: 64, boolean: 1
  };

  limitesEnteros = {
    byte: { min: -128, max: 127 },
    short: { min: -32768, max: 32767 },
    int: { min: -2147483648, max: 2147483647 },
    long: { min: -9223372036854775808n, max: 9223372036854775807n }
  };

  limitesReales = {
    float: {
      min: '±1.4×10⁻⁴⁵', max: '±3.4×10³⁸',
      precision: '~6-7 cifras decimales', tipo: 'IEEE 754 simple precisión'
    },
    double: {
      min: '±4.9×10⁻³²⁴', max: '±1.8×10³⁰⁸',
      precision: '~15 cifras decimales', tipo: 'IEEE 754 doble precisión'
    }
  };

  colorSigno = [153, 27, 27];
  colorExponente = [234, 179, 8];
  colorMantisa = [34, 139, 34];
  coloresModernos = [
    [0, 121, 107],
    [63, 81, 181],
    [255, 160, 0],
    [156, 39, 176]
  ];

  alturaUtilCanvas = 410;
  alturaPiePagina = 40;

  actualizarTipo() {
    this.tipoDato = this.dropdown.value();
    this.bitsCount = this.datosPrimitivos[this.tipoDato];
    this.bits = new Array(this.bitsCount).fill(0);
  }

  reiniciarBits() {
    this.bits.fill(0);
  }

  interpretarIEEE754(bits, tipo) {
    const binStr = bits.join('');
    const buffer = new ArrayBuffer(tipo === 'float' ? 4 : 8);
    const view = new Uint8Array(buffer);
    const bytes = tipo === 'float' ? 4 : 8;

    for (let i = 0; i < bytes; i++) {
      view[i] = parseInt(binStr.slice(i * 8, (i + 1) * 8), 2);
    }

    const dv = new DataView(buffer);
    return tipo === 'float' ? dv.getFloat32(0, false) : dv.getFloat64(0, false);
  }

  interpretarComplemento2(bits, usarBigInt = false) {
    const binStr = bits.join('');
    const signo = bits[0];

    if (usarBigInt) {
      let val = BigInt('0b' + binStr);
      if (signo === 1) val -= 1n << BigInt(bits.length);
      return val;
    }

    if (signo === 0) return parseInt(binStr, 2);
    return parseInt(binStr, 2) - (1 << bits.length);
  }

  draw() {
    const p = this.p;
    p.background(255);
    p.textSize(16);
    p.textAlign(p.CENTER, p.CENTER);

    const cols = p.min(this.bits.length, 8);
    const boxW = 40;
    const boxH = 40;
    const marginY = 10;
    const startX = (p.width - cols * boxW) / 2;

    for (let i = 0; i < this.bits.length; i++) {
      const row = p.floor(i / cols);
      const col = i % cols;
      const x = startX + col * boxW;
      const y = 50 + row * (boxH + marginY);

      if (y + boxH > this.alturaUtilCanvas) break;

      let strokeColor;
      let fillColor = [255, 255, 255];

      if (["float", "double"].includes(this.tipoDato)) {
        if (i === 0) strokeColor = this.colorSigno;
        else if ((this.tipoDato === "float" && i <= 8) || (this.tipoDato === "double" && i <= 11)) strokeColor = this.colorExponente;
        else strokeColor = this.colorMantisa;
      } else if (["byte", "short", "int", "long"].includes(this.tipoDato)) {
        strokeColor = i === 0
          ? this.colorSigno
          : this.coloresModernos[["byte", "short", "int", "long"].indexOf(this.tipoDato) % this.coloresModernos.length];
      } else {
        strokeColor = this.coloresModernos[Math.floor(i / 8) % this.coloresModernos.length];
      }

      p.stroke(...strokeColor);
      p.strokeWeight(2);
      p.fill(...fillColor);
      p.rect(x, y, boxW, boxH, 2);

      p.noStroke();
      p.fill(0);
      p.text(this.bits[i], x + boxW / 2, y + boxH / 2);
    }

    p.textAlign(p.LEFT);
    let valor, extra = "";

    if (this.tipoDato === "long") {
      valor = this.interpretarComplemento2(this.bits, true);
    } else if (["float", "double"].includes(this.tipoDato)) {
      valor = this.interpretarIEEE754(this.bits, this.tipoDato);
    } else if (this.tipoDato === "char") {
      const code = parseInt(this.bits.join(''), 2);
      valor = code;
      extra = ` | Unicode: '${String.fromCharCode(code)}'`;
    } else if (this.tipoDato === "boolean") {
      valor = this.bits[0] === 1 ? "true" : "false";
    } else {
      valor = this.interpretarComplemento2(this.bits);
    }

    p.fill(0);
    p.text(`Valor: ${valor}${extra}`, 10, 10);

    if (this.limitesEnteros[this.tipoDato]) {
      const { min, max } = this.limitesEnteros[this.tipoDato];
      p.text(`Rango: ${min} a ${max}`, 10, 30);
    } else if (this.limitesReales[this.tipoDato]) {
      const { min, max, precision, tipo } = this.limitesReales[this.tipoDato];
      p.text(`Rango: ${min} a ${max} | Precisión: ${precision} (${tipo})`, 10, 30);
    } else if (this.tipoDato === "char") {
      p.text(`Rango: 0 a 65535 (Unicode '\u0000' a '\uffff')`, 10, 30);
    } else if (this.tipoDato === "boolean") {
      p.text(`Valores posibles: true o false`, 10, 30);
    }

    if (["float", "double"].includes(this.tipoDato)) {
      p.text("IEEE 754: Rojo = signo | Amarillo = exponente | Verde = mantisa", 10, this.alturaUtilCanvas + 10);
    } else if (["byte", "short", "int", "long"].includes(this.tipoDato)) {
      p.text("Nota: El bit más significativo es el de signo (complemento a dos)", 10, this.alturaUtilCanvas + 10);
    }
  }

  mousePressed() {
    const p = this.p;
    const cols = p.min(this.bits.length, 8);
    const boxW = 40;
    const boxH = 40;
    const marginY = 10;
    const startX = (p.width - cols * boxW) / 2;

    for (let i = 0; i < this.bits.length; i++) {
      const row = p.floor(i / cols);
      const col = i % cols;
      const x = startX + col * boxW;
      const y = 50 + row * (boxH + marginY);

      if (p.mouseX > x && p.mouseX < x + boxW && p.mouseY > y && p.mouseY < y + boxH) {
        this.bits[i] = this.bits[i] === 0 ? 1 : 0;
      }
    }
  }
}
