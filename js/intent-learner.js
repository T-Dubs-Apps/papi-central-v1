// intent-learner.js
// Scans for unfinished projects, asks user intent, learns from answers and outcomes

const scanBtn = document.getElementById('scanBtn');
const projectList = document.getElementById('projectList');
const questionBox = document.getElementById('questionBox');
const resultBox = document.getElementById('resultBox');
const statusDiv = document.getElementById('status');

let unfinishedProjects = [];
let learningLog = JSON.parse(localStorage.getItem('intentLearnerLog') || '[]');

// Simulate scanning for unfinished projects (in real app, use backend or Node.js bridge)
function scanForProjects() {
  // Demo: Pretend to find some projects
  unfinishedProjects = [
    { name: 'Weather App', path: 'projects/weather-app', status: 'incomplete' },
    { name: 'Chatbot', path: 'projects/chatbot', status: 'incomplete' },
    {
      name: 'Portfolio Site',
      path: 'projects/portfolio',
      status: 'incomplete',
    },
  ];
  renderProjectList();
}

function renderProjectList() {
  if (!unfinishedProjects.length) {
    projectList.innerHTML = '<div>No unfinished projects found.</div>';
    return;
  }
  projectList.innerHTML =
    '<b>Unfinished Projects:</b><ul>' +
    unfinishedProjects
      .map(
        (p, i) =>
          `<li><button class='text-blue-400 underline' onclick='selectProject(${i})'>${p.name}</button></li>`
      )
      .join('') +
    '</ul>';
}

window.selectProject = function (idx) {
  const project = unfinishedProjects[idx];
  askIntentQuestion(project);
};

function askIntentQuestion(project) {
  questionBox.innerHTML = `<div class='mb-2'>Do you want to finish <b>${project.name}</b>? <button id='yesBtn' class='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded ml-2'>Yes</button> <button id='noBtn' class='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-2'>No</button></div>`;
  document.getElementById('yesBtn').onclick = () => handleAnswer(project, true);
  document.getElementById('noBtn').onclick = () => handleAnswer(project, false);
}

function handleAnswer(project, answer) {
  // Learn from answer
  const entry = {
    project: project.name,
    path: project.path,
    answer: answer ? 'yes' : 'no',
    timestamp: new Date().toISOString(),
  };
  learningLog.push(entry);
  localStorage.setItem('intentLearnerLog', JSON.stringify(learningLog));
  // Simulate task and outcome
  let outcome = '';
  if (answer) {
    outcome = `Started finishing <b>${project.name}</b>. (Demo: Implement project finisher logic here)`;
  } else {
    outcome = `Skipped <b>${project.name}</b>.`;
  }
  resultBox.innerHTML = outcome;
  questionBox.innerHTML = '';
  // Learn from outcome (demo: just log)
  entry.outcome = outcome;
  localStorage.setItem('intentLearnerLog', JSON.stringify(learningLog));
  statusDiv.textContent = 'Learning log updated.';
}

scanBtn.onclick = scanForProjects;

// Optionally, expose for integration with PAPI Central or PAPI O/S
window.intentLearner = {
  scanForProjects,
  learningLog,
};
