
// Diccionario para determinar la cantidad de cuadros que se van a generar según el tipo de dato primitivo 
const datosPrimitivos = {
  byte: 8,
  short: 16,
  int: 32,
  long: 64,
  char: 16,
  float: 32,
  double: 64,
  boolean: 1
};

// Diccionario para mostrar en pantalla el rango que manejan los tipos de datos que implican números en el dominio de los enteros
const limitesEnteros = {
  byte: { min: -128, max: 127 },
  short: { min: -32768, max: 32767 },
  int: { min: -2147483648, max: 2147483647 },
  long: { min: -9223372036854775808n, max: 9223372036854775807n }
};

// Diccionario para mostrar en pantalla el rango, la precisión y el formato, que manejan los tipos de datos que implican números en el dominio de los reales 
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


// Lista que contiene los diferentes colores que van a tomar los cuadros donde estan los bits
const coloresGrupos = [
  [173, 216, 230], // Azul claro
  [255, 204, 153], // Naranja claro
  [200, 255, 200], // Verde claro
  [255, 255, 153]  // Amarillo claro
];


let tipoDato = "byte";                     // Variable que almacenará el tipo de dato de Java que se está visualizando actualmente, por defecto byte
let bitsCount = datosPrimitivos[tipoDato]; // Segun la variable tipoDato en el archivo HTML, almacena la cantidad de bits para el tipo de dato seleccionado, por defecto 8 bits.
let bits = new Array(bitsCount).fill(0);   // Lista que representa la secuencia de bits del tipo de dato, teniendo en cuenta el tamaño de bistCount, se llena con 0 por defecto.
let dropdown;                              // Almacenar el tipo de dato seleccionado por el usuario

function setup() {
  let canvas = createCanvas(800, 200);     // Crear un cajita con un ancho de 800 píxeles y una altura de 200 píxeles
  canvas.parent('canvasContainer');        // Enlace con el archivo HTML

  dropdown = select('#tipoDatoSelect');    // Enlazar una variable al tipo de dato que selecciono el usuario
  dropdown.changed(actualizarTipo);        // Ejecutar la función actualizarTipo cuando el valor del menú desplegable dropdown cambie.

  let resetBtn = select('#resetButton');   // Enlaza una variable al boton reset de HTML
  resetBtn.mousePressed(reiniciarBits);    // Ejecutar la función reiniciarBits al oprimir el boton resetBtn
}

// Función para actualizar la cantidad de cuadrados segun el tipo de dato selccionado por el usuario
function actualizarTipo() {
  tipoDato = dropdown.value();            // tipoDato cambia a lo que eliga el usuario
  bitsCount = datosPrimitivos[tipoDato];  // Cambia la cantidad de bits segun el dato elegido por el usuario
  bits = new Array(bitsCount).fill(0);    // Genera una lista congruente al dato seleccionado por el usuario
}

// Función para limpiar los cuadrados de bits y hacerlos 0
function reiniciarBits() {
  bits = new Array(bits.length).fill(0);  // Rellena la lista actual de bits con 0s
}

