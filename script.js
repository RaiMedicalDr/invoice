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

    // 効果音を再生（cloneして連打対応）
    const sound = clickSound.cloneNode(); 
    sound.play();
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

document.getElementById('generate-pdf').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const receiptElement = document.getElementById('receipt-preview');
  
    // HTMLをCanvasに変換
    html2canvas(receiptElement, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      // キャンバス画像をA4サイズで挿入
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save('領収書.pdf');
    });
  });

  function saveAsImage() {
    html2canvas(document.getElementById('receipt-preview'), { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = '領収書.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  }

  function saveAsImage() {
    // ステップ確認ダイアログを表示
    document.getElementById('confirm-dialog').classList.remove('hidden');
  }
  
  function cancelSave() {
    document.getElementById('confirm-dialog').classList.add('hidden');
  }
  
  function proceedToSave() {
    document.getElementById('confirm-dialog').classList.add('hidden');
  
    const timestamp = getCurrentTimestamp();
  
    html2canvas(document.getElementById('receipt-preview'), { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = `領収書_お客様控え_${timestamp}.png`;
      link.href = canvas.toDataURL();
      link.click();
  
      generateStoreReceipt(timestamp); // 店舗控えにも日付を渡す
    });
  }
  
  function generateStoreReceipt(timestamp) {
    const storeCopy = document.getElementById('receipt-preview').cloneNode(true);
    storeCopy.querySelector('h2').textContent = '領収書（店舗控え）';
  
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.left = '-9999px';
    temp.appendChild(storeCopy);
    document.body.appendChild(temp);
  
    html2canvas(storeCopy, { scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = `領収書_店舗控え_${timestamp}.png`;
      link.href = canvas.toDataURL();
      link.click();
  
      document.body.removeChild(temp);
    });
  }

  function saveAsImage() {
    // 音声合成で読み上げ
    const msg = new SpeechSynthesisUtterance("お金は受け取りましたか？ 受け取った場合は次へを押してください。受け取っていない場合はキャンセルが可能です。");
    msg.lang = "ja-JP"; // 日本語指定
    msg.pitch = 1;      // 声の高さ（0〜3）
    msg.rate = 1;       // 読み上げ速度（0.1〜10）
    speechSynthesis.speak(msg);
  
    // ダイアログ表示
    document.getElementById('confirm-dialog').classList.remove('hidden');
  }


  function getCurrentTimestamp() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}_${hh}-${min}`;
  }
  