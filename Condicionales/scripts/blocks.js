
// === DEFINIR BLOQUES ===
Blockly.defineBlocksWithJsonArray([
  {
    "type": "move_forward",
    "message0": "avanzar",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 290
  },
  {
    "type": "turn_left",
    "message0": "girar izquierda",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 290
  },
  {
    "type": "turn_right",
    "message0": "girar derecha",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 290
  },
  {
    "type": "repeat_until_goal",
    "message0": "repetir hasta la meta %1 hacer %2",
    "args0": [
      { "type": "input_dummy" },
      { "type": "input_statement", "name": "DO" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 120,
    "tooltip": "Repetir acciones hasta llegar a la meta"
  },
  {
    "type": "if_path_ahead",
    "message0": "si hay camino enfrente hacer %1",
    "args0": [
      { "type": "input_statement", "name": "DO" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 210
  },
  {
    "type": "sense_ahead",
    "message0": "camino libre adelante",
    "output": "Boolean",
    "colour": 120
  }
]);

// === GENERADORES DE CÓDIGO ===
const javascriptGenerator = Blockly.JavaScript;

// Bandera para indicar que estamos generando "código inline" (dentro
// de una closure que se ejecutará más tarde). Cuando está true,
// los bloques de movimiento deben generar llamadas DIRECTAS (mover();)
// en lugar de encolar acciones (acciones.push(...)).
let _generatingInline = false;

// --- Movimientos: encolan acciones por defecto, pero si estamos en modo
// "inline" devuelven la llamada directa para poder insertarla dentro
// de una closure que decidirá en tiempo de ejecución. ---
javascriptGenerator.forBlock['move_forward'] = function() {
  if (_generatingInline) return 'mover();\n';
  return 'acciones.push(() => mover());\n';
};
javascriptGenerator.forBlock['turn_left'] = function() {
  if (_generatingInline) return 'girarIzq();\n';
  return 'acciones.push(() => girarIzq());\n';
};
javascriptGenerator.forBlock['turn_right'] = function() {
  if (_generatingInline) return 'girarDer();\n';
  return 'acciones.push(() => girarDer());\n';
};

javascriptGenerator.forBlock['repeat_until_goal'] = function(block) {
  let branch;
  const wasInline = _generatingInline;
  _generatingInline = true;
  branch = javascriptGenerator.statementToCode(block, 'DO');
  _generatingInline = wasInline;
  return `acciones.push(() => { while (!enMeta()) { ${branch} } });\n`;
};

javascriptGenerator.forBlock['if_path_ahead'] = function(block) {
  const wasInline = _generatingInline;
  _generatingInline = true;
  let branch = javascriptGenerator.statementToCode(block, 'DO');
  _generatingInline = wasInline;
  return `acciones.push(() => { if (caminoAdelante()) { ${branch} } });\n`;
};

// --- sensor / lógica ---
javascriptGenerator.forBlock['sense_ahead'] = function () {
  return ['caminoAdelante()', javascriptGenerator.ORDER_FUNCTION_CALL];
};

// --- Repeticiones ---
javascriptGenerator.forBlock['controls_repeat_ext'] = function(block) {
  let repeats = '';
  if (block.getField('TIMES')) {
    repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    repeats = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ASSIGNMENT) || '0';
  }
  let branch = javascriptGenerator.statementToCode(block, 'DO');
  branch = javascriptGenerator.addLoopTrap(branch, block);
  return `for (let count = 0; count < ${repeats}; count++) {\n${branch}}\n`;
};

// --- Condicionales ---
// COMPORTAMIENTO:
// - Si estamos generando *inline* (es decir, estamos construyendo el cuerpo
//   de una closure que se ejecutará más tarde), devolvemos código tipo:
//     if (cond) { mover(); } else { girarDer(); }
// - Si NO estamos en inline, devolvemos una sola encolación:
//     acciones.push(() => { if (cond) { mover(); } else { girarDer(); } });
javascriptGenerator.forBlock['controls_if'] = function(block) {
  const wasInline = _generatingInline;
  let n = 0;
  let inner = '';

  do {
    const condition = javascriptGenerator.valueToCode(block, 'IF' + n, javascriptGenerator.ORDER_NONE) || 'false';

    // Para generar el cuerpo de esta rama como llamadas directas (mover();) ponemos
    // la bandera inline a true temporalmente.
    _generatingInline = true;
    let branch = javascriptGenerator.statementToCode(block, 'DO' + n);
    _generatingInline = wasInline;

    inner += (n === 0 ? 'if' : ' else if') + ` (${condition}) {\n${branch}}\n`;
    n++;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE')) {
    _generatingInline = true;
    const elseBranch = javascriptGenerator.statementToCode(block, 'ELSE');
    _generatingInline = wasInline;
    inner += `else {\n${elseBranch}}\n`;
  }

  if (wasInline) {
    // Si ya estábamos generando inline, devolvemos el if como código directo.
    return inner;
  } else {
    // Si NO estábamos inline, encolamos UNA closure que evaluará la condición
    // en el momento de ejecutarse (tick).
    return `acciones.push(() => {\n${inner}});\n`;
  }
};
javascriptGenerator.forBlock['controls_ifelse'] = javascriptGenerator.forBlock['controls_if'];

// ─── Sensores ─────────────────────────────────────────────

Blockly.JavaScript['hay_camino_frente'] = () => ['controller.caminoAdelante()', Blockly.JavaScript.ORDER_ATOMIC];

Blockly.Blocks['hay_camino_derecha'] = {
  init: function() {
    this.appendDummyInput().appendField("hay camino a la derecha");
    this.setOutput(true, "Boolean");
    this.setColour(210);
  }
};
Blockly.JavaScript['hay_camino_derecha'] = () => ['controller.caminoDerecha()', Blockly.JavaScript.ORDER_ATOMIC];

Blockly.Blocks['hay_camino_izquierda'] = {
  init: function() {
    this.appendDummyInput().appendField("hay camino a la izquierda");
    this.setOutput(true, "Boolean");
    this.setColour(210);
  }
};
Blockly.JavaScript['hay_camino_izquierda'] = () => ['controller.caminoIzquierda()', Blockly.JavaScript.ORDER_ATOMIC];

Blockly.Blocks['en_meta'] = {
  init: function() {
    this.appendDummyInput().appendField("estoy en la meta");
    this.setOutput(true, "Boolean");
    this.setColour(210);
  }
};
Blockly.JavaScript['en_meta'] = () => ['controller.enMeta()', Blockly.JavaScript.ORDER_ATOMIC];

// ─── Repetir hasta meta ───────────────────────────────────
Blockly.Blocks['repetir_hasta_meta'] = {
  init: function() {
    this.appendStatementInput("DO").appendField("repetir hasta la meta");
    this.setColour(120);
  }
};
Blockly.JavaScript['repetir_hasta_meta'] = function(block) {
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  return `acciones.push(() => {while(!controller.enMeta()){${branch}}});\n`;
};

// ─── While ────────────────────────────────────────────────
Blockly.Blocks['while_do'] = {
  init: function() {
    this.appendValueInput("COND").setCheck("Boolean").appendField("mientras");
    this.appendStatementInput("DO").appendField("hacer");
    this.setColour(120);
  }
};
Blockly.JavaScript['while_do'] = function(block) {
  var cond = Blockly.JavaScript.valueToCode(block, 'COND', Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  return `acciones.push(() => {while(${cond}){${branch}}});\n`;
};

// ─── Switch Frente ────────────────────────────────────────
Blockly.Blocks['switch_frente'] = {
  init: function() {
    this.appendStatementInput("LIBRE").appendField("si frente LIBRE");
    this.appendStatementInput("MURO").appendField("si frente MURO");
    this.appendStatementInput("META").appendField("si frente META");
    this.setColour(200);
  }
};
Blockly.JavaScript['switch_frente'] = function(block) {
  var libre = Blockly.JavaScript.statementToCode(block, 'LIBRE');
  var muro = Blockly.JavaScript.statementToCode(block, 'MURO');
  var meta = Blockly.JavaScript.statementToCode(block, 'META');
  return `acciones.push(() => {
    switch(controller.estadoFrente()){
      case 'LIBRE': {${libre}} break;
      case 'MURO': {${muro}} break;
      case 'META': {${meta}} break;
    }
  });\n`;
};