// Función para interpretar el estándar del IEEE para aritmética en punto flotante, con dos entradas, una lista de 0s y 1s que representan la secuencia binaria del número de punto flotante y si el tipo de dato es float o double
function interpretarIEEE754(bits, tipo) {
  const binStr = bits.join('');                             // Convertir las lista en un String    
  const buffer = new ArrayBuffer(tipo === 'float' ? 4 : 8); // Crea una nueva lista donde su tamaño en bytes se determina por el tipo de dato.
  const byteView = new Uint8Array(buffer);                  // Visualización de la lista "ArrayBuffer", que permite acceder a los datos como una secuencia de enteros sin signo de 8 bits (bytes).
  const byteCount = tipo === 'float' ? 4 : 8;               // Define la cantidad de bytes que componen el tipo de dato

  // Inicia un bucle que itera a través de cada byte del número de punto flotante.
  for (let i = 0; i < byteCount; i++) {
    const byteBits = binStr.slice(i * 8, (i + 1) * 8);      // Extrae una porción de 8 bits de la cadena binaria (binStr) correspondiente al byte actual i
    byteView[i] = parseInt(byteBits, 2);                    // Convierte la cadena de 8 bits antes extraida a un entero decimal utilizando la base 2, y lo almacena en la posición i del Uint8Array (byteView)
  }

  const dataView = new DataView(buffer);                    // Proporciona una interfaz de bajo nivel para leer y escribir diferentes tipos de datos numéricos (enteros con signo/sin signo, floats, etc.) desde el ArrayBuffer en un desplazamiento específico.
  return tipo === 'float' ? dataView.getFloat32(0, false) : dataView.getFloat64(0, false); // Lee el valor numerico del ArrayBuffer utilzando el Dataview y devuelve un float o double con ayuda de la funciones para leer un número de punto flotante de 32 o 64 bits.
}

// Interpreta una secuencia de bits en representación de complemento a dos, toma dos valores, un array de 0s y 1s que representan el número entero en complemento a dos, un valor booleano que indica si se deben usar objetos BigInt para representar el valor (necesario para enteros de 64 bits como long en JavaScript).
function interpretarComplemento2(bits, usarBigInt = false) {      
  const signo = bits[0];                      // Obtiene el primer bit del array bits (bit de signo) 
  const binStr = bits.join('');               // Convierte el array de bits en una única cadena binaria.


  // Determinar si es necesario utlizar BigInt (se usa en los datos tipo long)
  // Para long
  if (usarBigInt) { 
    let valor = BigInt('0b' + binStr);         // Crea un obejto BigInt a partir de la cadena binaria binStr,  El prefijo '0b' indica que la cadena se interpreta como un número binario.
    let mask = 1n << BigInt(bits.length - 1);  // Crea una máscara BigInt con un 1 en la posición del bit de signo (el bit más significativo) y 0s en las demás posiciones
    if (signo === 1) {                         // Si le dato long es negativo 
      valor -= 1n << BigInt(bits.length);      // Realiza la operación para obtener el valor negativo correcto en complemento a dos, lo que es equivalente a restar 2^{n} del valor binario interpretado como un entero sin signo, donde n es el número de bits.
    }
    return valor;                              // Devuelve el valor entero representado por la secuencia de bits como un BigInt.
  // Para byte, short, int
  } else {
    if (signo === 0) {                         // Si el bit del signo es, el número es positivo
      return parseInt(binStr, 2);              // Convierte la cadena binaria a un entero decimal utilizando la base 2.
    } else {                                   // El número es negativo 
      const valor = parseInt(binStr, 2);       // Interpreta la cadena binaria como un entero sin signo.
      return valor - (1 << bits.length);       // Resta 2 ^{n} del valor obtenido para obtener la representación negativa correcta en complemento a dos; desplaza cada bit a la izquierda para obtener la cadena de bits en 2^{n}.
    }
  }

}

