let questNumber;
let currentTest;
let currentTestName;
let isSpeaking = false;
let isAudio = true;



let nameLocalStorage = 'localStorageIvanovIvan';

function save() {
    if (typeof (Storage) !== "undefined") {
        console.log("Local Storage доступен.");
    } else {


        alert("Local Storage не поддерживается.")
        return;
    }
    let name = prompt('Введите ФИО:');

    //Создаем  объект в котором соберем ответы пользователя и сохраним время сохранения
    let object = {
        userAnswers: [],
        savedTime: null,
        testName: null
    };
    object.testName = currentTestName;
    //собирает текущие ответы
    for (let i = 1; i <= questNumber; i++) {
        let divAnswer = document.getElementById('answer' + i);
        const inputElement = divAnswer.querySelector('input[type="text"]');
        if (inputElement) { // text
            object.userAnswers[i] = inputElement.value;
        } else {


            const radioInputs = document.getElementsByName(`question${i}`);
            let index = 1;
            for (let radio of radioInputs) {
                if (radio.checked) {
                    object.userAnswers[i] = index;
                    break;
                }
                index++;
            }
        }
    }

    //в свойство объекта savedTime сохраняем текущее время
    object.savedTime = new Date();
    console.log(object)
    //сохраняем объект в ввиде JSON строки в локальном хранилище браузера
    localStorage.setItem(name, JSON.stringify(object));
    alert('Данные сохранены')

}

function load() {
    if (typeof (Storage) !== "undefined") {
        console.log("Local Storage доступен.");
    } else {


        alert("Local Storage не поддерживается.")
        return;
    }

    let name = prompt('Введите ФИО:');
    //получение JSON данных из хранилища браузера
    const temp = localStorage.getItem(name);
    console.log(temp);
    //если в переменной temp null, это означает что в хранилище нет данных с таким ключом
    if (temp != null) {
        //включаем обработку исключительной ситуации
        let object;
        try {
            //преобразование JSON данных в объект
            object = JSON.parse(temp);
            //вывод данных в консоль (для проверки работоспособности программы)
            console.log(object);
        }
        catch {
            console.error('Ошибка парсирования JSON');
            return;
        }
        changeTest(object.testName);
        for (let i = 1; i <= questNumber; i++) {
            let divAnswer = document.getElementById('answer' + i);


            const inputElement = divAnswer.querySelector('input[type="text"]');
            if (inputElement) { // text
                inputElement.value = object.userAnswers[i];
            } else {


                const radioInputs = document.getElementsByName(`question${i}`);
                let index = 1;
                for (let radio of radioInputs) {
                    if (object.userAnswers[i] == index) {
                        radio.checked = true;
                        break;
                    }
                    index++;
                }
            }
        }
    }
    else alert('Нет сохранений с таким именем')
}




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
        })

        const questionBody = document.createElement('div');
        questionBody.className = 'card-body';

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
        if (question.variants) {
            question.variants.forEach(variant => {
                const variantDiv = document.createElement('div');
                variantDiv.className = 'form-check';
                variantDiv.addEventListener('click', () => {
                    speaking(variant)
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

function check() {
    let correctCount = 0;
    //const currentTest = data[document.getElementById('display-name').innerHTML];

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
    alert(`Вы ответили правильно на ${correctCount} вопросов`);
}

document.addEventListener('DOMContentLoaded', () => {
    changeTest('test 1');
});

function changeTest(nameTest) {
    document.getElementById('display-name').innerHTML = data[nameTest].displayName;
    currentTest = data[nameTest]
    currentTestName = nameTest;
    renderQuestions(data[nameTest].questions);
}

let isAnimating = false;

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

function speakText(text) {


    //window.speechSynthesis.speak(utterance);
    if (text!==undefined && text.length>0) speakAllWithDelay(text.split('.'),0,()=>{console.log('voiced end')});
}

// Wait for voices to be loaded
window.speechSynthesis.onvoiceschanged = function () {
    speakText();
};

function stopSpeaking() {
    synth.cancel();
}

const synth = window.speechSynthesis;
let voices = [];
let selectedVoice = null;
setTimeout(populateVoiceList,2000);

function populateVoiceList() {
    voices = synth.getVoices();


    // Get available voices
    //const voices = window.speechSynthesis.getVoices();

    // Find a Russian voice
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].lang === 'ru-RU' && voices[i].name.includes('Google')) {
            selectedVoice = voices[i];
            break;
        }
    }

    // Set the selected voice if found
    // if (selectedVoice) {
    //     utterance.voice = selectedVoice;
    // }
    //console.log(voices);
  }

  function speaking(text) {
    if (isAudio)
        if (!isSpeaking)
            speakText(text);
        
        else
            stopSpeaking();
        isSpeaking = !isSpeaking;

}

function speakAllWithDelay(texts, delay = 250, callback = log) {
    if (synth.speaking) {
        synth.cancel();
        //console.error("speechSynthesis.speaking");
        //return;
    }
    if (texts && texts.length > 0) {
        setTimeout(() => {
            i = 0;
            const utterThis = new SpeechSynthesisUtterance(texts[i]);
            utterThis.voice = selectedVoice;
            utterThis.onend = function (event) {
                console.log(`speak ${i} end`);
                i++;
                if (i < texts.length) {
                    utterThis.text = texts[i];
                    synth.speak(utterThis);
                    //alert(voices)

                }
                else
                    callback();
            };
            utterThis.onerror = function (event) {
                console.error("SpeechSynthesisUtterance.onerror:" + event.error);
                return;
            };
            //speakOverUtterance(utterThis);
            utterThis.pitch = 1.2;
            utterThis.rate = 1;
            //utterThis.lang = "en-GB";
            synth.speak(utterThis);
        }, delay);


    }
}

function toggleAudio() {
    isAudio = !isAudio;
    let toggleAudio = document.getElementById('toggleAudio');
    if (isAudio) toggleAudio.innerHTML = 'Audio OFF';
    else toggleAudio.innerHTML = 'Audio ON';

}