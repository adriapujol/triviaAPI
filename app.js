
//DATA CONTROLLER
const dataController = (()=> {

    /* Question class
        @param: question ID: number
                Question: string
                Possible answers: array string
                answer: string
    */

    class Question {
        constructor(id, question, choices, answer, answered = false) {
            this.id = id;
            this.question = question;
            this.choices = choices;
            this.answer = answer;
            this.answered = answered;
        }
    }
    

    //Create questions

    const question1 = new Question(1, 'For how long can a snail sleep?', ['12 hours', '1 week', '6 months', '3 years'], '3 years');
    const question2 = new Question(2, 'How many penises does a shark have?', ['2', '1', '69', 'What is a penis?'], '2');
    const question3 = new Question(3, "Where is the heart of a shrimp located?", ['Chest', 'Head', 'Body', 'Penis'], 'Head');
    const question4 = new Question(4, "How many noses does a slug have?", ["1", "4", "3", "0"], "4");
    const question5 = new Question(5, 'Which one is bigger?', ["Ostrich's eye", "Ostrich's brain"], "Ostrich's eye");
    const question6 = new Question(6, "What is a rhino's horn made of?", ['Ivori', 'Hair', 'You dreams and hopes', 'Definetly a penis'], 'Hair');
    const question7 = new Question(7, 'Can a kangaroo fart?', ['Yes', 'No', 'Only after eating Taco Bell'], 'No');
    const question8 = new Question(8, "How many vaginas does female Koala Bears have?", ["1", "2", "0", "4"], "2");
    const question9 = new Question(9, 'Are dolphins the worst?', ['Yes! F*ck those rapist!', 'Not at all', 'Flipper was good so they are cool', 'Flipper sucks too'], 'Yes! F*ck those rapist!');
    const question10 = new Question(10, "What is the take away of this?", ["No idea, I have the brain of an ostrich", "F*ck the dolphins", "Rhino's horns are lame", "Sharks and female Koalas are a perfect match"], "Sharks and female Koalas are a perfect match");

    
    //Game questions + score;

    const game = {
        score: 0,
        questions: [question1, question2, question3, question4, question5, question6, question7, question8, question9, question10],
    }

    return {
        // check if answer is correct
        isCorrect: (choice, answer) => console.log(choice === answer),
        
        // Score methods

        getScore: () => game.score,
        
        addScore: ()=> game.score++,

        getGame: () => game,

    }

})();


// UI CONTROLLER

const UIController = (()=> {


    //DOM strings to share

    const DOMstrings = {
        btnStart: 'start',
        btnNext: 'next',
        gameBox: 'game-box',
        question: 'question',
        choices: 'answers',
        answer: 'answer',
        hide: 'hide',
        scoreboard: 'scoreboard',
        score: 'score',
        countdown: 'countdown',
        correct: 'correct',
        wrong: 'wrong',
        final: 'final',

    }

    return {
        
         getDOMstrings: () => DOMstrings,

        //  setGame: (gameBox, game) => {
        //     gameBox.innerHTML = `<div class="scoreboard">
        //                             <div class="countdown" id="countdown"></div>
        //                             <div class="score">${game.score}/${game.questions.length}</div>
        //                         </div>
        //                         <div class="question" id="question">
        //                         now let's see
        //                         </div>
        //                         <div class="answers" id="answers">
        //                                 <!-- <button class="answer">Answer 1</button>
        //                                 <button class="answer">Answer 2</button>
        //                                 <button class="answer">Answer 3</button>
        //                                 <button class="answer">Answer 4</button> -->
        //                         </div>
        //                         <button class="control next hide" id="next">Next</button>`

        //  },

        setScore: (score, game) => {
            score.innerHTML = `Score: ${game.score}/${game.questions.length}`;

         },

         renderQuestion: (questionHTML, choicesHTML , question) => {
            questionHTML.innerHTML = `<h2>${question.question}</h2>`;
            for (choice in question.choices) {
                choicesHTML.innerHTML += `<button class="answer" id="answer-${choice}">${question.choices[choice]}</button>`;
            }

         },

         clearGameBox: (questionHTML, choicesHTML) => {
             questionHTML.innerHTML = '';
             choicesHTML.innerHTML = '';
         },



    }


})();

//APP CONTROLLER

const controller = ((dataCtrl, UIctrl)=> {

    const DOM = UIctrl.getDOMstrings(),
          game = dataCtrl.getGame(),
          gameBox = document.getElementById(DOM.gameBox),
          btnStart = document.getElementById(DOM.btnStart),
          score = document.getElementById(DOM.score),
          question = document.getElementById(DOM.question),
          choices = document.getElementById(DOM.choices),
          final = document.getElementById(DOM.final),
          btnNext = document.getElementById(DOM.btnNext);
          
    let answersCount = 0;

    const startGame = () => {
        //Start game
        btnStart.addEventListener('click', renderGame);
        choices.addEventListener('click', checkAnswer);
        btnNext.addEventListener('click', nextQuestion);

    }

    //
    const renderGame = () => {
        resetGame();
        btnStart.classList.add(DOM.hide);
        gameBox.classList.remove(DOM.hide);
        UIctrl.setScore(score, game);
        displayQuestion();
    }


    const displayQuestion = () => {
       UIctrl.renderQuestion(question, choices, game.questions[answersCount]);
       removeNextButton();
    }

    const checkAnswer = (e) => {
        let userAnswer = e.target;
        let currentQuestion = game.questions[answersCount];
        if (!currentQuestion.answered) {
            if (userAnswer.textContent === currentQuestion.answer) {
                userAnswer.classList.add(DOM.correct);
                dataCtrl.addScore();
                UIctrl.setScore(score, game);
                currentQuestion.answered = true;
            } else {
                userAnswer.classList.add(DOM.wrong);
                currentQuestion.answered = true;
            }
        }
        nextButton();
    }
    const nextQuestion = () => {
        answersCount++;
        if (answersCount < game.questions.length) {
            UIctrl.clearGameBox(question, choices);
            displayQuestion();
        } else {
            UIctrl.clearGameBox(question, choices);
            removeNextButton();
            endGame();
        }
    }

    const resetGame = () => {
        answersCount = 0;
        game.score = 0;
        final.classList.add(DOM.hide);
        let span = document.getElementById('before-score');
        if (span !== null) {
            span.remove();
        }
        for (item in game.questions) {
            game.questions[item].answered = false;
        }
    }

    const endGame = () => {
        final.classList.remove(DOM.hide);
        let span = document.createElement('span');
        const bestScore = game.questions.length;

        if(game.score < bestScore/2) {
            span.innerHTML = "That wasn't that impressive";
        } else if ( game.score === bestScore) {
            span.innerHTML = "Nailed it! High five!";
        } else {
            span.innerHTML = "Not bad at all";
        }
        span.className = 'before-score';
        span.id = 'before-score';
        score.parentNode.insertBefore(span, score);
        btnStart.classList.remove(DOM.hide);
    }

    const nextButton = () => {
        btnNext.classList.remove(DOM.hide);
    }
    const removeNextButton = () => {
        btnNext.classList.add(DOM.hide);
    }  


    return {
        init: function() {
           startGame();
        }
    }

})(dataController, UIController);

controller.init();

