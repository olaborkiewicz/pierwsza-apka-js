// Określamy tablice, która będzie przechowywała zadania do zrobienia
let tasks = [];

/*
Zadanie (task) będzie obiektem:
{
    id: String | Number,
    title: String,
    isCompleted: Boolean
}
*/

const todoContainer = document.getElementById("todo-container"); // pobieramy główny kontener aplikacji
const todoError = document.getElementById("todo-error"); // pobieramy kontener błędów
const taskInput = document.getElementById("todo-task"); // pobieramy pole input
const taskForm = document.getElementById("todo-form"); // pobieramy formularz
const counter = document.getElementById("counter"); // pobieramy span z licznikiem zadań

/* Funkcja, która zlicza zadania: */
const countTodoItems = () => {
  // Pobieramy ilość elementów w tablicy tasks i przypisujemy ją jako text w elemencie counter:
  counter.innerText = tasks.length;
};

/* Fukcja, która odznacza zadanie jako "zrobione" lub "niezrobione": */

// funkcja przyjmuje dwa argumenty: Event oraz ID zadania:
const toggleCompleted = (event, taskId) => {
  // Szukamy index zadania po ID:
  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  // przypisujemy wartość isCompleted do zmiennej:
  const isCompleted = tasks[taskIndex].isCompleted; // const { isCompleted } = tasks[taskIndex]; (inny zapis - destrukturyzacja)

  // zmieniamy wartość isCompleted elementu tablicy na wartość odwrotną:
  tasks[taskIndex].isCompleted = !isCompleted;

  /*
    Tutaj warto zauważyć, że jeśli chcemy edytować tablicę tasks, nie możemy zrobić czegoś takiego:
    isCompleted = !isCompleted;
    */

  // pobieramy kliknięty element (kliknięty paragraf, który ma eventListenera):
  const element = event.currentTarget;

  // pobieramy rodzica tego elementu (div z klasą .todo-item):
  const elementParent = element.closest(".todo-item");

  /*
    Mając ID taska moglibyśmy pobrać ten sam element za pomocą querySelectora (ponieważ każdy element ma inne ID):
    const item = document.querySelector(`#task-${taskId}`);
    */

  // Zmieniamy HTML wewnątrz klikniętego elementu <p></p>:
  element.innerHTML = `${tasks[taskIndex].isCompleted ? "✅" : "⬜"}<span>${
    tasks[taskIndex].title
  }</span>`;

  // Zmieniamy klasę klikniętego elementu <div class="todo-item"></div>:
  elementParent.classList.toggle("item-completed");
};

/* Fukcja, która usuwa zadania: */

// funkcja przyjmuje dwa argumenty: Event oraz ID zadania:
const removeTask = (event, taskId) => {
  // filtrujemy tablicę tasks w taki sposób, aby usunąć element o ID przekazanym w argumencie funkcji (taskId):
  tasks = tasks.filter((item) => item.id !== taskId);

  // pobieramy kliknięty element (paragraf):
  const element = event.currentTarget;

  // pobieramy rodzica klikniętego elementu o klasie .todo-item:
  const elementParent = element.closest(".todo-item");

  // usuwamy rodzica klikniętego elementu (czyli usuwamy cały div):
  elementParent.remove();

  // wywołujemy funkcję do zliczania tasków (ponieważ zmieniła się ich ilość w tablicy):
  countTodoItems();
};

/* Fukcja do wyświetlania zadań na ekranie: */

