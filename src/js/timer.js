let timer = null;
let currentTaskId = null;
let remaining = 0;

export const startTimer = (task, onTick, onEnd) => {
  stopTimer();
  currentTaskId = task.id;
  remaining = task.time;
  timer = setInterval(() => {
    if (remaining > 0) {
      remaining--;
      onTick && onTick(remaining);
    } else {
      stopTimer();
      onEnd && onEnd();
    }
  }, 1000);
};

export const stopTimer = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

export const resetTimer = (task) => {
  stopTimer();
  remaining = task.total;
};

export const getTimerState = () => ({
  currentTaskId,
  remaining,
  isRunning: !!timer
}); 