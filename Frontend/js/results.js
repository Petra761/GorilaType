document.addEventListener('DOMContentLoaded', () => {
    const wpmValueEl = document.getElementById('wpmValue');
    const cpmValueEl = document.getElementById('cpmValue');
    const accuracyValueEl = document.getElementById('accuracyValue');

    // Recuperar los resultados del localStorage
    const results = JSON.parse(localStorage.getItem('typingTestResults'));

    if (results) {
        // Actualizar los elementos con los valores guardados
        wpmValueEl.textContent = results.wpm;
        cpmValueEl.textContent = results.cpm;
        accuracyValueEl.textContent = `${results.accuracy}%`;
    } else {
        // Mostrar valores por defecto si no se encuentran resultados
        wpmValueEl.textContent = 'N/A';
        cpmValueEl.textContent = 'N/A';
        accuracyValueEl.textContent = 'N/A';
    }

    // El botón de reinicio ahora es un enlace <a>,
    // por lo que no necesita un event listener de JavaScript para la navegación.
});