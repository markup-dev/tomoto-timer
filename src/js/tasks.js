const TASKS_KEY = 'pomodoro_tasks';
const DEFAULT_TIME = 25 * 60;

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const getTasks = () => {
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const saveTasks = (tasks) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const addTask = ({ title, importance = 'default', total = DEFAULT_TIME }) => {
  const tasks = getTasks();
  const newTask = {
    id: generateId(),
    title,
    importance,
    time: total,
    total,
    status: 'active',
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

export const updateTask = (id, updates) => {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx !== -1) {
    tasks[idx] = { ...tasks[idx], ...updates };
    saveTasks(tasks);
    return tasks[idx];
  }
  return null;
};

export const deleteTask = (id) => {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
}; 