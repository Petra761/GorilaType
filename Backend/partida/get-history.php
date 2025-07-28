<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Ajustar en producción

require_once '../db.php'; 

$username = isset($_GET['username']) ? $_GET['username'] : '';

if (empty($username)) {
    http_response_code(400);
    echo json_encode(['error' => 'No se ha especificado un nombre de usuario.']);
    exit;
}

try {
    // 1. Encontrar el ID del jugador
    $stmt_jugador = $pdo->prepare("SELECT id FROM Jugador WHERE username = ?");
    $stmt_jugador->execute([$username]);
    $jugador = $stmt_jugador->fetch(PDO::FETCH_ASSOC);

    if (!$jugador) {
        http_response_code(404);
        echo json_encode(['error' => 'El jugador no fue encontrado.']);
        exit;
    }
    $id_jugador = $jugador['id'];

    // 2. NUEVA CONSULTA: Obtener las estadísticas agregadas
    // Usamos COALESCE para evitar resultados NULL si no hay partidas
    $stmt_summary = $pdo->prepare(
        "SELECT 
            COUNT(*) as totalPartidas, 
            COALESCE(AVG(wpm), 0) as wpmPromedio, 
            COALESCE(AVG(acc), 0) as precisionPromedio
         FROM Partida 
         WHERE id_jugador = ?"
    );
    $stmt_summary->execute([$id_jugador]);
    $summary = $stmt_summary->fetch(PDO::FETCH_ASSOC);

    // 3. CONSULTA EXISTENTE: Obtener el historial detallado de partidas
    $stmt_history = $pdo->prepare(
        "SELECT fecha_partida, wpm, cpm, acc 
         FROM Partida 
         WHERE id_jugador = ? 
         ORDER BY fecha_partida DESC"
    );
    $stmt_history->execute([$id_jugador]);
    $history = $stmt_history->fetchAll(PDO::FETCH_ASSOC);

    // 4. Combinar todo en una única respuesta JSON
    $response_data = [
        'summary' => [
            'totalPartidas' => (int)$summary['totalPartidas'],
            'wpmPromedio' => round((float)$summary['wpmPromedio']), // Redondeamos WPM a un entero
            'precisionPromedio' => round((float)$summary['precisionPromedio'], 2) // Redondeamos precisión a 2 decimales
        ],
        'history' => $history
    ];

    http_response_code(200);
    echo json_encode($response_data);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión con la base de datos: ' . $e->getMessage()]);
}
?>