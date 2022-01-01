// getting elements
const showToday = document.querySelector(".today");
const eventsList = document.querySelector(".events-list");

// initializing
const momentClone = moment();
let hour = momentClone.hours();

// showing today's date
showToday.innerHTML = moment().format("dddd, MMMM Do");

// for getting the local storage data
const getLocalStorage = function () {
  // getting the item on that key
  const data = JSON.parse(localStorage.getItem("events"));
  // returning the data if it exists, else an empty array
  return data ? data : [];
};
// setting the local storage
const setLocalStorage = function (data) {
  // setting the item to the key after stringifying it
  localStorage.setItem("events", JSON.stringify(data));
};
// getting the localstorage before for initialization
let prevEvents = getLocalStorage();

// generating the planner
for (let i = 9; i <= 17; i++) {
  // status of the event
  let stat = "";

  // setting the status based on condition
  if (i < hour) stat = "past";
  if (i > hour) stat = "next";
  if (i === hour) stat = "current";
  // getting the previously saved event for this time block if it exists
  const prevEventForCur = prevEvents.filter((obj) => obj.id == i)[0] || {};
  // generting the html
  const html = `<div class="event-block-container">
                    <div class="time-container">
                        <p class="timeForEvent">
                            ${momentClone.hour(i).format("ha")}
                        </p>
                    </div>
                    <div class="event-container ${stat}">
                        <textarea name="inputEvent" class="inputEvent" data-event=${i}>${
    prevEventForCur.eventTxt ? prevEventForCur.eventTxt : ""
  }</textarea>
                    </div>
                    <button class="btn btn-save">
                        <img src="icons/save-solid.svg" alt="saveIcon" class="icon-save" />
                    </button>
                </div>`;
  // adding the html on the list
  eventsList.insertAdjacentHTML("beforeend", html);
}

// adding the save button click event functionality
// adding the click event on the list for performance
eventsList.addEventListener("click", function (e) {
  // checcking if the click happend on the button
  if (e.target.classList.contains("btn")) {
    // getting the text area container
    let textAreaContainer = e.target.previousElementSibling;
    // getting the text area
    let textArea = textAreaContainer.children[0];
    // getting the id from the text area
    let id = textArea.getAttribute("data-event");

    // getting data from local storage
    const data = getLocalStorage();
    // creating the new data for the current event block
    const newObj = {
      id,
      eventTxt: textArea.value,
    };

    // checking if the data exists like if there was any previous data
    if (data) {
      // updating the data
      const newData = [...data.filter((obj) => obj.id !== id), newObj];

      // setting the new data
      setLocalStorage(newData);
    } else {
      // else setting a new data for the first time
      setLocalStorage([newObj]);
    }
  }
});
