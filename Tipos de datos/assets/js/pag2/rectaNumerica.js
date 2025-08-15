// let rectaNumerica = (p) => {
//     let selected = 0;
//     let numbers = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];

//     let palette = {
//         bg: '#f8f9fa',
//         line: '#999',
//         text: '#333',
//         pos: '#4ade80',
//         neg: '#f87171',
//         highlight: '#8b5cf6',
//         stroke: '#ddd',
//         msb: '#eab308'
//     };

//     p.setup = function () {
//         let canvas = p.createCanvas(800, 220);
//         canvas.parent("recta-complemento-a-2");
//         p.textAlign(p.CENTER, p.CENTER);
//         p.textSize(16);
//         p.textFont("monospace");
//     };

//     p.draw = function () {
//         p.background(palette.bg);
//         let margin = 40;
//         let spacing = (p.width - 2 * margin) / (numbers.length - 1);
//         let baseY = p.height / 2;

//         // Línea base
//         p.stroke(palette.line);
//         p.strokeWeight(2);
//         p.line(margin, baseY, p.width - margin, baseY);

//         for (let i = 0; i < numbers.length; i++) {
//             let x = margin + i * spacing;
//             let n = numbers[i];

//             // Línea vertical
//             p.stroke(palette.stroke);
//             p.line(x, baseY - 15, x, baseY + 15);

//             // Círculo
//             p.noStroke();
//             if (n === selected) {
//                 //fill(palette.highlight);
//                 p.fill("ffffff")
//                 p.stroke(palette.highlight);
//                 p.circle(x, baseY, 26);
//                 p.noStroke();
//                 p.fill(n < 0 ? palette.neg : palette.pos);
//                 p.circle(x, baseY, 18);
//             } else {
//                 p.fill(n < 0 ? palette.neg : palette.pos);
//                 p.circle(x, baseY, 18);
//             }

//             // Texto del número
//             p.fill(palette.text);
//             p.noStroke();
//             p.text(n, x, baseY + 30);
//         }

//         // Mostrar decimal
//         p.fill(palette.text);
//         p.textSize(18);


//         // Título binario
//         p.text("Complemento a 2:", p.width / 2, baseY + 70);

//         // Mostrar cada bit con estilo
//         let bin = complementoA2(selected);
//         let bitXStart = p.width / 2 - 120;
//         for (let i = 0; i < bin.length; i++) {
//             let bit = bin[i];
//             let x = bitXStart + i * 30;
//             if (i === 0) {
//                 p.fill(palette.msb);
//                 p.textStyle(p.BOLD);
//             } else {
//                 p.fill(palette.text);
//                 p.textStyle(p.NORMAL);
//             }
//             p.text(bit, x, baseY + 100);
//         }

//         p.textStyle(p.NORMAL);
//     };

//     function complementoA2(n) {
//         if (n >= 0) {
//             return n.toString(2).padStart(8, '0');
//         } else {
//             let abs = Math.abs(n);
//             let bin = abs.toString(2).padStart(8, '0');
//             let inverted = bin.split('').map(b => b === '0' ? '1' : '0').join('');
//             let sumado = (parseInt(inverted, 2) + 1).toString(2);
//             return sumado.padStart(8, '0');
//         }
//     }

//     p.mousePressed = function () {
//         let margin = 40;
//         let spacing = (p.width - 2 * margin) / (numbers.length - 1);
//         let baseY = p.height / 2;
//         for (let i = 0; i < numbers.length; i++) {
//             let x = margin + i * spacing;
//             if (p.dist(p.mouseX, p.mouseY, x, baseY) < 15) {
//                 selected = numbers[i];
//             }
//         }
//     };
// };



// let rectaComplemento = new p5(rectaNumerica);
let rectaNumerica = (p) => {
    let selected = 0;
    let numbers = [-15, -12, -9, -6, -3, 0, 3, 6, 9, 12, 15];

    let palette = {
        bg: '#f8f9fa',
        line: '#999',
        text: '#333',
        pos: '#4ade80',
        neg: '#f87171',
        highlight: '#8b5cf6',
        stroke: '#ddd',
        msb: '#eab308'
    };

    p.setup = function () {
        // Canvas más compacto
        let canvas = p.createCanvas(800, 140);
        canvas.parent("recta-complemento-a-2");
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.textFont("monospace");
    };

    p.draw = function () {
        p.background(palette.bg);
        let margin = 40;
        let spacing = (p.width - 2 * margin) / (numbers.length - 1);
        let baseY = 45; // Subimos la recta para aprovechar más el espacio

        // Línea base
        p.stroke(palette.line);
        p.strokeWeight(2);
        p.line(margin, baseY, p.width - margin, baseY);

        for (let i = 0; i < numbers.length; i++) {
            let x = margin + i * spacing;
            let n = numbers[i];

            // Línea vertical
            p.stroke(palette.stroke);
            p.line(x, baseY - 15, x, baseY + 15);

            // Círculo
            p.noStroke();
            if (n === selected) {
                p.fill("#ffffff");
                p.stroke(palette.highlight);
                p.circle(x, baseY, 26);
                p.noStroke();
                p.fill(n < 0 ? palette.neg : palette.pos);
                p.circle(x, baseY, 18);
            } else {
                p.fill(n < 0 ? palette.neg : palette.pos);
                p.circle(x, baseY, 18);
            }

            // Texto del número
            p.fill(palette.text);
            p.noStroke();
            p.text(n, x, baseY + 28);
        }

        // Mostrar título
        p.fill(palette.text);
        p.textSize(16);
        p.text("Complemento a 2:", p.width / 2, baseY + 55);

        // Mostrar bits centrados
        let bin = complementoA2(selected);
        let bitSpacing = 30;
        let bitXStart = p.width / 2 - (bin.length * bitSpacing) / 2;
        for (let i = 0; i < bin.length; i++) {
            let bit = bin[i];
            let x = bitXStart + i * bitSpacing;
            if (i === 0) {
                p.fill(palette.msb);
                p.textStyle(p.BOLD);
            } else {
                p.fill(palette.text);
                p.textStyle(p.NORMAL);
            }
            p.text(bit, x, baseY + 85);
        }

        p.textStyle(p.NORMAL);
    };

    function complementoA2(n) {
        if (n >= 0) {
            return n.toString(2).padStart(8, '0');
        } else {
            let abs = Math.abs(n);
            let bin = abs.toString(2).padStart(8, '0');
            let inverted = bin.split('').map(b => b === '0' ? '1' : '0').join('');
            let sumado = (parseInt(inverted, 2) + 1).toString(2);
            return sumado.padStart(8, '0');
        }
    }

    p.mousePressed = function () {
        let margin = 40;
        let spacing = (p.width - 2 * margin) / (numbers.length - 1);
        let baseY = 45;
        for (let i = 0; i < numbers.length; i++) {
            let x = margin + i * spacing;
            if (p.dist(p.mouseX, p.mouseY, x, baseY) < 15) {
                selected = numbers[i];
            }
        }
    };
};

let rectaComplemento = new p5(rectaNumerica);
