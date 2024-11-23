const data = {
    'test1': [
        {
            info: ' В таблице приведена стоимость перевозок между соседними железнодорожными станциями. Укажите схему, соответствующую таблице.',
            images: ['excersices/test01/011.jpg'],
            variants: null,
            trueAnswer: '1'
        },
        {
            info: 'В таблице приведена стоимость перевозок между соседними железнодорожными станциями.',
            images: ['excersices/test01/021.jpg', 'excersices/test01/022.jpg', 'excersices/test01/023.jpg', 'excersices/test01/024.jpg'],
            info2: 'Укажите схему, соответствующую таблице.   Таблица стоимости перевозок устроена следующим образом: числа, стоящие на пресечениях строк и столбцов таблиц, означают стоимость проезда между соответствующими соседними станциями. Если пересечение строки и столбца пусто, то станции не являются соседними. Укажите таблицу, для которой выполняется условие: «Минимальная стоимость проезда из А в В не больше 6». Стоимость проезда по маршруту складывается из стоимостей проезда между соответствующими соседними станциями. ',
            variants: null,
            trueAnswer: '2'
        },
        {
            info: '2. Информационное сообщение объемом 3 Кбайта содержит 6144 символа. Сколько символов содержит алфавит, при помощи которого было записано это сообщение?',
            images: null,
            variants: ['4', '16', '8', '32'],
            trueAnswer: '4'
        },
        {
            info: `Грунтовая дорога проходит последовательно через 
                            прибрежные населенные пункты А, В, С и D. При 
                            этом длина дороги между А и В равна 15 км, между 
                            В и С — 45 км и между С и D — 20 км. Расстояние 
                            по воде между А и D 60 км и работает паромное 
                            сообщение. Оцените минимально возможное время 
                            движения велосипедиста из пункта А в пункт С, 
                            если его скорость по грунтовой дороге 20 км/час, а 
                            паром (которым можно воспользоваться) двигается 
                            со скоростью 40 км/час.`,
            images: null,
            variants: ['1,5 часа', '2 часа', '2,5 часа', '3 часа'],
            trueAnswer: '4'
        }
    ]
};

let questNumber;//глобальной переменной

function renderQuestions(questions) {
    const container = document.getElementById('questions-container');
    questNumber=0;
    questions.forEach((question, index) => {
        questNumber++;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'card mb-4';
        
        const questionHeader = document.createElement('div');
        questionHeader.className = 'card-header info';
        questionHeader.textContent = `${index + 1}: ${question.info}`;

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
            //questionInfo2.style='text-align: justify;';
            questionInfo2.textContent = `${question.info2}`;
            questionBody.appendChild(questionInfo2);
        }
        const answerDiv = document.createElement('div');
        answerDiv.className = 'card mb-4';
        answerDiv.id='answer'+questNumber;
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

function check()
{
    
    for(let i=1;i<=questNumber;i++)
    {
        let divAnswer=document.getElementById('answer'+i);
        //console.log(divAnswer);
        const inputElement = divAnswer.querySelector('input[type="text"]');
        //console.log(inputElement);
        if (inputElement) {//text

            console.log(inputElement.value);
        } else {
            const radioInputs = document.getElementsByName(`question${i}`);

            // Проходим по каждому элементу и проверяем, выбран ли он
            for (let radio of radioInputs) {
                if (radio.checked) {
                    console.log('Выбранный radio input:', radio.value);
                    break; // Выходим из цикла, так как найден выбранный радиокнопка
                }
            } 
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderQuestions(data.test1);
});
/*
function changeTest(nameTest) {
    for (let i = 0; i < data[nameTest].length; i++) {
        let question = data[nameTest][i]
        let pElement = document.createElement('p')
        pElement.innerHTML = `${i + 1}. ${question['info']}`
        //alert(pElement)
        document.getElementById('question')pElement;
    }
}


*/

