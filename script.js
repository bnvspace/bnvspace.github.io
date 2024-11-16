function colorizeTable(tableId) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach(row => {
        const cells = row.getElementsByTagName("td");

        const currentValueText = cells[1].innerText;
        const yesterdayValueText = cells[2].innerText;
        const weekDayValueText = cells[3].innerText;

        const currentValue = parseFloat(currentValueText.replace(/\s+/g, '').replace(',', '.'));
        const yesterdayValue = parseFloat(yesterdayValueText.replace(/\s+/g, '').replace(',', '.'));
        const weekDayValue = parseFloat(weekDayValueText.replace(/\s+/g, '').replace(',', '.'));

        if (isNaN(currentValue) || isNaN(yesterdayValue) || isNaN(weekDayValue)) {
            console.log("Ошибка: одно из значений не является числом.");
            return;
        }

        let yesterdayText = yesterdayValueText.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        let percentChangeYesterday = "";

        if (yesterdayValue < currentValue) {
            const percent = Math.ceil(((currentValue - yesterdayValue) / yesterdayValue) * 100);
            percentChangeYesterday = ` <span class="percent-green">+${percent}%</span>`;
            cells[2].classList.add("bg-green");
            cells[2].classList.remove("bg-red", "bg-neutral");
        } else if (yesterdayValue > currentValue) {
            const percent = Math.ceil(((yesterdayValue - currentValue) / currentValue) * 100);
            percentChangeYesterday = ` <span class="percent-red">-${percent}%</span>`;
            cells[2].classList.add("bg-red");
            cells[2].classList.remove("bg-green", "bg-neutral");
        } else {
            percentChangeYesterday = ` <span class="percent-neutral">+0%</span>`;
            cells[2].classList.add("bg-neutral");
            cells[2].classList.remove("bg-green", "bg-red");
        }

        const numberText = `<span class="number">${yesterdayText}</span>`;
        const percentageText = `<span class="percent">${percentChangeYesterday}</span>`;

        cells[2].innerHTML = numberText + percentageText;

        const weekDayCell = cells[3];
        if (weekDayValue > currentValue) {
            weekDayCell.classList.add("bg-red");
            weekDayCell.classList.remove("bg-green");
        } else if (weekDayValue < currentValue) {
            weekDayCell.classList.add("bg-green");
            weekDayCell.classList.remove("bg-red");
        } else {
            weekDayCell.classList.remove("bg-green", "bg-red");
        }
    });
}

function onRowClick(event) {
    const cells = event.target.parentElement.getElementsByTagName("td");

    // Преобразуем все значения в строках в массив чисел, игнорируя первый столбец
    const rowData = Array.from(cells).slice(1).map(cell => parseFloat(cell.innerText.replace(/\s/g, '').replace(',', '.')));

    // Проверяем, если значение равно 0%, то не добавляем его в данные
    const filteredData = rowData.map(value => (value === 0 ? value : value));

    createChart(filteredData); // Передаем весь ряд данных
}

let myChart;
function createChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chartLabels = ['0', '1', '2', '3', '4', '5', '6'];

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Выручка, руб',
                data: data, // Используем только чистые данные без 0% изменений
                borderColor: 'green',
                backgroundColor: '#268f68',
                borderWidth: 2,
                pointBackgroundColor: '#268f68',
                pointBorderColor: '#268f68',
                pointRadius: 5,
                tension: 0
            }]
        },
        options: {
            responsive: true,
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            },
            scales: {
                y: {
                    grid: {
                        drawTicks: false,
                        color: 'transparent'
                    },
                    ticks: {
                        callback: function () {
                            return '■';
                        },
                        padding: 0,
                        font: {
                            size: 12,
                            family: 'Arial'
                        },
                        color: '#000000'
                    },
                    border: {
                        display: true,
                        color: '#000000',
                        width: 2
                    }
                },
                x: {
                    grid: {
                        drawTicks: false,
                        color: 'transparent'
                    },
                    ticks: {
                        callback: function () {
                            return '■';
                        },
                        padding: -3,
                        font: {
                            size: 12,
                            family: 'Arial'
                        },
                        color: '#000000'
                    },
                    border: {
                        display: true,
                        color: '#000000',
                        width: 2
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    colorizeTable("data-table");
    colorizeTable("data-table-2");

    const rows1 = document.querySelectorAll("#data-table tbody tr");
    rows1.forEach(row => {
        row.addEventListener("click", onRowClick);
    });

    const rows2 = document.querySelectorAll("#data-table-2 tbody tr");
    rows2.forEach(row => {
        row.addEventListener("click", onRowClick);
    });

    const initialData = [0, 2800521, 3980521, 4800521, 3805121, 3580521, 4805121];
    createChart(initialData);
});
