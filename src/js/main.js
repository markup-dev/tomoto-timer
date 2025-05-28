import '../scss/index.scss';
import { getTasks, addTask, updateTask, deleteTask, saveTasks } from './tasks.js';
import { startTimer as timerStart, stopTimer as timerStop, resetTimer, getTimerState } from './timer.js';
import { renderTasks, renderTimer, setEventHandlers, renderPanelTitle, showDeleteModal, showEditModal, renderPanelStatus } from './ui.js';

let tasks = [];
let activeTaskId = null;
let timerIsRunning = false;
let isBreak = false;
let cycleCount = 0;
const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const refresh = () => {
  tasks = getTasks();
  if (!activeTaskId && tasks.length) activeTaskId = tasks[0].id;
  renderTasks(tasks, activeTaskId);
  const task = tasks.find(t => t.id === activeTaskId);
  renderTimer(task ? task.time : WORK_DURATION, timerIsRunning);
  renderPanelTitle(task ? task.title : '');
  renderPanelStatus(isBreak ? `Перерыв #${cycleCount}` : `Помидор #${cycleCount + 1}`);
};

const handleAdd = (title) => {
  if (!title.trim()) return;
  const importance = importanceState;
  addTask({ title, importance });
  importanceState = 'default';
  refresh();
};

const handleSelect = (id) => {
  activeTaskId = id;
  timerStop();
  timerIsRunning = false;
  isBreak = false;
  refresh();
};

const handleDelete = (id) => {
  showDeleteModal(() => {
    deleteTask(id);
    if (activeTaskId === id) activeTaskId = null;
    refresh();
  });
};

const handleEdit = (id) => {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt('Новое название задачи:', task.title);
  if (newTitle && newTitle.trim()) {
    updateTask(id, { title: newTitle });
    refresh();
  }
};

const handleStart = () => {
  const task = tasks.find(t => t.id === activeTaskId);
  if (!task) return;
  timerIsRunning = true;
  if (!isBreak) {
    timerStart({ ...task, time: task.time || WORK_DURATION }, (remaining) => {
      updateTask(task.id, { time: remaining });
      renderTimer(remaining, true);
    }, () => {
      timerIsRunning = false;
      updateTask(task.id, { time: 0 });
      renderTimer(0, false);
      isBreak = true;
      cycleCount++;
      refresh();
      setTimeout(() => {
        alert('Время работы вышло! Перерыв 5 минут.');
        handleStart();
      }, 100);
    });
  } else {
    timerStart({ id: 'break', time: BREAK_DURATION }, (remaining) => {
      renderTimer(remaining, true);
    }, () => {
      timerIsRunning = false;
      isBreak = false;
      refresh();
      setTimeout(() => {
        alert('Перерыв окончен! Время работать.');
        handleStart();
      }, 100);
    });
  }
  refresh();
};

const handleStop = () => {
  timerStop();
  timerIsRunning = false;
  refresh();
};

let importanceState = 'default';
const importanceCycle = ['default', 'important', 'so-so'];
let importanceIdx = 0;
const handleImportance = (e) => {
  importanceIdx = (importanceIdx + 1) % importanceCycle.length;
  importanceState = importanceCycle[importanceIdx];
  e.target.className = 'button button-importance ' + importanceState;
};

document.addEventListener('DOMContentLoaded', () => {
  refresh();
  setEventHandlers({
    onAdd: handleAdd,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onSelect: handleSelect,
    onStart: handleStart,
    onStop: handleStop,
    onImportance: handleImportance,
  });
});