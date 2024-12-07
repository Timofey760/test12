let questNumber;
let currentTest;
let isSpeaking = false;

function speaking(text) {
    if (!isSpeaking)
        speakText(text);
    else
        stopSpeaking();
    isSpeaking = !isSpeaking;
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
    currentTest=data[nameTest]
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
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU'; // Set language to Russian

    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    // Find a Russian voice
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].lang === 'ru-RU' && voices[i].name.includes('Google')) {
            selectedVoice = voices[i];
            break;
        }
    }

    // Set the selected voice if found
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
}

// Wait for voices to be loaded
window.speechSynthesis.onvoiceschanged = function () {
    speakText();
};

function stopSpeaking() {
    window.speechSynthesis.cancel();
}
