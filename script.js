document.getElementById('openPopup').addEventListener('click', function () {
  document.getElementById('popupOverlay').style.display = 'flex';
});

document.getElementById('closePopup').addEventListener('click', function () {
  document.getElementById('popupOverlay').style.display = 'none';
});

// Добавляем обработчик события отправки формы
document.querySelector('.form').addEventListener('submit', function (e) {
  e.preventDefault(); // Предотвращаем перезагрузку страницы

  // Получаем значения из полей ввода
  const number = Math.floor(Math.random() * 1000000); // Генерируем случайный номер
  const creator = 'Кассир'; // Предполагаем, что создатель всегда "Кассир"
  const consultant = document.querySelector('input[name="consultant"]').value;
  const paymentType = document.querySelector('input[name="paymentType"]').value;
  const status = 'открыт'; // Предполагаем, что новый заказ всегда "открыт"
  const deletable = 'Нет'; // Предполагаем, что новый заказ нельзя удалить
  const discounts = ''; // Пока оставим пустым
  const product = document.querySelector('input[name="productType"]').value;
  const fullName = document.querySelector('input[name="fullName"]').value;
  const issuedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const receiptDate = document.querySelector('input[name="issueDate"]').value;
  const paid = document.querySelector('input[name="paid"]').value;

  // Создаем новую строку таблицы
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
        <td>${number}</td>
        <td>${creator}</td>
        <td>${consultant}</td>
        <td>${paymentType}</td>
        <td>${status}</td>
        <td>${deletable}</td>
        <td>${discounts}</td>
        <td>${product}</td>
        <td>${fullName}</td>
        <td>${issuedTime}</td>
        <td>${receiptDate}</td>
        <td>${paid}</td>
    `;

  // Добавляем новую строку в таблицу
  document.querySelector('.orders tbody').appendChild(newRow);

  // Очищаем форму
  this.reset();

  // Закрываем попап
  document.getElementById('popupOverlay').style.display = 'none';

  // Показываем сообщение об успешном сохранении
  showMessage('Заказ успешно сохранен!');
});

// Функция для показа сообщения
function showMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.position = 'fixed';
  messageElement.style.top = '20px';
  messageElement.style.left = '50%';
  messageElement.style.transform = 'translateX(-50%)';
  messageElement.style.backgroundColor = '#4CAF50';
  messageElement.style.color = 'white';
  messageElement.style.padding = '15px';
  messageElement.style.borderRadius = '5px';
  messageElement.style.zIndex = '1001';

  document.body.appendChild(messageElement);

  // Удаляем сообщение через 3 секунды
  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, 3000);
}
document.getElementById('closePopup').addEventListener('click', function () {
  document.getElementById('popupOverlay').style.display = 'none';
});
let isChangePaymentTypeMode = false;

function changePaymentTypeHandlerNew(event) {
  if (isChangePaymentTypeMode) {
    const row = event.target.parentNode;
    row.classList.toggle('selected-e');
    const paymentTypeCell = row.cells[3]; // поле с типом оплаты
    paymentTypeCell.contentEditable = 'true'; // делаем поле активным для редактирования
    paymentTypeCell.focus(); // устанавливаем фокус на поле

    // добавляем подсветку ячейки
    paymentTypeCell.style.background = 'rgba(255, 255, 0, 1)'; // устанавливаем подсветку ячейки

    // добавляем обработчик события для сброса подсветки ячейки
    paymentTypeCell.addEventListener('blur', function () {
      paymentTypeCell.style.background = ''; // сбрасываем подсветку ячейки
    });

    // добавляем обработчик события для сброса подсветки ячейки
    paymentTypeCell.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        paymentTypeCell.style.background = ''; // сбрасываем подсветку ячейки
      }
    });
  }
}

document.querySelector('.change-payment-type').addEventListener('click', function () {
  isChangePaymentTypeMode = !isChangePaymentTypeMode;

  if (isChangePaymentTypeMode) {
    const tableRows = document.querySelectorAll('table tr');

    tableRows.forEach((row) => {
      row.addEventListener('click', changePaymentTypeHandlerNew);
    });

    this.style.background = 'rgb(215, 207, 86)'; // меняем цвет кнопки
    this.style.color = 'white'; // меняем цвет текста кнопки
  } else {
    const tableRows = document.querySelectorAll('table tr');

    tableRows.forEach((row) => {
      row.removeEventListener('click', changePaymentTypeHandlerNew);

      row.classList.remove('selected-e');
      row.style.background = '';
      row.style.cursor = 'default'; // сбрасываем курсор

      // сбрасываем значения в поле с типом оплаты
      const paymentTypeCell = row.cells[3];
      paymentTypeCell.contentEditable = 'false';
    });

    this.style.background = ''; // сбрасываем цвет кнопки
    this.style.color = ''; // сбрасываем цвет текста кнопки
  }
});

let isChangeNumberMode = false;

function changeNumberHandlerNew(event) {
  if (isChangeNumberMode) {
    const row = event.target.parentNode;
    row.classList.toggle('selected-e');
    const numberCell = row.cells[0]; // поле с номером
    numberCell.contentEditable = 'true'; // делаем поле активным для редактирования
    numberCell.focus(); // устанавливаем фокус на поле


    // добавляем подсветку ячейки
    numberCell.style.background = 'rgba(255, 255, 0, 1)'; // устанавливаем подсветку ячейки

    // добавляем обработчик события для сброса подсветки ячейки
    numberCell.addEventListener('blur', function () {
      numberCell.style.background = ''; // сбрасываем подсветку ячейки
    });

    // добавляем обработчик события для сброса подсветки ячейки
    numberCell.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        numberCell.style.background = ''; // сбрасываем подсветку ячейки
      }
    });
  }
}


document.querySelector('.change-number').addEventListener('click', function () {
  isChangeNumberMode = !isChangeNumberMode;

  if (isChangeNumberMode) {
    const tableRows = document.querySelectorAll('table tr');

    tableRows.forEach((row) => {
      row.addEventListener('click', changeNumberHandlerNew);
    });

    this.style.background = 'rgb(215 207 86)'; // меняем цвет кнопки
    this.style.color = 'white'; // меняем цвет текста кнопки
  } else {
    const tableRows = document.querySelectorAll('table tr');

    tableRows.forEach((row) => {
      row.removeEventListener('click', changeNumberHandlerNew);

      row.classList.remove('selected-e');
      row.style.background = '';
      row.style.cursor = 'default'; // сбрасываем курсор

      // сбрасываем значения в поле с номером
      const numberCell = row.cells[0];
      numberCell.contentEditable = 'false';
    });

    this.style.background = ''; // сбрасываем цвет кнопки
    this.style.color = ''; // сбрасываем цвет текста кнопки
  }
});

let isSelectionMode = false;

document.querySelector('.red').addEventListener('click', function () {
  isSelectionMode = !isSelectionMode;

  if (isSelectionMode) {
    const tableRows = document.querySelectorAll('table tr');

    tableRows.forEach((row) => {
      row.addEventListener('click', clickHandler);
    });

    this.style.background = 'rgba(0, 0, 0, 0.1)'; // меняем цвет кнопки
    this.style.color = 'white'; // меняем цвет текста кнопки
  } else {
    const tableRows = document.querySelectorAll('table tr');

    tableRows.forEach((row) => {
      row.removeEventListener('click', clickHandler);

      row.classList.remove('selected');
      row.style.background = '';
      row.style.cursor = 'default'; // сбрасываем курсор

    });

    this.style.background = ''; // сбрасываем цвет кнопки
    this.style.color = ''; // сбрасываем цвет текста кнопки
  }
});

function clickHandler(event) {
  if (isSelectionMode) {
    const row = event.target.parentNode;
    row.classList.toggle('selected');
    const deleteCell = row.cells[5]; // столбец "Удалить"
    const deleteValue = deleteCell.textContent;
    if (deleteValue === 'Нет') {
      deleteCell.textContent = 'Да';
    } else {
      deleteCell.textContent = 'Нет';
    }
  }
}
document.querySelector('button[type="reset"]').addEventListener('click', function () {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.value = '';
    input.defaultValue = '';
  });
});

function changeDays(amount) {
  const input = document.getElementById('additional-days');
  const currentValue = parseInt(input.value);
  const newValue = Math.max(0, currentValue + amount);
  input.value = newValue;
}

function setDays(amount) {
  const input = document.getElementById('additional-days');
  const currentValue = parseInt(input.value);
  const newValue = currentValue + amount;
  input.value = newValue;
}

// Функция для заполнения выпадающих списков
function fillFilters() {
  const tableData = document.querySelectorAll('#tableBody tr');
  const numberFilter = document.getElementById('numberFilter');
  const creatorFilter = document.getElementById('creatorFilter');
  const consultantFilter = document.getElementById('consultantFilter');
  const paymentTypeFilter = document.getElementById('paymentTypeFilter');
  const statusFilter = document.getElementById('statusFilter');
  const deleteFilter = document.getElementById('deleteFilter');
  const discountsFilter = document.getElementById('discountsFilter');
  const productsFilter = document.getElementById('productsFilter');
  const fullNameFilter = document.getElementById('fullNameFilter');
  const issuedFilter = document.getElementById('issuedFilter');

  tableData.forEach(row => {
    const number = row.cells[0].textContent;
    const creator = row.cells[1].textContent;
    const consultant = row.cells[2].textContent;
    const paymentType = row.cells[3].textContent;
    const status = row.cells[4].textContent;
    const deleteStatus = row.cells[5].textContent;
    const discounts = row.cells[6].textContent;
    const products = row.cells[7].textContent;
    const fullName = row.cells[8].textContent;
    const issued = row.cells[9].textContent;

    // Добавляем значения в выпадающие списки
    if (!numberFilter.querySelector(`option[value="${number}"]`)) {
      const option = document.createElement('option');
      option.value = number;
      option.textContent = number;
      numberFilter.appendChild(option);
    }

    if (!creatorFilter.querySelector(`option[value="${creator}"]`)) {
      const option = document.createElement('option');
      option.value = creator;
      option.textContent = creator;
      creatorFilter.appendChild(option);
    }

    if (!consultantFilter.querySelector(`option[value="${consultant}"]`)) {
      const option = document.createElement('option');
      option.value = consultant;
      option.textContent = consultant;
      consultantFilter.appendChild(option);
    }

    if (!paymentTypeFilter.querySelector(`option[value="${paymentType}"]`)) {
      const option = document.createElement('option');
      option.value = paymentType;
      option.textContent = paymentType;
      paymentTypeFilter.appendChild(option);
    }

    if (!statusFilter.querySelector(`option[value="${status}"]`)) {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      statusFilter.appendChild(option);
    }

    if (!deleteFilter.querySelector(`option[value="${deleteStatus}"]`)) {
      const option = document.createElement('option');
      option.value = deleteStatus;
      option.textContent = deleteStatus;
      deleteFilter.appendChild(option);
    }

    if (!discountsFilter.querySelector(`option[value="${discounts}"]`)) {
      const option = document.createElement('option');
      option.value = discounts;
      option.textContent = discounts;
      discountsFilter.appendChild(option);
    }

    if (!productsFilter.querySelector(`option[value="${products}"]`)) {
      const option = document.createElement('option');
      option.value = products;
      option.textContent = products;
      productsFilter.appendChild(option);
    }

    if (!fullNameFilter.querySelector(`option[value="${fullName}"]`)) {
      const option = document.createElement('option');
      option.value = fullName;
      option.textContent = fullName;
      fullNameFilter.appendChild(option);
    }

    if (!issuedFilter.querySelector(`option[value="${issued}"]`)) {
      const option = document.createElement('option');
      option.value = issued;
      option.textContent = issued;
      issuedFilter.appendChild(option);
    }
  });
}
// Функция для фильтрации таблицы
function filterTable() {
  const numberValue = document.getElementById('numberFilter').value;
  const creatorValue = document.getElementById('creatorFilter').value;
  const consultantValue = document.getElementById('consultantFilter').value;
  const paymentTypeValue = document.getElementById('paymentTypeFilter').value;
  const statusValue = document.getElementById('statusFilter').value;
  const deleteValue = document.getElementById('deleteFilter').value;
  const discountsValue = document.getElementById('discountsFilter').value;
  const productsValue = document.getElementById('productsFilter').value;
  const fullNameValue = document.getElementById('fullNameFilter').value;
  const issuedValue = document.getElementById('issuedFilter').value;

  const tableData = document.querySelectorAll('#tableBody tr');
  let dataFound = false;

  tableData.forEach(row => {
    const number = row.cells[0].textContent;
    const creator = row.cells[1].textContent;
    const consultant = row.cells[2].textContent;
    const paymentType = row.cells[3].textContent;
    const status = row.cells[4].textContent;
    const deleteStatus = row.cells[5].textContent;
    const discounts = row.cells[6].textContent;
    const products = row.cells[7].textContent;
    const fullName = row.cells[8].textContent;
    const issued = row.cells[9].textContent;

    if ((numberValue === '' || number === numberValue) &&
      (creatorValue === '' || creator === creatorValue) &&
      (consultantValue === '' || consultant === consultantValue) &&
      (paymentTypeValue === '' || paymentType === paymentTypeValue) &&
      (statusValue === '' || status === statusValue) &&
      (deleteValue === '' || deleteStatus === deleteValue) &&
      (discountsValue === '' || discounts === discountsValue) &&
      (productsValue === '' || products === productsValue) &&
      (fullNameValue === '' || fullName === fullNameValue) &&
      (issuedValue === '' || issued === issuedValue)) {
      row.style.display = '';
      dataFound = true;
    } else {
      row.style.display = 'none';
    }
  });

  if (!dataFound) {
    document.getElementById('no-data-message').style.display = 'block';
  } else {
    document.getElementById('no-data-message').style.display = 'none';
  }
}

// Вызываем функцию для заполнения выпадающих списков
fillFilters();

// Добавляем обработчик события для фильтрации таблицы
document.getElementById('numberFilter').addEventListener('change', filterTable);
document.getElementById('creatorFilter').addEventListener('change', filterTable);
document.getElementById('consultantFilter').addEventListener('change', filterTable);
document.getElementById('paymentTypeFilter').addEventListener('change', filterTable);
document.getElementById('statusFilter').addEventListener('change', filterTable);
document.getElementById('deleteFilter').addEventListener('change', filterTable);
document.getElementById('discountsFilter').addEventListener('change', filterTable);
document.getElementById('productsFilter').addEventListener('change', filterTable);
document.getElementById('fullNameFilter').addEventListener('change', filterTable);
document.getElementById('issuedFilter').addEventListener('change', filterTable);
// Добавляем обработчик события click на строку таблицы// Добавляем обработчик события click на строку таблицы
