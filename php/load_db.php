<?php
// Функция логирования
function logMessage($message, $level = 'INFO') {
    $logFile = 'app.log';
    $logEntry = date('Y-m-d H:i:s') . " [$level] $message\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

logMessage("start retrieval");

// Подключение к базе данных
$servername = "localhost";
$username = "host1340522_kurin";
$password = "123456";
$dbname = "host1340522_kurin";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Получаем данные из POST-запроса
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        logMessage("Invalid JSON data","Error");
        throw new Exception("Invalid JSON data");
    }

    if (!isset($data['name']) || !isset($data['test_name'])) {
        logMessage("Missing required field: name or test_name","Error");
        throw new Exception("Missing required field: name or test_name");
    }

    $name = $data['name'];
    $test_name=$data['test_name'];

    logMessage('Retrieving latest record for name: ' . $name);

    // Подготавливаем SQL-запрос с использованием подготовленных выражений
    $stmt = $conn->prepare("SELECT * FROM tests WHERE name = ? and test_name = ? ORDER BY saved_time DESC LIMIT 1");
    $stmt->bind_param("ss", $name, $test_name);    

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            logMessage("Latest record retrieved successfully");
            echo json_encode($row);
        } else {
            logMessage("No records found for the given name","Error");
            //echo json_encode("");
            throw new Exception("No records found for the given name");
        }
    } else {
        logMessage("Error retrieving data: " . $stmt->error,"Error");
        throw new Exception("Error retrieving data: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    logMessage($e->getMessage(), "ERROR");
    echo json_encode(["message" => $e->getMessage()]);
}
?>
