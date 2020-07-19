
//DATA CONTROLLER
const dataController = (()=> {

    /* Question class
        @param: question ID: number
                category: string
                Question: string
                Possible answers: array string
                answer: string
    */

    class Question {
        constructor(id, category, question, choices, answer, answered = false) {
            this.id = id;
            this.category = category;
            this.question = question;
            this.choices = choices;
            this.answer = answer;
            this.answered = answered;
        }
    }
    
   //GET API QUESTIONS
   
   const getQuestions = async () => {
       const numQuestions = 10;
       const url = `https://opentdb.com/api.php?amount=${numQuestions}`;
       const response = await fetch(url);
       const data = await response.json();
       game.questions = [];
       game.questions = data.results.map((question, index) => {
           const correct = question.correct_answer;
           const options = [...question.incorrect_answers, correct];

           return new Question(
               index,
               question.category,
               question.question,
               options.sort(() => Math.random() - 0.5),
               correct,
               false
           )

       });
   }


    
    //Game questions + score;

    const game = {
        score: 0,
        questions: []
    }

    return {
        // check if answer is correct
        isCorrect: (choice, answer) => console.log(choice === answer),
        
        // Score methods

        getScore: () => game.score,
        
        addScore: ()=> game.score++,

        getGame: () => game,

        getQuestions: () => getQuestions(),

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
        category: 'category',

    }

    return {
        
        getDOMstrings: () => DOMstrings,

        setScore: (score, game) => {
            score.innerHTML = `Score: ${game.score}/${game.questions.length}`;

         },

         renderQuestion: (questionHTML, choicesHTML , question) => {
            questionHTML.innerHTML = `<h2><span class="question-number">${question.id+1}.</span> ${question.question}</h2>`;
            for (choice in question.choices) {
                choicesHTML.innerHTML += `<button class="answer" id="answer-${choice}">${question.choices[choice]}</button>`;
            }

         },

         renderCategory: (categoryHTML, category) => {
            categoryHTML.innerHTML = `<h2>${category}</h2>`;
         },
         
         clearCategory: (categoryHTML) => {
            categoryHTML.innerHTML = '';
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
          category = document.getElementById(DOM.category);
          
    let answersCount = 0;

    const startGame = () => {
        //Start game
        dataCtrl.getQuestions();
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
       UIctrl.renderCategory(category, game.questions[answersCount].category); 
       UIctrl.renderQuestion(question, choices, game.questions[answersCount]);
       removeNextButton();
    }

    const checkAnswer = (e) => {
        const userAnswer = e.target;
        const currentQuestion = game.questions[answersCount];
        if (!currentQuestion.answered && userAnswer.id.length > 7) {
            const correctAnswerID = `answer-${currentQuestion.choices.indexOf(currentQuestion.answer)}`;
            const correctAnswer = document.getElementById(correctAnswerID); 
            correctAnswer.classList.add(DOM.correct);

            if (correctAnswerID === userAnswer.id) {
                dataCtrl.addScore();
                UIctrl.setScore(score, game);
            } else {
                userAnswer.classList.add(DOM.wrong);
            }
            currentQuestion.answered = true;
            nextButton();
        }
    }
    const nextQuestion = () => {
        answersCount++;
        if (answersCount < game.questions.length) {
            UIctrl.clearGameBox(question, choices);
            displayQuestion();
        } else {
            UIctrl.clearGameBox(question, choices);
            UIctrl.clearCategory(category);
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

