let budget = 0;
let totalSpent = 0;

const groceryItems = [
  { name: "Milk", price: 4 },
  { name: "Bread", price: 3 },
  { name: "Eggs", price: 5 },
  { name: "Rice", price: 7 },
  { name: "Apples", price: 6 },
  { name: "Bananas", price: 2 },
  { name: "Chicken", price: 10 },
  { name: "Cheese", price: 8 },
  { name: "Coffee", price: 12 },
  { name: "Snacks", price: 6 }
];

function setBudget() {
  const input = document.getElementById("budgetInput");
  budget = parseFloat(input.value) || 0;
  document.getElementById("budgetDisplay").textContent = budget.toFixed(2);
  updateBar();
  showToast("✅ Budget set!");
}

function addItemFromList(name, price) {
  if (totalSpent + price > budget) {
    showToast(`🚫 Can't add ${name}. Over budget!`);
    showOverBudgetModal();
    return;
  }

  totalSpent += price;
  document.getElementById("totalSpent").textContent = totalSpent.toFixed(2);

  const li = document.createElement("li");
  li.innerHTML = `<span>${name}</span><span>$${price.toFixed(2)}</span>`;
  document.getElementById("itemList").appendChild(li);

  updateBar();
  showToast(`🛍️ "${name}" added!`);
}

function updateBar() {
  const bar = document.getElementById("budgetBar");
  const percent = budget === 0 ? 0 : Math.min((totalSpent / budget) * 100, 100);
  bar.style.width = percent + "%";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function showOverBudgetModal() {
  document.getElementById("overBudgetModal").style.display = "block";
}

function closeModal() {
  document.getElementById("overBudgetModal").style.display = "none";
}

function loadPredefinedItems() {
  const container = document.getElementById("predefinedItems");
  groceryItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "item-button";
    div.textContent = `${item.name} ($${item.price})`;
    div.onclick = () => addItemFromList(item.name, item.price);
    container.appendChild(div);
  });
}

loadPredefinedItems();

async function searchPrice() {
  const query = document.getElementById("searchInput").value.trim();
  const container = document.getElementById("searchResults");
  container.innerHTML = "Searching...";

  try {
    const res = await fetch('prices.json');
    const list = await res.json();
    const q = query.toLowerCase();
    const filtered = list.filter(item => item.name.toLowerCase().includes(q)).slice(0, 10);
    renderSearchResults(filtered.map(i => ({ title: i.name, price: i.price, image: i.image })));
  } catch (e) {
    console.error(e);
    container.innerHTML = '<p>Failed to load local price list.</p>';
  }
}

function renderSearchResults(items) {
  const container = document.getElementById('searchResults');
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  items.forEach(product => {
    const card = document.createElement('div');
    card.className = 'item-button';

    const titleEl = document.createElement('strong');
    titleEl.textContent = product.title;

    const br1 = document.createElement('br');

    const priceEl = document.createElement('div');
    const hasPrice = typeof product.price === 'number' && !Number.isNaN(product.price);
    priceEl.textContent = hasPrice ? `Price: $${product.price.toFixed(2)}` : 'Price: N/A';

    const br2 = document.createElement('br');

    if (product.image) {
      const img = document.createElement('img');
      img.src = product.image;
      img.width = 80;
      img.alt = product.title;
      card.appendChild(titleEl);
      card.appendChild(br1);
      card.appendChild(priceEl);
      card.appendChild(br2);
      card.appendChild(img);
    } else {
      card.appendChild(titleEl);
      card.appendChild(br1);
      card.appendChild(priceEl);
      card.appendChild(br2);
    }

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add to List';
    addBtn.disabled = !hasPrice;
    addBtn.addEventListener('click', () => addItemFromList(product.title, product.price));

    card.appendChild(document.createElement('br'));
    card.appendChild(addBtn);
    container.appendChild(card);
  });
}
