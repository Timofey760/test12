// Объявление переменных для хранения номера вопроса, текущего теста, имени теста, состояния воспроизведения и аудио
let questNumber;
let currentTest;
let currentTestName;
let isSpeaking = false;
let isAudio = true;
let correctCount = 0;

// Имя для локального хранилища
let nameLocalStorage = 'localStorageIvanovIvan';

async function loadDB() {
    let name = prompt('Введите ФИО:');
    try {
        const response = await fetch('php/load_db.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name ,test_name:currentTestName})
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');

        }

        const result = await response.json();
        //const data = await response.text();
        console.log('Retrieved data:', result);
        result.user_answers=JSON.parse(result.user_answers);
        setAnswers(result);
        

        
        
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
}

function saveDB() {
//    alert('Введит ФИО');
    Swal.fire({
        title: 'Введите ФИО:',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Подтвердить',
        showLoaderOnConfirm: true,
        preConfirm: (name) => {
            if (!name) {
                Swal.showValidationMessage(`Пожалуйста, введите ФИО`);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        console.log(result.value);
        if (result.isConfirmed) {
            // Формируем JSON    
            const data = {
                name: result.value,
                test_name: currentTestName,
                saved_time: new Date(),
                user_answers: [],
                count_correct: correctCount
            };
            getUserAnswers(data);
            // Отправляем данные на сервер
            fetch('php/save_db.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.text)
                .then(data => {
                    console.log('Success:', data);                
                    Swal.fire({
                        title: "Ура!",
                        text: "Данные успешно отправлены!",
                        icon: "success"
                    });
                })
                .catch((error) => {
                    console.error('Error:', error);
                    Swal.fire({
                        title: "Ошибка",
                        text: "Ошибка при отправке данных!",
                        icon: "error"
                    });
                });
        }
    }
    );
}


function getUserAnswers(object) {
    console.log(object);
    // Сбор текущих ответов пользователя
    for (let i = 1; i <= questNumber; i++) {
        let divAnswer = document.getElementById('answer' + i);
        const inputElement = divAnswer.querySelector('input[type="text"]');
        if (inputElement) { // text
            object.user_answers[i] = inputElement.value;
        } else {
            const radioInputs = document.getElementsByName(`question${i}`);
            let index = 1;
            for (let radio of radioInputs) {
                if (radio.checked) {
                    object.user_answers[i] = index;
                    break;
                }
                index++;
            }
        }
    }
}

// Функция для сохранения данных в локальное хранилище браузера
function save() {
    // Проверка поддержки локального хранилища
    if (typeof (Storage) !== "undefined") {
        console.log("Local Storage доступен.");
    } else {
        SweetAlert("Local Storage не поддерживается.")
        return;
    }

    // Запрос имени пользователя
    //let name = prompt('Введите ФИО:');


    Swal.fire({
        title: 'Введите ФИО:',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Подтвердить',
        showLoaderOnConfirm: true,
        preConfirm: (name) => {
            if (!name) {
                Swal.showValidationMessage(`Пожалуйста, введите ФИО`);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            let name = result.value;
            // Здесь вы можете использовать переменную name
            console.log('Введенное ФИО:', name);
            // Создание объекта для хранения ответов пользователя и времени сохранения
            let object = {
                user_answers: [],
                savedTime: null,
                testName: null
            };
            object.testName = currentTestName;



            // Сохранение текущего времени в объект
            object.savedTime = new Date();
            console.log(object);
            getUserAnswers(object);
            // Сохранение объекта в локальное хранилище в виде JSON строки
            localStorage.setItem(name, JSON.stringify(object));
            SweetAlert('Данные сохранены');


        }
    });






}

// Функция для загрузки данных из локального хранилища
function load() {
    // Проверка поддержки локального хранилища
    if (typeof (Storage) !== "undefined") {
        console.log("Local Storage доступен.");
    } else {
        SweetAlert("Local Storage не поддерживается.")
        return;
    }

    // Запрос имени пользователя
    let name = prompt('Введите ФИО:');

    // Получение JSON данных из хранилища
    const temp = localStorage.getItem(name);
    console.log(temp);

    // Проверка наличия данных в хранилище
    if (temp != null) {
        let object;
        try {
            // Преобразование JSON данных в объект
            object = JSON.parse(temp);
            
            console.log(object);
        }
        catch {
            console.error('Ошибка парсирования JSON');
            return;
        }

        // Изменение теста на сохраненный
        changeTest(object.testName);
        setAnswers(object);

    }
    else SweetAlert('Нет сохранений с таким именем');
}

function setAnswers(object) {
    // Восстановление ответов пользователя
    console.log(object.user_answers)
    for (let i = 1; i <= questNumber; i++) {
        console.log(object.user_answers[i]);
        let divAnswer = document.getElementById('answer' + i);
        const inputElement = divAnswer.querySelector('input[type="text"]');
        if (inputElement) { // text
            console.log(object.user_answers[i]);
            inputElement.value = object.user_answers[i];
        } else {
            const radioInputs = document.getElementsByName(`question${i}`);
            let index = 1;
            for (let radio of radioInputs) {
                if (object.user_answers[i] == index) {
                    radio.checked = true;
                    break;
                }
                index++;
            }
        }
    }
}

// Функция для отображения вопросов
function renderQuestions(questions) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    questNumber = 0;
    questions.forEach((question, index) => {
        questNumber++;
        const questionDiv = document.createElement('div');
        questionDiv.id = 'question' + questNumber;
        questionDiv.className = 'card mb-4';
        questionDiv.style = 'border-radius:30px';

        const questionHeader = document.createElement('div');
        questionHeader.className = 'card-header info';
        questionHeader.textContent = `${index + 1}: ${question.info}`;
        questionHeader.addEventListener('click', () => {
            speaking(questionHeader.textContent);
        });

        const questionBody = document.createElement('div');
        questionBody.className = 'card-body';

        // Добавление изображений, если они есть
        if (question.images && question.images.length > 0) {
            const imagesDiv = document.createElement('div');
            imagesDiv.className = 'mb-3';
            question.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.className = 'img-fluid mb-2';
                imagesDiv.appendChild(img);
            });
            questionBody.appendChild(imagesDiv);
        }

        // Добавление дополнительной информации, если она есть
        if (question.info2) {
            const questionInfo2 = document.createElement('div');
            questionInfo2.className = 'info2';
            questionInfo2.textContent = `${question.info2}`;
            questionBody.appendChild(questionInfo2);
            questionInfo2.addEventListener('click', () => {
                speaking(questionInfo2.textContent);
            });
        }

        if (question.info3) {
            const questionInfo3 = document.createElement('div');
            questionInfo3.className = 'info2';
            questionInfo3.textContent = `${question.info3}`;
            questionBody.appendChild(questionInfo3);
            questionInfo3.addEventListener('click', () => {
                speaking(questionInfo3.textContent);
            });
        }

        const answerDiv = document.createElement('div');
        answerDiv.className = 'card mb-4';
        answerDiv.id = 'answer' + questNumber;

        // Добавление вариантов ответов, если они есть
        if (question.variants) {
            question.variants.forEach(variant => {
                const variantDiv = document.createElement('div');
                variantDiv.className = 'form-check';
                variantDiv.addEventListener('click', () => {
                    speaking(variant);
                });

                const variantInput = document.createElement('input');
                variantInput.className = 'form-check-input';
                variantInput.type = 'radio';
                variantInput.name = `question${questNumber}`;
                variantInput.value = variant;

                const variantLabel = document.createElement('label');
                variantLabel.className = 'form-check-label';
                variantLabel.textContent = variant;

                variantDiv.appendChild(variantInput);
                variantDiv.appendChild(variantLabel);
                answerDiv.appendChild(variantDiv);
            });
        } else {
            // Добавление текстового поля для ввода ответа
            const textInput = document.createElement('input');
            textInput.className = 'form-control';
            textInput.type = 'text';
            textInput.placeholder = 'Enter your answer';
            textInput.name = `question${index}`;
            answerDiv.appendChild(textInput);
        }

        questionBody.appendChild(answerDiv);
        questionDiv.appendChild(questionHeader);
        questionDiv.appendChild(questionBody);

        container.appendChild(questionDiv);
    });
}

// Функция для проверки ответов
function check() {
    
    for (let i = 1; i <= questNumber; i++) {
        let divAnswer = document.getElementById('answer' + i);
        let divQuestion = document.getElementById('question' + i);

        const inputElement = divAnswer.querySelector('input[type="text"]');
        if (inputElement) { // text
            if (currentTest.questions[i - 1].trueAnswer == inputElement.value) {
                divQuestion.style.border = '3px solid #00C584';
                correctCount++;
            } else {
                divQuestion.style.border = '3px solid red';
            }
        } else {
            const radioInputs = document.getElementsByName(`question${i}`);
            let index = 1;
            for (let radio of radioInputs) {
                if (radio.checked) {
                    if (index == currentTest.questions[i - 1].trueAnswer) {
                        correctCount++;
                        divQuestion.style.border = '3px solid #00C584';
                    } else {
                        divQuestion.style.border = '3px solid red';
                    }
                    break;
                }
                index++;
            }
        }
    }
    SweetAlert(`Вы ответили правильно на ${correctCount} вопросов`);
}

// Обработчик события загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    changeTest('test 1');
});

