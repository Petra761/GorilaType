<?php
header('Content-Type: application/json');
require_once '../db.php'; 

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'El nombre de usuario y la contraseña son requeridos.']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT id, username, passwd FROM Jugador WHERE username = ?");
    $stmt->execute([$username]);
    $jugador = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($jugador && $password === $jugador['passwd']) {
        echo json_encode([
            'success' => true,
            'username' => $jugador['username']
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Usuario o contraseña incorrectos.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos.']);
}
?>