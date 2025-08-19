// Función para generar un número entero aleatorio dentro de un rango (válido para números negativos)
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function binarioAEntero(binario) {
  if (binario[0] === '1') {
    // Convertir a decimal usando complemento a 2
    const complementoDos = binario.split('').map(bit => bit === '0' ? '1' : '0').join('');
    return -(parseInt(complementoDos, 2) + 1);
  } else {
    // Convertir directamente a decimal
    return parseInt(binario, 2);
  }
}


function enteroAComplementoA2(num, bits) {
  if (typeof num !== 'number' || typeof bits !== 'number' || bits <= 0 || !Number.isInteger(num)) {
    console.error("Entrada inválida.");
    return "";
  }

  if (num >= 0) {
    return num.toString(2).padStart(bits, '0');
  }

  // Para números negativos, se usa la máscara de bits
  // (1 << bits) crea un número con el bit 'bits' en 1 (ej: 100000000 para 8 bits)
  // Se suma el número negativo para obtener la representación binaria correcta
  let binario = ((1 << bits) + num).toString(2);

  // Se extraen los últimos 'bits' caracteres del resultado
  // Esto es necesario para manejar el caso de números negativos
  return binario.slice(binario.length - bits);
}