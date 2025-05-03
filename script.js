let selectedItem = '';
let inputAmount = '';
let items = [];
let total = 0;

const itemDisplay = document.getElementById('selected-item');
const amountDisplay = document.getElementById('input-amount');
const receiptList = document.getElementById('receipt-list');
const receiptTotal = document.getElementById('receipt-total');

function selectItem(name) {
  selectedItem = name;
  itemDisplay.textContent = name;
  inputAmount = '';
  amountDisplay.textContent = '0';
}

function appendNumber(num) {
  if (inputAmount.length < 7) {
    inputAmount += num;
    amountDisplay.textContent = parseInt(inputAmount).toLocaleString();
  }
}

function clearAmount() {
  inputAmount = '';
  amountDisplay.textContent = '0';
}

function confirmItem() {
  if (!selectedItem || !inputAmount) return;
  const amount = parseInt(inputAmount);
  items.push({ item: selectedItem, amount });
  total += amount;
  renderReceipt();
  clearAmount();
  selectedItem = '';
  itemDisplay.textContent = '未選択';
}

function renderReceipt() {
  receiptList.innerHTML = '';
  items.forEach(entry => {
    const div = document.createElement('div');
    div.textContent = `${entry.item}：¥${entry.amount.toLocaleString()}`;
    receiptList.appendChild(div);
  });
  receiptTotal.textContent = total.toLocaleString();
}

document.getElementById('generate-pdf').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("領収書", 105, 20, null, null, "center");

  items.forEach((entry, idx) => {
    doc.text(`${entry.item}：¥${entry.amount.toLocaleString()}`, 20, 40 + idx * 10);
  });

  doc.text(`合計：¥${total.toLocaleString()} 円`, 20, 60 + items.length * 10);

  doc.save("領収書.pdf");
});

// 発行日を自動入力
document.getElementById('issued-date').textContent = new Date().toLocaleDateString('ja-JP');

// 明細表示を表形式に変更
function renderReceipt() {
  const receiptList = document.getElementById('receipt-list');
  const receiptTotal = document.getElementById('receipt-total');
  receiptList.innerHTML = '';

  items.forEach(entry => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${entry.item}</td><td>¥${entry.amount.toLocaleString()}</td>`;
    receiptList.appendChild(tr);
  });

  receiptTotal.textContent = total.toLocaleString();
}