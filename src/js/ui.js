const tasksList = document.querySelector('.tasks__list');
const timerDisplay = document.querySelector('.window__timer-text');
const startBtn = document.querySelector('.button-primary');
const stopBtn = document.querySelector('.button-secondary');
const taskForm = document.querySelector('.task-form');
const taskInput = document.querySelector('.task-name');
const importanceBtn = document.querySelector('.button-importance');
const panelTitle = document.querySelector('.window__panel-title');
const modalOverlay = document.querySelector('.modal-overlay');
const modalDelete = document.querySelector('.modal-delete');
const panelStatus = document.querySelector('.window__panel-task-text');
let modalDeleteCallback = null;

export const renderTasks = (tasks, activeTaskId) => {
  tasksList.innerHTML = '';
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = `tasks__item ${task.importance}`;
    if (task.id === activeTaskId) li.classList.add('active');
    li.innerHTML = `
      <span class="count-number">${idx + 1}</span>
      <button class="tasks__text${task.id === activeTaskId ? ' tasks__text_active' : ''}" data-id="${task.id}">
        ${task.title}
      </button>
      <button class="tasks__button" data-id="${task.id}"></button>
      <div class="popup">
        <button class="popup__button popup__edit-button" data-id="${task.id}">Редактировать</button>
        <button class="popup__button popup__delete-button" data-id="${task.id}">Удалить</button>
      </div>
    `;
    tasksList.appendChild(li);
  });
};

export const renderTimer = (time, isRunning) => {
  const min = String(Math.floor(time / 60)).padStart(2, '0');
  const sec = String(time % 60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
  if (isRunning) {
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
  } else {
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
  }
};

export const showDeleteModal = (onConfirm, onCancel) => {
  modalOverlay.style.display = 'block';
  modalDeleteCallback = onConfirm;
  const close = () => {
    modalOverlay.style.display = 'none';
    modalDeleteCallback = null;
  };
  modalDelete.querySelector('.modal-delete__close-button').onclick = close;
  modalDelete.querySelector('.modal-delete__cancel-button').onclick = close;
  modalDelete.querySelector('.modal-delete__delete-button').onclick = () => {
    if (modalDeleteCallback) modalDeleteCallback();
    close();
  };
};

export const showEditModal = (oldTitle, onConfirm) => {
  modalOverlay.style.display = 'block';
  const origTitle = modalDelete.querySelector('.modal-delete__title').textContent;
  const origDeleteBtn = modalDelete.querySelector('.modal-delete__delete-button');
  const origCancelBtn = modalDelete.querySelector('.modal-delete__cancel-button');
  const origCloseBtn = modalDelete.querySelector('.modal-delete__close-button');

  modalDelete.querySelector('.modal-delete__title').textContent = 'Редактировать задачу';
  let input = modalDelete.querySelector('input');
  if (!input) {
    input = document.createElement('input');
    input.type = 'text';
    input.className = 'modal-edit__input input-primary';
    modalDelete.insertBefore(input, origDeleteBtn);
  }
  input.value = oldTitle;
  input.style.display = 'block';
  origDeleteBtn.textContent = 'Сохранить';
  origCancelBtn.textContent = 'Отмена';

  const close = () => {
    modalOverlay.style.display = 'none';
    modalDelete.querySelector('.modal-delete__title').textContent = origTitle;
    origDeleteBtn.textContent = 'Удалить';
    origCancelBtn.textContent = 'Отмена';
    input.style.display = 'none';
    modalDeleteCallback = null;
  };
  origCloseBtn.onclick = close;
  origCancelBtn.onclick = close;
  origDeleteBtn.onclick = () => {
    if (input.value.trim()) {
      onConfirm(input.value.trim());
      close();
    } else {
      input.focus();
    }
  };
};

let lastPopup = null;
const closeAllPopups = () => {
  document.querySelectorAll('.popup').forEach(p => p.classList.remove('popup_active'));
  lastPopup = null;
};

export const setEventHandlers = (handlers) => {
  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    handlers.onAdd && handlers.onAdd(taskInput.value);
    taskInput.value = '';
  });
  tasksList.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains('tasks__text')) {
      handlers.onSelect && handlers.onSelect(id);
      closeAllPopups();
    }
    if (e.target.classList.contains('popup__edit-button')) {
      handlers.onEdit && handlers.onEdit(id);
      closeAllPopups();
    }
    if (e.target.classList.contains('popup__delete-button')) {
      handlers.onDelete && handlers.onDelete(id);
      closeAllPopups();
    }
    if (e.target.classList.contains('tasks__button')) {
      const popup = e.target.nextElementSibling;
      if (popup && popup.classList.contains('popup')) {
        if (lastPopup && lastPopup !== popup) lastPopup.classList.remove('popup_active');
        popup.classList.toggle('popup_active');
        lastPopup = popup.classList.contains('popup_active') ? popup : null;
      }
    }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.tasks__item')) closeAllPopups();
  });
  startBtn.addEventListener('click', () => handlers.onStart && handlers.onStart());
  stopBtn.addEventListener('click', () => handlers.onStop && handlers.onStop());
  importanceBtn.addEventListener('click', e => handlers.onImportance && handlers.onImportance(e));
};

export const renderPanelTitle = (title) => {
  panelTitle.textContent = title || '';
};

export const renderPanelStatus = (statusText) => {
  panelStatus.textContent = statusText;
}; 