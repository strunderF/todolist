const form = document.querySelector("form");
const input = document.querySelector("#task");
const list = document.querySelector("ul");
const summary = document.querySelector("#summary");
const storageKey = "todo-list.tasks";

const tasks = JSON.parse(localStorage.getItem(storageKey) ?? "[]");

function renderTasks() {
  list.replaceChildren();

  tasks.forEach((task, index) => {
    const row = document.querySelector("#task-row").content.cloneNode(true);
    const checkbox = row.querySelector("input");
    const removeButton = row.querySelector("button");

    row.querySelector("span").textContent = task.title;
    checkbox.checked = task.done;
    checkbox.onchange = () => {
      task.done = checkbox.checked;
      saveTasks();
    };

    removeButton.setAttribute("aria-label", `Удалить задачу «${task.title}»`);
    removeButton.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      (list.children[index]?.querySelector("button") ?? input).focus();
    };

    list.append(row);
  });
}

function updateSummary() {
  const completed = tasks.filter((task) => task.done).length;
  summary.textContent = tasks.length
    ? `Выполнено ${completed} из ${tasks.length}`
    : "Задач пока нет.";
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
  updateSummary();
}

form.onsubmit = (event) => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) return;

  tasks.push({ title, done: false });
  saveTasks();
  renderTasks();
  form.reset();
  input.focus();
};

renderTasks();
updateSummary();
