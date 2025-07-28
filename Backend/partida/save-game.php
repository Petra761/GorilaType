<?php
header('Content-Type: application/json');

require_once '../db.php'; 

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['wpm']) || !isset($data['cpm']) || !isset($data['accuracy'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Faltan datos para guardar la partida.']);
    exit;
}

$username = $data['username'];
$wpm = (int)$data['wpm'];
$cpm = (int)$data['cpm'];
$accuracy = (float)$data['accuracy'];

try {
    $stmt_jugador = $pdo->prepare("SELECT id FROM Jugador WHERE username = ?");
    $stmt_jugador->execute([$username]);
    $jugador = $stmt_jugador->fetch(PDO::FETCH_ASSOC);

    if (!$jugador) {
        http_response_code(404);
        echo json_encode(['error' => 'El jugador especificado no fue encontrado.']);
        exit;
    }
    $id_jugador = $jugador['id'];

    $fecha_partida = date('Y-m-d H:i:s');

    $sql = "INSERT INTO Partida (id_jugador, fecha_partida, wpm, cpm, acc) VALUES (?, ?, ?, ?, ?)";
    $stmt_partida = $pdo->prepare($sql);
    
    if ($stmt_partida->execute([$id_jugador, $fecha_partida, $wpm, $cpm, $accuracy])) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Partida guardada correctamente.']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo guardar la partida en la base de datos.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión con la base de datos.']);
}
?>