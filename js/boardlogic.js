let answersgrid, title = null;
let questionboard = document.getElementById("question_board");
let level, theme = 0;
let checkAnswer;

function setContainers() {
	title = document.getElementById("question_title");
	answersgrid = document.getElementById("answers_grid");
}

function shuffleArray(arr) {
	return arr
		.map(a => [Math.random(), a])
		.sort((a, b) => a[0] - b[0])
		.map(a => a[1]);
}

function maskAnswer(answer) {
	return answer.replace(/\d+ is/, "Is")
}

function getTheme() { //for scalability purposes
	return theme === 0? "math":"trivia";
}

async function loadData() {
	level = Number.parseInt(window.localStorage.getItem("level")) || 0;
	const questionBoardChildCount = answersgrid.childElementCount;
	const data = await fetch(`https://numbersapi.com/${level}/${getTheme()}`);
	if (data.status < 200 || data.status >= 300) return Promise.reject(data.statusText);
	const trueAnswerOrigin = await data.text();
	const trueAnswer = maskAnswer(trueAnswerOrigin);
	const mocks = await Promise.all(Array(questionBoardChildCount - 1).fill(`https://numbersapi.com/random/${getTheme()}?max=9999`).map(url => fetch(url)));
	if (mocks.some(m => m.status < 200 || data.status >= 300)) return Promise.reject(`https://numbersapi.com/random/${getTheme()}??max=9999 failed request`);
	let mock_answers = await Promise.all(mocks.map(m => m.text()));
	mock_answers = mock_answers.map(ma => maskAnswer(ma));
	const answers = shuffleArray([trueAnswer, ...mock_answers])

	checkAnswer = function (selectedAnswerIndex) { //this way i dont spread trueAnswer outside of scope, user can still google it of course, but cmon...
		questionboard.classList.add("disable_pointer_events");
		const selectedDiv = answersgrid.children[selectedAnswerIndex];
		const selectedAnswer = selectedDiv.textContent; //these could be collapsed into a one line expression but i wanna keep it readable
		const correct = selectedAnswer === trueAnswer;
		const correctIndex = answers.indexOf(trueAnswer);
		const correctDiv = correct ? selectedDiv : answersgrid.children[correctIndex];
		correctDiv.classList.remove("right_answer"); //just in case
		correctDiv.classList.add("right_answer")
		if (!correct) {
			selectedDiv.classList.remove("wrong_answer"); //just in case
			selectedDiv.classList.add("wrong_answer");
		}
		window.localStorage.setItem("level", correct ? level + 1 : 0)
		setTimeout(() => {
			loadData().then(([level, answers]) => {
				rebuildboard();
				loadDataIntoBoard(level, answers);
			})
		}, 1000);
		return correct;
	}

	return Promise.resolve([level, answers]);
}

async function loadDataIntoBoard(level, answers) {
	answers.forEach((answer, i) => {
		answersgrid.children[i].textContent = answer;
	});
	title.textContent = level;
	title.classList.add("title_animation");
	answersgrid.classList.add("answers_animation");
}

function rebuildboard() {
	questionboard.parentNode.replaceChild(originalQuestionBoard.cloneNode(true), questionboard);
	questionboard = document.getElementById("question_board");;
	setContainers();
}

function answerClick(index) {
	checkAnswer(index)
}

function changeTheme(span) { //i could use booleans but i might want to add more themes later on so...
	theme = theme === 0 ? 1 : 0;
	span.textContent = theme === 0 ? "Switch to Trivia" : "Switch to Math";
	rebuildboard();
	loadData().then(([level, answers]) => {
		loadDataIntoBoard(level, answers);
	});
}

const originalQuestionBoard = questionboard.cloneNode(true);
setContainers();
loadData().then(([level, answers]) => {
	loadDataIntoBoard(level, answers);
})