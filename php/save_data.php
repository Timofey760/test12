<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fio = htmlspecialchars($_POST['fio']);
    $comments = htmlspecialchars($_POST['comments']);
    $datetime = date("Y-m-d H:i:s");

    // Путь к файлу для сохранения данных
    $file = 'data.txt';

    // Открываем файл для записи в режиме добавления
    $handle = fopen($file, 'a');

    if ($handle) {
        // Записываем данные в файл
        fwrite($handle, $datetime . " - ФИО: " . $fio . ", Комментарий: " . $comments . "\n");
        fclose($handle);
        echo "Данные успешно сохранены!";
    } else {
        echo "Ошибка при открытии файла.";
    }
}
?>
