
<?php
header('Content-Type: application/json');

require_once '../db.php'; 

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || empty(trim($data['username'])) || !isset($data['password']) || empty($data['password'])) {
    http_response_code(400); 
    echo json_encode(['error' => 'El nombre de usuario y la contraseña no pueden estar vacíos.']);
    exit;
}

$username = trim($data['username']);
$password = $data['password'];

try {
    $stmt = $pdo->prepare("SELECT id FROM Jugador WHERE username = ?");
    $stmt->execute([$username]);
    
    if ($stmt->fetch()) {
        http_response_code(409); 
        echo json_encode(['error' => 'El nombre de usuario ya está en uso. Por favor, elige otro.']);
        exit;
    }

    $sql = "INSERT INTO Jugador (username, passwd) VALUES (?, ?)";
    $stmt = $pdo->prepare($sql);
    
    if ($stmt->execute([$username, $password])) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'username' => $username
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo registrar al usuario en la base de datos.']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la conexión con la base de datos.']);
}
?>
