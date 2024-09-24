const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
}

const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem === '') {
    alert('Please let add an item !!!');
  }

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
};

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
    // console.log(e.target);
  }

  if (e.target.classList.contains('items')) {
    checkUI();
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  const items = itemList.querySelectorAll('li');
  items.forEach((i) => i.classList.remove('edit-mode'));
  if (item.lastChild.classList.contains('remove-item')) {
    if (item.classList.contains('li')) {
      // console.log(item);
      item.classList.add('edit-mode');
    }
  }

  formBtn.innerHTML = '<i class ="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = '#228822';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  // console.log('click');
  // itemList.innerHTML = '';
  if (confirm('Are you sure about that !!!!!')) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    // Clear from localStorage
    localStorage.removeItem('items');

    checkUI();
  }
}

function checkUI() {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

function filterItem(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.match(text)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
    // console.log(itemName.match(text));
  });
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  li.className = 'li';
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');

  li.appendChild(button);

  // Add the li to the DOM
  itemList.appendChild(li);
  if (itemList.lastChild.textContent === '') {
    itemList.lastChild.remove();
  }
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));

  let l = JSON.parse(localStorage.getItem('items'));

  // filter item if equal to empty string
  l = l.filter((item) => item !== '');

  // update localStorage
  localStorage.setItem('items', JSON.stringify(l));
  // console.log(l);
}

function getItemFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

// Initialize app
function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItem);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();
