const todoList = [{
  name: 'review course',
  dueDate: '2025-09-29'
}];

renderTodoList();

function renderTodoList() {
  let todoListHTML = '';

  // Loop over every todo object
  todoList.forEach((todoObject, index) => {
    const { name, dueDate } = todoObject;

    const html = `
      <div>
        <span>${name}</span>
        <span>${dueDate}</span>
        <button class="delete-button js-delete-button" data-index="${index}">
          Delete
        </button>
      </div>
    `;

    todoListHTML += html;
  });

  // Show the objects inside the class "js-todo-list"
  document.querySelector('.js-todo-list').innerHTML = todoListHTML;

  // Loop over every delete button
  document.querySelectorAll('.js-delete-button')
    .forEach((deleteButton) => {
      deleteButton.addEventListener('click', () => {
        const index = deleteButton.dataset.index;
        todoList.splice(index, 1); // delete task
        renderTodoList(); // re-render
      });
    });
}

document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
  });

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputElement.value;

  // Add these values to the variable "todoList"
  todoList.push({
    name: name,
    dueDate: dueDate
  });

  inputElement.value = '';
  dateInputElement.value = '';

  renderTodoList();
}