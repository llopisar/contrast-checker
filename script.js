const inputFondo = document.getElementById('colorFondo');
const inputTexto = document.getElementById('colorTexto');
const preview = document.getElementById('preview');
const resultado = document.getElementById('resultado');
const toggleTema = document.getElementById('toggleTema');
const toggleIcon = document.getElementById('toggleIcon');

function actualizarVista() {
    const colorFondo = inputFondo.value;
    const colorTexto = inputTexto.value;

    preview.style.backgroundColor = colorFondo;
    preview.style.color = colorTexto;

    const contraste = calcularContraste(colorFondo, colorTexto).toFixed(2);
    let nivel = '';

    if (contraste >= 7) {
        nivel = '✅ AAA (excelente)';
    } else if (contraste >= 4.5) {
        nivel = '✅ AA (aceptable)';
    } else if (contraste >= 3) {
        nivel = '⚠️ Solo AA para texto grande';
    } else {
        nivel = '❌ Contraste insuficiente';
    }

    resultado.textContent = `Ratio: ${contraste} — ${nivel}`;

}

inputFondo.addEventListener('input', actualizarVista);
inputTexto.addEventListener('input', actualizarVista);


actualizarVista();


function hexToRgb(hex) {
    const r = parseInt(hex.substr(1, 2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;
    return [r, g, b];
}


function canalLineal(c) {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}


function calcularLuminancia([r, g, b]) {
    const R = canalLineal(r);
    const G = canalLineal(g);
    const B = canalLineal(b);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}


function calcularContraste(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const lum1 = calcularLuminancia(rgb1);
    const lum2 = calcularLuminancia(rgb2);

    const L1 = Math.max(lum1, lum2);
    const L2 = Math.min(lum1, lum2);

    const ratio = (L1 + 0.05) / (L2 + 0.05);
    return ratio;
}


if (localStorage.getItem('tema') === 'oscuro') {
  document.body.classList.add('tema-oscuro');
  toggleTema.checked = true;
  toggleIcon.textContent = '🌞';
} else {
  toggleIcon.textContent = '🌙';
}

toggleTema.addEventListener('change', () => {
  const oscuro = toggleTema.checked;
  document.body.classList.toggle('tema-oscuro', oscuro);
  localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro');
  toggleIcon.textContent = oscuro ? '🌞' : '🌙';
});

const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const inputId = btn.getAttribute('data-target');
    const input = document.getElementById(inputId);
    const hex = input.value;

    navigator.clipboard.writeText(hex).then(() => {
      const original = btn.textContent;
      btn.textContent = 'Copied ✅';
      setTimeout(() => {
        btn.textContent = original;
      }, 1500);
    });
  });
});

