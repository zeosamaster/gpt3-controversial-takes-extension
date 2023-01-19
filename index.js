const editContainer = document.getElementById("edit");
const completedContainer = document.getElementById("completed");

const saveButton = document.getElementById("save_key_button");
const editButton = document.getElementById("change_key_button");

const STORAGE_KEY = "openai-key";

const showCompleted = () => {
  editContainer.classList.add("hidden");
  completedContainer.classList.remove("hidden");
};

const showEdit = () => {
  editContainer.classList.remove("hidden");
  completedContainer.classList.add("hidden");
};

const saveKey = () => {
  const input = document.getElementById("key_input");
  if (!input) return;

  chrome.storage.local.set({ [STORAGE_KEY]: btoa(input.value) }, showCompleted);
};

const checkForKey = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY]);
    });
  });
};

checkForKey().then((openaiKey) => (openaiKey ? showCompleted() : showEdit()));

saveButton.addEventListener("click", saveKey);
editButton.addEventListener("click", showEdit);
