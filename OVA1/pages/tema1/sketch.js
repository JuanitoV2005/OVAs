function primitivosBits(p) {
  const datosPrimitivos = {
    byte: 8, short: 16, int: 32, long: 64,
    char: 16, float: 32, double: 64, boolean: 1
  };

  const limitesEnteros = {
    byte: { min: -128, max: 127 },
    short: { min: -32768, max: 32767 },
    int: { min: -2147483648, max: 2147483647 },
    long: { min: -9223372036854775808n, max: 9223372036854775807n }
  };

  const limitesReales = {
    float: {
      min: '±1.4×10⁻⁴⁵',
      max: '±3.4×10³⁸',
      precision: '~6-7 cifras decimales',
      tipo: 'IEEE 754 simple precisión'
    },
    double: {
      min: '±4.9×10⁻³²⁴',
      max: '±1.8×10³⁰⁸',
      precision: '~15 cifras decimales',
      tipo: 'IEEE 754 doble precisión'
    }
  };

  const coloresGrupos = [
    [173, 216, 230], [255, 204, 153],
    [200, 255, 200], [255, 255, 153]
  ];

  let tipoDato, bitsCount, bits, dropdown;

  p.reset = () => {
    tipoDato = "byte";
    bitsCount = datosPrimitivos[tipoDato];
    bits = new Array(bitsCount).fill(0);
  };

  p.setup = function () {
    let canvas = p.createCanvas(700, 200);
    canvas.parent('canvasContainer');
    p.reset();

    dropdown = p.select('#tipoDatoSelect');
    dropdown.changed(actualizarTipo);

    let resetBtn = p.select('#resetButton');
    resetBtn.mousePressed(reiniciarBits);
  };

  p.draw = function () {
  p.background(255);
  p.textSize(16);
  p.textAlign(p.CENTER, p.CENTER);

  let boxWidth = 20;
  let boxHeight = 20;
  let marginY = 10;
  let startX = (p.width - Math.min(bits.length, 32) * boxWidth) / 2;

  for (let i = 0; i < bits.length; i++) {
    let row = Math.floor(i / 32);
    let col = i % 32;
    let x = startX + col * boxWidth;
    let y = 50 + row * (boxHeight + marginY);

    if (tipoDato === "float") {
      if (i === 0) {
        p.fill(255, 150, 150);
      } else if (i >= 1 && i <= 8) {
        p.fill(255, 230, 180);
      } else {
        p.fill(200, 255, 200);
      }
    } else if (tipoDato === "double") {
      if (i === 0) {
        p.fill(255, 150, 150);
      } else if (i >= 1 && i <= 11) {
        p.fill(255, 230, 180);
      } else {
        p.fill(200, 255, 200);
      }
    } else if (i === 0 && ["byte", "short", "int", "long"].includes(tipoDato)) {
      p.fill(255, 200, 200);
    } else {
      let colorGrupo = coloresGrupos[Math.floor(i / 8) % coloresGrupos.length];
      p.fill(...colorGrupo);
    }

    p.stroke(0);
    p.rect(x, y, boxWidth, boxHeight);

    if (i === 0 && ["byte", "short", "int", "long"].includes(tipoDato)) {
      p.fill(200, 0, 0);
    } else {
      p.fill(0);
    }
    p.text(bits[i], x + boxWidth / 2, y + boxHeight / 2);
  }

  p.fill(0);
  p.textAlign(p.LEFT);

  let valorDecimal;
  let extraInfo = "";

  if (tipoDato === "long") {
    valorDecimal = p.interpretarComplemento2(bits, true);
  } else if (tipoDato === "float" || tipoDato === "double") {
    valorDecimal = p.interpretarIEEE754(bits, tipoDato);
  } else if (tipoDato === "char") {
    valorDecimal = parseInt(bits.join(''), 2);
    let charUnicode = String.fromCharCode(valorDecimal);
    extraInfo = ` | Unicode: '${charUnicode}'`;
  } else if (tipoDato === "boolean") {
    valorDecimal = bits[0] === 1 ? "true" : "false";
  } else if (["byte", "short", "int"].includes(tipoDato)) {
    valorDecimal = p.interpretarComplemento2(bits);
  } else {
    valorDecimal = parseInt(bits.join(''), 2);
  }

  p.text(`Valor: ${valorDecimal}${extraInfo}`, 10, 10);

  if (limitesEnteros[tipoDato]) {
    let lim = limitesEnteros[tipoDato];
    p.text(`Rango: ${lim.min} a ${lim.max}`, 10, 30);
  } else if (limitesReales[tipoDato]) {
    let r = limitesReales[tipoDato];
    p.text(`Rango: ${r.min} a ${r.max} | Precisión: ${r.precision} (${r.tipo})`, 10, 30);
  } else if (tipoDato === "char") {
    p.text(`Rango: 0 a 65535 (Unicode '\\u0000' a '\\uffff')`, 10, 30);
  } else if (tipoDato === "boolean") {
    p.text(`Valores posibles: true o false`, 10, 30);
  }

  if (["byte", "short", "int", "long"].includes(tipoDato)) {
    p.text("Nota: El primer bit es el de signo (complemento a dos)", 10, p.height - 20);
  }

  if (tipoDato === "float" || tipoDato === "double") {
    p.text("Estructura del estandar IEEE 754: Rojo = signo | Amarillo = exponente | Verde = mantisa", 10, p.height - 20);
  }
};

  function actualizarTipo() {
    tipoDato = dropdown.value();
    bitsCount = datosPrimitivos[tipoDato];
    bits = new Array(bitsCount).fill(0);
  }

  function reiniciarBits() {
    bits = new Array(bits.length).fill(0);
  }

  p.interpretarIEEE754 = function (bits, tipo) {
    const binStr = bits.join('');
    const buffer = new ArrayBuffer(tipo === 'float' ? 4 : 8);
    const byteView = new Uint8Array(buffer);
    const byteCount = tipo === 'float' ? 4 : 8;

    for (let i = 0; i < byteCount; i++) {
      const byteBits = binStr.slice(i * 8, (i + 1) * 8);
      byteView[i] = parseInt(byteBits, 2);
    }

    const dataView = new DataView(buffer);
    return tipo === 'float' ? dataView.getFloat32(0, false) : dataView.getFloat64(0, false);
  };

  p.interpretarComplemento2 = function (bits, usarBigInt = false) {
    const signo = bits[0];
    const binStr = bits.join('');

    if (usarBigInt) {
      let valor = BigInt('0b' + binStr);
      if (signo === 1) {
        valor -= 1n << BigInt(bits.length);
      }
      return valor;
    } else {
      if (signo === 0) {
        return parseInt(binStr, 2);
      } else {
        const valor = parseInt(binStr, 2);
        return valor - (1 << bits.length);
      }
    }
  };


  p.mousePressed = function () {
    let boxWidth = 20;
    let boxHeight = 20;
    let marginY = 10;
    let startX = (p.width - p.min(bits.length, 32) * boxWidth) / 2;

    for (let i = 0; i < bits.length; i++) {
      let row = p.floor(i / 32);
      let col = i % 32;
      let x = startX + col * boxWidth;
      let y = 50 + row * (boxHeight + marginY);

      if (
        p.mouseX > x &&
        p.mouseX < x + boxWidth &&
        p.mouseY > y &&
        p.mouseY < y + boxHeight
      ) {
        bits[i] = bits[i] === 0 ? 1 : 0;
      }
    }
  };
}