// Функция для смены теста
function changeTest(nameTest) {
    document.getElementById('display-name').innerHTML = data[nameTest].displayName;
    currentTest = data[nameTest];
    currentTestName = nameTest;
    renderQuestions(data[nameTest].questions);
}

let isAnimating = false;

// Функция для переключения анимации
function toggleAnimation() {
    const body = document.body;
    if (isAnimating) {
        body.style.animation = 'none';
        toggleButton.textContent = 'Start Animation';
    } else {
        body.style.animation = 'gradient 15s ease infinite';
        toggleButton.textContent = 'Stop Animation';
    }
    isAnimating = !isAnimating;
}

// Функция для озвучивания текста
function speakText(text) {
    if (text !== undefined && text.length > 0) speakAllWithDelay(text.split('.'), 0, () => { console.log('voiced end') });
}

// Обработчик события изменения голосов
window.speechSynthesis.onvoiceschanged = function () {
    speakText();
};

// Функция для остановки озвучивания
function stopSpeaking() {
    synth.cancel();
}

const synth = window.speechSynthesis;
let voices = [];
let selectedVoice = null;
setTimeout(populateVoiceList, 2000);

// Функция для заполнения списка голосов
function populateVoiceList() {
    voices = synth.getVoices();

    // Поиск русского голоса
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].lang === 'ru-RU' && voices[i].name.includes('Google')) {
            selectedVoice = voices[i];
            break;
        }
    }
}

