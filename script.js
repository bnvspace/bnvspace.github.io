document.getElementById('openPopup').addEventListener('click', function() {
    document.getElementById('popupOverlay').style.display = 'flex';
});

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popupOverlay').style.display = 'none';
});

// Добавляем обработчик события отправки формы
document.querySelector('.form').addEventListener('submit', function(e) {
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
    const issuedTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popupOverlay').style.display = 'none';
});
let isSelectionMode = false;

document.querySelector('.red').addEventListener('click', function() {
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
    }
  }
  document.querySelector('button[type="reset"]').addEventListener('click', function() {
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