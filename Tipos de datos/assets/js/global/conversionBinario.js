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