// Функция для озвучивания текста
function speaking(text) {
    if (isAudio)
        if (!isSpeaking)
            speakText(text);
        else
            stopSpeaking();
    isSpeaking = !isSpeaking;
}

// Функция для озвучивания текста с задержкой
function speakAllWithDelay(texts, delay = 250, callback = log) {
    if (synth.speaking) {
        synth.cancel();
    }
    if (texts && texts.length > 0) {
        setTimeout(() => {
            let i = 0;
            const utterThis = new SpeechSynthesisUtterance(texts[i]);
            utterThis.voice = selectedVoice;
            utterThis.onend = function (event) {
                console.log(`speak ${i} end`);
                i++;
                if (i < texts.length) {
                    utterThis.text = texts[i];
                    synth.speak(utterThis);
                }
                else
                    callback();
            };
            utterThis.onerror = function (event) {
                console.error("SpeechSynthesisUtterance.onerror:" + event.error);
                return;
            };
            utterThis.pitch = 1.2;
            utterThis.rate = 1;
            synth.speak(utterThis);
        }, delay);
    }
}

// Функция для переключения аудио
function toggleAudio() {
    isAudio = !isAudio;
    let toggleAudio = document.getElementById('toggleAudio');
    if (isAudio) toggleAudio.innerHTML = 'Audio OFF';
    else toggleAudio.innerHTML = 'Audio ON';
}
