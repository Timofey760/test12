<?php
// Функция логирования
function logMessage($message, $level = 'INFO') {
    $logFile = 'app.log';
    $logEntry = date('Y-m-d H:i:s') . " [$level] $message\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}

logMessage("start save");

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
        throw new Exception("Invalid JSON data");
    }

    if (!isset($data['name']) || !isset($data['test_name']) || !isset($data['saved_time']) || !isset($data['user_answers'])) {
        throw new Exception("Missing required fields");
    }

    $name = $data['name'];
    $test_name = $data['test_name'];
    $saved_time = date("Y-m-d H:i:s", strtotime($data['saved_time']));
    $user_answers = json_encode([$data['user_answers']]);

    logMessage('all work!');

    // Формируем SQL-запрос
    $sql = "INSERT INTO tests (name, test_name, user_answers, saved_time, count_correct) VALUES ('$name', '$test_name', '$user_answers', '$saved_time', '$count_correct')";

    if ($conn->query($sql) === TRUE) {
        logMessage("Данные успешно сохранены");
        echo "Данные успешно сохранены";
      
    } else {
        throw new Exception("Ошибка при сохранении данных: " . $conn->error);
    }

    $conn->close();
} catch (Exception $e) {
    logMessage($e->getMessage(), "ERROR");
    echo json_encode(["message" => $e->getMessage()]);
}
?>