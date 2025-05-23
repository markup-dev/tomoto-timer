import '../scss/index.scss';

let timerInterval = null;
let timerSeconds = 25 * 60; // 25 минут

// DOM элементы
const timerDisplay = document.querySelector('.window__timer-text');
const startBtn = document.querySelector('.button-primary');
const stopBtn = document.querySelector('.button-secondary');

// Обновление отображения таймера
const updateTimerDisplay = () => {
  const min = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const sec = String(timerSeconds % 60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
};

// Запуск таймера
const startTimer = () => {
  if (timerInterval) return;
  startBtn.classList.add('hidden');
  stopBtn.classList.remove('hidden');
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      startBtn.classList.remove('hidden');
      stopBtn.classList.add('hidden');
      timerSeconds = 25 * 60;
      updateTimerDisplay();
      alert('Время вышло! Сделайте перерыв.');
    }
  }, 1000);
};

// Остановка таймера
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  startBtn.classList.remove('hidden');
  stopBtn.classList.add('hidden');
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  updateTimerDisplay();
  startBtn.addEventListener('click', startTimer);
  stopBtn.addEventListener('click', stopTimer);
});

let count = 0;
const imp = ['default', 'important', 'so-so']
document.querySelector('.button-importance').addEventListener('click', ({target}) => {
  count += 1;
  if (count >= imp.length) {
    count = 0
  }

  for (let i = 0; i < imp.length; i++) {
    if (count === i) {
      target.classList.add(imp[i])
    } else {
      target.classList.remove(imp[i])
    }
  }
})
