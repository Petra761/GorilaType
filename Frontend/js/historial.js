document.addEventListener('DOMContentLoaded', () => {
    const playerNameEl = document.getElementById('playerName');
    const totalPartidasEl = document.getElementById('totalPartidas');
    const wpmPromedioEl = document.getElementById('wpmPromedio');
    const precisionPromedioEl = document.getElementById('precisionPromedio');
    const matchListEl = document.getElementById('matchList');
    const noMatchesMessageEl = document.getElementById('noMatchesMessage');

    
    //Obtener el nombre del usuario de la sesión
    const loggedInUser = sessionStorage.getItem('loggedInUser');

    //Redirigir si no hay un usuario logueado
    if (!loggedInUser) {
        alert("Necesitas iniciar sesión para ver tu historial.");
        window.location.href = 'index.html';
        return; // Detiene la ejecución del script
    }

    // Mostrar el nombre del jugador en el título
    playerNameEl.textContent = loggedInUser;

    /**
     * Obtiene los datos del historial y las estadísticas desde el backend
     * y llama a la función para mostrarlos.
     */
    async function fetchAndDisplayData() {
        try {
            const url = `/GorilaType/backend/partida/get-history.php?username=${loggedInUser}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            displaySummary(data.summary);
            displayHistory(data.history);

        } catch (error) {
            console.error("Error al cargar el historial:", error);
            noMatchesMessageEl.textContent = "No se pudo cargar el historial. Inténtalo de nuevo más tarde.";
            noMatchesMessageEl.style.display = 'block';
        }
    }

    /**
     * Muestra las estadísticas de resumen en la página.
     * @param {object} summary - El objeto con las estadísticas precalculadas.
     */
    function displaySummary(summary) {
        totalPartidasEl.textContent = summary.totalPartidas;
        wpmPromedioEl.textContent = summary.wpmPromedio;
        precisionPromedioEl.textContent = `${summary.precisionPromedio}%`;
    }

    /**
     * Renderiza la lista de partidas en el DOM.
     * @param {Array} history - El array de partidas individuales.
     */
    function displayHistory(history) {
        if (history.length === 0) {
            noMatchesMessageEl.style.display = 'block';
            matchListEl.style.display = 'none';
            return;
        }

        matchListEl.innerHTML = ''; 

        history.forEach(partida => {
            const matchItem = document.createElement('div');
            matchItem.className = 'match-item';

            // Formatear la fecha para que sea más legible por el usuario
            const fecha = new Date(partida.fecha_partida).toLocaleString('es-ES', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            matchItem.innerHTML = `
                <div class="match-details">
                    <span class="match-wpm">WPM: ${partida.wpm}</span>
                    <span class="match-cpm">CPM: ${partida.cpm}</span>
                    <span class="match-accuracy">Precisión: ${partida.acc}%</span>
                </div>
                <div class="match-date">${fecha}</div>
            `;
            matchListEl.appendChild(matchItem);
        });
    }

    fetchAndDisplayData();
});