// scripts.js

// ----------------- TO-DO LIST -----------------
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('studentDashboardTasks')) || [];

function saveTasks() {
  localStorage.setItem('studentDashboardTasks', JSON.stringify(tasks));
}

function renderTasks() {
  todoList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between';

    const label = document.createElement('label');
    label.className = 'flex items-center space-x-2 cursor-pointer flex-grow';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'form-checkbox h-5 w-5 text-primary';
    checkbox.addEventListener('change', () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = task.completed ? 'line-through text-gray-400' : 'text-[var(--text-color)]';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.className = 'text-red-500 hover:text-red-700 ml-3 focus:outline-none';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    label.appendChild(checkbox);
    label.appendChild(span);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

addTodoBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
    todoInput.value = '';
    todoInput.focus();
  }
});

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTodoBtn.click();
  }
});

renderTasks();


// ----------------- FLASHCARDS -----------------
const flashcard = document.getElementById('flashcard');
const flashcardInner = document.getElementById('flashcard-inner');
const flashcardFront = document.getElementById('flashcard-front');
const flashcardBack = document.getElementById('flashcard-back');
const flashcardForm = document.getElementById('flashcard-form');
const flashcardFrontInput = document.getElementById('flashcard-front-input');
const flashcardBackInput = document.getElementById('flashcard-back-input');
const flashcardList = document.getElementById('flashcard-list');

let flashcards = JSON.parse(localStorage.getItem('studentDashboardFlashcards')) || [];
let currentFlashcardIndex = 0;
let isFlipped = false;

function saveFlashcards() {
  localStorage.setItem('studentDashboardFlashcards', JSON.stringify(flashcards));
}

function renderFlashcard() {
  if (flashcards.length === 0) {
    flashcardFront.textContent = 'Front Side';
    flashcardBack.textContent = 'Back Side';
    flashcardInner.style.transform = 'rotateY(0deg)';
    isFlipped = false;
    return;
  }
  const card = flashcards[currentFlashcardIndex];
  flashcardFront.textContent = card.front;
  flashcardBack.textContent = card.back;
  flashcardInner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
}

function renderFlashcardList() {
  flashcardList.innerHTML = '';
  flashcards.forEach((card, index) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between bg-[var(--card-alt-color)] rounded-md px-3 py-1 cursor-pointer hover:bg-opacity-80';
    li.textContent = card.front;
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.setAttribute('aria-pressed', index === currentFlashcardIndex ? 'true' : 'false');
    li.addEventListener('click', () => {
      currentFlashcardIndex = index;
      isFlipped = false;
      renderFlashcard();
      renderFlashcardList();
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.className = 'text-red-500 hover:text-red-700 ml-3 focus:outline-none';
    deleteBtn.setAttribute('aria-label', 'Delete flashcard');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flashcards.splice(index, 1);
      if (currentFlashcardIndex >= flashcards.length) {
        currentFlashcardIndex = flashcards.length - 1;
      }
      saveFlashcards();
      renderFlashcard();
      renderFlashcardList();
    });

    li.appendChild(deleteBtn);
    flashcardList.appendChild(li);
  });
}

flashcard.addEventListener('click', () => {
  if (flashcards.length === 0) return;
  isFlipped = !isFlipped;
  flashcardInner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
});

flashcardForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const front = flashcardFrontInput.value.trim();
  const back = flashcardBackInput.value.trim();
  if (front && back) {
    flashcards.push({ front, back });
    saveFlashcards();
    flashcardFrontInput.value = '';
    flashcardBackInput.value = '';
    currentFlashcardIndex = flashcards.length - 1;
    isFlipped = false;
    renderFlashcard();
    renderFlashcardList();
  }
});

renderFlashcard();
renderFlashcardList();


// ----------------- SUMMARY TOOL -----------------
const bbaiInput = document.getElementById('bbai-input');
const bbaiSendBtn = document.getElementById('bbai-send-btn');
const bbaiMessage = document.getElementById('bbai-message');