//  Esta función se ejecuta continuamente en un bucle después de que la función setup() se haya completado, se utiliza para dibujar elementos en el canvas.
function draw() {
  background(255);
  textSize(16);
  textAlign(CENTER, CENTER);

  let boxWidth = 20;
  let boxHeight = 20;
  let marginY = 10;
  let startX = (width - min(bits.length, 32) * boxWidth) / 2;

  for (let i = 0; i < bits.length; i++) {
    let row = floor(i / 32);
    let col = i % 32;
    let x = startX + col * boxWidth;
    let y = 50 + row * (boxHeight + marginY);

    // Estilo por tipo
    if (tipoDato === "float") {
       if (i === 0) {
        fill(255, 150, 150); // Bit de signo (rojo claro)
       } else if (i >= 1 && i <= 8) {
        fill(255, 230, 180); // Exponente (naranja claro)
       } else {
        fill(200, 255, 200); // Mantisa (verde claro)
       }
    } else if (tipoDato === "double") {
       if (i === 0) {
        fill(255, 150, 150); // Bit de signo (rojo claro)
       } else if (i >= 1 && i <= 11) {
        fill(255, 230, 180); // Exponente (naranja claro)
       } else {
        fill(200, 255, 200); // Mantisa (verde claro)
       }
    } else if (i === 0 && ["byte", "short", "int", "long"].includes(tipoDato)) {
       fill(255, 200, 200); // Bit de signo (complemento a dos)
    } else {
       let colorGrupo = coloresGrupos[Math.floor(i / 8) % coloresGrupos.length];
       fill(...colorGrupo);
    }


    stroke(0);
    rect(x, y, boxWidth, boxHeight);

    if (i === 0 && ["byte", "short", "int", "long"].includes(tipoDato)) {
      fill(200, 0, 0); // rojo para bit de signo
    } else {
      fill(0);
    }
    text(bits[i], x + boxWidth / 2, y + boxHeight / 2);

  }

  fill(0);
  textAlign(LEFT);

  let valorDecimal;
  let extraInfo = "";

  if (tipoDato === "long") {
    valorDecimal = interpretarComplemento2(bits, true);
  } else if (tipoDato === "float" || tipoDato === "double") {
    valorDecimal = interpretarIEEE754(bits, tipoDato);
  } else if (tipoDato === "char") {
    valorDecimal = parseInt(bits.join(''), 2);
    let charUnicode = String.fromCharCode(valorDecimal);
    extraInfo = ` | Unicode: '${charUnicode}'`;
  } else if (tipoDato === "boolean") {
    valorDecimal = bits[0] === 1 ? "true" : "false";
  } else if (["byte", "short", "int"].includes(tipoDato)) {
    valorDecimal = interpretarComplemento2(bits);
  } else {
    valorDecimal = parseInt(bits.join(''), 2);
  }

  text(`Valor: ${valorDecimal}${extraInfo}`, 10, 10);

  if (limitesEnteros[tipoDato]) {
    let lim = limitesEnteros[tipoDato];
    text(`Rango: ${lim.min} a ${lim.max}`, 10, 30);
  } else if (limitesReales[tipoDato]) {
    let r = limitesReales[tipoDato];
    text(`Rango: ${r.min} a ${r.max} | Precisión: ${r.precision} (${r.tipo})`, 10, 30);
  } else if (tipoDato === "char") {
    text(`Rango: 0 a 65535 (Unicode '\u0000' a '\uffff')`, 10, 30);
  } else if (tipoDato === "boolean") {
    text(`Valores posibles: true o false`, 10, 30);
  }

  if (["byte", "short", "int", "long"].includes(tipoDato)) {
    text("Nota: El primer bit es el de signo (complemento a dos)", 10, height - 20);
  }

  if (tipoDato === "float" || tipoDato === "double") {
    text("Estructura del estandar IEEE 754: Rojo = signo | Amarillo = exponente | Verde = mantisa", 10, height - 20);
  } else if (["byte", "short", "int", "long"].includes(tipoDato)) { 
    text("Nota: El primer bit es el de signo (complemento a dos)", 10, height - 20);
  }

}

function mousePressed() {
  let boxWidth = 20;
  let boxHeight = 20;
  let marginY = 10;
  let startX = (width - min(bits.length, 32) * boxWidth) / 2;

  for (let i = 0; i < bits.length; i++) {
    let row = floor(i / 32);
    let col = i % 32;
    let x = startX + col * boxWidth;
    let y = 50 + row * (boxHeight + marginY);

    if (mouseX > x && mouseX < x + boxWidth && mouseY > y && mouseY < y + boxHeight) {
      bits[i] = bits[i] === 0 ? 1 : 0;
    }
  }
}