// funkcja przyjmuje jeden argument: obiekt task (zadanie):
const renderTask = (task) => {
  /* Główny kontener zadania */

  // tworzymy nowy element <div> dla zadania:
  const newTask = document.createElement("div");

  // nadajemy id naszego elementu:
  newTask.id = `task-${task.id}`;

  // dodajemy klasę .todo-item do diva:
  newTask.classList.add("todo-item");

  /*
    Powyższy kod utworzy taki element HTML:
    <div id="task-1675504257094" class="todo-item"></div>
    */

  // ----------------------------------------------------

  /* Nazwa zadania */

  // tworzymy nowy element <p> (będzie zawierał tytuł zadania):
  const taskTitle = document.createElement("p");

  // dodajemy klasę do elementu <p>:
  taskTitle.classList.add("item-title");

  // dodajemy wewnęnętrzny HTML, który zawiera ikonkę oraz spana z nazwą zadania:
  taskTitle.innerHTML = `${task.isCompleted ? "✅" : "⬜"}<span>${
    task.title
  }</span>`;

  // dodajemy event listenera, który wywuołuje funkcję toggleCompleted po kliknięciu w paragraf:
  taskTitle.addEventListener("click", (e) => toggleCompleted(e, task.id));
  /*
        Powyższy kod utworzy taki element HTML:
        <p class="item-title">⬜<span>Tytuł zadania</span></p>
    */

  // dodajemy element <p> do elementu <div>:
  newTask.appendChild(taskTitle);

  /*
        Wynik powyższego kodu to:
        <div id="task-1675504257094" class="todo-item">
            <p class="item-title">⬜<span>Tytuł zadania</span></p>
        </div>
    */

  // ----------------------------------------------------

  /* Przyciski funkcjonalne (usuwanie / edycja) po prawej stronie */

  // tworzymy nowy element <div>:
  const taskAction = document.createElement("div");

  // dodajemy klasę .item-actions
  taskAction.classList.add("item-actions");

  /*
      Wynik HTML to:
      <div class="item-actions"></div>
    */

  // tworzymy element <button>:
  const deleteButton = document.createElement("button");

  // dodajemy event listenera, który wywuołuje funkcję do usuwania zadań po kliknięciu w przycisk (button):
  deleteButton.addEventListener("click", (e) => removeTask(e, task.id));

  // dodajemy wewnętrzny tekst przycisku (ikonka):
  deleteButton.innerText = "❌";

  // dodajemy button do diva z klasą .item-actions:
  taskAction.appendChild(deleteButton);

  // dodajemy diva z klasą .item-actions do kontenera zadania:
  newTask.appendChild(taskAction);

  /* 
         Wynik HTML powyższych operacji to:
        <div id="task-1675504257094" class="todo-item">
            <p class="item-title">⬜<span>Tytuł zadania</span></p>
            <div class="item-actions">
                <button>❌</button>
            </div>
         </div>
    */

  // Najważniejszy punkt - dodajemy zadanie do istniejącego elmentu strony (todoContainer):
  todoContainer.appendChild(newTask);
};

/* Fukcja do dodawania zadań: */

// funkcja przyjmuje jeden argument: event:
const addTask = (event) => {
  // zapobiegamy wysłaniu formularza:
  event.preventDefault();

  // pobieramy wartość inputa:
  const taskTitle = taskInput.value;

  // sprawdzamy, czy wartość inputa nie była pusta:
  if (!taskTitle) {
    todoError.classList.add("visible");
    todoError.innerText = "Wprowadź nazwę zadania!";
    return;
  }

  // sprawdzamy, czy nie ma za dużo zadań na liście (zakładamy, że można dodac max. 6 zadań):
  if (tasks.length === 6) {
    todoError.classList.add("visible");
    todoError.innerText = "Możesz dodać max. 6 tasków";
    return;
  }

  // jeśli nowe zadanie przejdzie walidację to ukrywamy element błędu:
  todoError.classList.remove("visible");
  todoError.innerText = "";

  // tworzymy ID zadania za pomocą timestampa:
  const taskId = Date.now();

  // tworzymy obiekt zadania:
  const task = {
    id: taskId,
    title: taskTitle,
    isCompleted: false,
  };

  // dodajemy obiekt zadania do tablicy (bazy zadań):
  tasks.push(task);

  // przekazujemy obiekt zadania do funkcji wyświetlające zadanie:
  renderTask(task);

  // usuwamy wartość inputa (czyli czyścimy go):
  taskInput.value = "";

  // wywołujemy funkcję do zliczania zadań (ponieważ zmieniła się ich ilość):
  countTodoItems();
};

// dodajemy event listener do formularza - jeśli formularz zostanie wysłany wywołujemy funkcję addTask:
taskForm.addEventListener("submit", addTask);