bbaiSendBtn.addEventListener('click', () => {
  const userInput = bbaiInput.value.trim();
  if (!userInput) {
    bbaiMessage.textContent = 'Please enter some input.';
    bbaiMessage.style.opacity = '1';
    setTimeout(() => {
      bbaiMessage.style.opacity = '0';
    }, 2000);
    return;
  }
  const prompt = `Summarize this: ${userInput}`;
  navigator.clipboard.writeText(prompt).then(() => {
    bbaiMessage.textContent = 'Prompt copied. Just paste it into the chat!';
    bbaiMessage.style.opacity = '1';
    setTimeout(() => {
      bbaiMessage.style.opacity = '0';
      window.open('https://www.blackbox.ai/', '_blank');
    }, 1000);
  }).catch(() => {
    bbaiMessage.textContent = 'Failed to copy prompt. Please copy manually.';
    bbaiMessage.style.opacity = '1';
    setTimeout(() => {
      bbaiMessage.style.opacity = '0';
    }, 2000);
  });
});


// ----------------- POMODORO TIMER -----------------
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const timerDisplay = document.getElementById('timer-display');
const progressRing = document.getElementById('progress-ring');
const sessionType = document.getElementById('session-type');
const focusLengthInput = document.getElementById('focus-length');
const breakLengthInput = document.getElementById('break-length');

const FULL_DASH_ARRAY = 2 * Math.PI * 45;

let FOCUS_TIME = 25 * 60;
let BREAK_TIME = 5 * 60;

let timeLeft = FOCUS_TIME;
let timerInterval = null;
let isRunning = false;
let isFocus = true;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function setProgress(time) {
  const offset = FULL_DASH_ARRAY - (time / (isFocus ? FOCUS_TIME : BREAK_TIME)) * FULL_DASH_ARRAY;
  progressRing.style.strokeDashoffset = offset;
}

function switchSession() {
  isFocus = !isFocus;
  timeLeft = isFocus ? FOCUS_TIME : BREAK_TIME;
  sessionType.textContent = isFocus ? 'Focus Session' : 'Break Session';
  setProgress(timeLeft);
  updateTimerDisplay();
}

function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimerDisplay();
    setProgress(timeLeft);
  } else {
    switchSession();
  }
}

function saveCustomTimes() {
  localStorage.setItem('pomodoroFocusTime', FOCUS_TIME);
  localStorage.setItem('pomodoroBreakTime', BREAK_TIME);
}

function loadCustomTimes() {
  const savedFocus = localStorage.getItem('pomodoroFocusTime');
  const savedBreak = localStorage.getItem('pomodoroBreakTime');
  if (savedFocus) FOCUS_TIME = parseInt(savedFocus, 10);
  if (savedBreak) BREAK_TIME = parseInt(savedBreak, 10);
}

function applyInputValues() {
  focusLengthInput.value = Math.floor(FOCUS_TIME / 60);
  breakLengthInput.value = Math.floor(BREAK_TIME / 60);
}

startPauseBtn.addEventListener('click', () => {
  if (isRunning) {
    clearInterval(timerInterval);
    startPauseBtn.textContent = 'Start';
  } else {
    timerInterval = setInterval(tick, 1000);
    startPauseBtn.textContent = 'Pause';
  }
  isRunning = !isRunning;
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  isRunning = false;
  isFocus = true;
  timeLeft = FOCUS_TIME;
  updateTimerDisplay();
  setProgress(timeLeft);
  startPauseBtn.textContent = 'Start';
  sessionType.textContent = 'Focus Session';
});

focusLengthInput.addEventListener('change', () => {
  const val = parseInt(focusLengthInput.value, 10);
  if (!isNaN(val) && val > 0) {
    FOCUS_TIME = val * 60;
    saveCustomTimes();
    if (isFocus) {
      timeLeft = FOCUS_TIME;
      updateTimerDisplay();
      setProgress(timeLeft);
    }
  }
});

breakLengthInput.addEventListener('change', () => {
  const val = parseInt(breakLengthInput.value, 10);
  if (!isNaN(val) && val > 0) {
    BREAK_TIME = val * 60;
    saveCustomTimes();
    if (!isFocus) {
      timeLeft = BREAK_TIME;
      updateTimerDisplay();
      setProgress(timeLeft);
    }
  }
});

loadCustomTimes();
applyInputValues();
timeLeft = FOCUS_TIME;
updateTimerDisplay();
setProgress(timeLeft);
