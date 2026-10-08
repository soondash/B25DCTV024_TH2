import { fetchBooks, postBookApi, deleteBookApi } from './api.js';
import { getFavoriteIds, saveFavoriteIds, getSavedTheme, saveTheme } from './storage.js';

let books = [];
let favoriteIds = getFavoriteIds();

// Truy xuất các phần tử DOM
const bookGrid = document.getElementById('book-grid');
const statusBar = document.getElementById('status-bar');
const favCountEl = document.getElementById('fav-count');
const searchInput = document.getElementById('search-input');
const genreFilter = document.getElementById('genre-filter');
const addForm = document.getElementById('add-book-form');
const themeToggleBtn = document.getElementById('theme-toggle');

// Các trường của Form
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreInput = document.getElementById('genre');
const yearInput = document.getElementById('year');

// 1. Khởi tạo ứng dụng
async function init() {
  initTheme();
  updateFavCounter();

  statusBar.textContent = 'Đang tải...';
  statusBar.classList.remove('error');

  try {
    books = await fetchBooks();
    populateGenresWithSet();
    renderBooks();
  } catch (err) {
    statusBar.textContent = `Lỗi khi tải dữ liệu: ${err.message}`;
    statusBar.classList.add('error');
  }
}

// 2. Tạo danh sách thể loại bằng Set
function populateGenresWithSet() {
  const currentSelected = genreFilter.value;
  genreFilter.textContent = '';

  const defaultOpt = document.createElement('option');
  defaultOpt.value = 'ALL';
  defaultOpt.textContent = 'Tất cả thể loại';
  genreFilter.appendChild(defaultOpt);

  const genreSet = new Set(books.map((b) => b.genre));
  genreSet.forEach((genre) => {
    const opt = document.createElement('option');
    opt.value = genre;
    opt.textContent = genre;
    genreFilter.appendChild(opt);
  });

  if ([...genreSet].includes(currentSelected)) {
    genreFilter.value = currentSelected;
  }
}

// 3. Tạo thẻ sách bằng createElement và textContent (Không dùng innerHTML)
function createBookCardElement(book) {
  const card = document.createElement('article');
  card.className = 'book-card';
  card.dataset.id = book.id;

  const infoDiv = document.createElement('div');

  const titleEl = document.createElement('h3');
  titleEl.className = 'book-title';
  titleEl.textContent = book.title;

  const authorEl = document.createElement('p');
  authorEl.className = 'book-meta';
  authorEl.textContent = `Tác giả: ${book.author}`;

  const genreEl = document.createElement('p');
  genreEl.className = 'book-meta';
  genreEl.textContent = `Thể loại: ${book.genre}`;

  const yearEl = document.createElement('p');
  yearEl.className = 'book-meta';
  yearEl.textContent = `Năm XB: ${book.year}`;

  infoDiv.append(titleEl, authorEl, genreEl, yearEl);

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'card-actions';

  const isFav = favoriteIds.includes(String(book.id));
  const favBtn = document.createElement('button');
  favBtn.type = 'button';
  favBtn.className = isFav ? 'btn-fav active' : 'btn-fav';
  favBtn.dataset.action = 'favorite';
  favBtn.textContent = isFav ? '♥ Đã thích' : '♡ Yêu thích';

  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.className = 'btn-delete';
  delBtn.dataset.action = 'delete';
  delBtn.textContent = 'Xóa';

  actionsDiv.append(favBtn, delBtn);
  card.append(infoDiv, actionsDiv);

  return card;
}

// 4. Lọc kết hợp 2 điều kiện và hiển thị danh sách
function renderBooks() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreFilter.value;

  const filtered = books.filter((book) => {
    const matchName = book.title.toLowerCase().includes(keyword);
    const matchGenre = selectedGenre === 'ALL' || book.genre === selectedGenre;
    return matchName && matchGenre;
  });

  statusBar.classList.remove('error');
  statusBar.textContent = `Đang hiển thị ${filtered.length} / ${books.length} cuốn`;

  bookGrid.textContent = '';
  filtered.forEach((book) => {
    const cardEl = createBookCardElement(book);
    bookGrid.appendChild(cardEl);
  });
}

function updateFavCounter() {
  favCountEl.textContent = String(favoriteIds.length);
}

// 5. Tìm kiếm ngay khi gõ & lọc theo thể loại
searchInput.addEventListener('input', renderBooks);
genreFilter.addEventListener('change', renderBooks);

// 6. Event Delegation cho nút Yêu thích và Xóa trên lưới sách
bookGrid.addEventListener('click', async (e) => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const card = button.closest('.book-card');
  if (!card) return;

  const bookId = String(card.dataset.id);
  const action = button.dataset.action;

  if (action === 'favorite') {
    if (favoriteIds.includes(bookId)) {
      favoriteIds = favoriteIds.filter((id) => id !== bookId);
    } else {
      favoriteIds.push(bookId);
    }
    saveFavoriteIds(favoriteIds);
    updateFavCounter();
    renderBooks();
  } else if (action === 'delete') {
    const targetBook = books.find((b) => String(b.id) === bookId);
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa sách "${targetBook ? targetBook.title : bookId}" không?`
    );
    if (!confirmDelete) return;

    try {
      await deleteBookApi(bookId);
      books = books.filter((b) => String(b.id) !== bookId);
      if (favoriteIds.includes(bookId)) {
        favoriteIds = favoriteIds.filter((id) => id !== bookId);
        saveFavoriteIds(favoriteIds);
        updateFavCounter();
      }
      populateGenresWithSet();
      renderBooks();
    } catch (err) {
      alert(`Lỗi khi xóa sách: ${err.message}`);
    }
  }
});

// 7. Validate Form khi gõ và khi gửi
function validateField(field) {
  const currentYear = new Date().getFullYear();
  let errorMessage = '';

  if (field === titleInput) {
    if (titleInput.value.trim().length < 3) {
      errorMessage = 'Tên sách phải có từ 3 ký tự trở lên.';
    }
    document.getElementById('error-title').textContent = errorMessage;
  } else if (field === authorInput) {
    if (authorInput.value.trim() === '') {
      errorMessage = 'Tác giả là bắt buộc.';
    }
    document.getElementById('error-author').textContent = errorMessage;
  } else if (field === genreInput) {
    if (genreInput.value === '') {
      errorMessage = 'Vui lòng chọn một thể loại.';
    }
    document.getElementById('error-genre').textContent = errorMessage;
  } else if (field === yearInput) {
    const yearVal = Number(yearInput.value);
    if (!yearInput.value.trim() || Number.isNaN(yearVal) || yearVal < 1900 || yearVal > currentYear) {
      errorMessage = `Năm xuất bản phải từ 1900 đến ${currentYear}.`;
    }
    document.getElementById('error-year').textContent = errorMessage;
  }

  return errorMessage === '';
}

[titleInput, authorInput, yearInput].forEach((inputEl) => {
  inputEl.addEventListener('input', () => validateField(inputEl));
});
genreInput.addEventListener('change', () => validateField(genreInput));

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isTitleValid = validateField(titleInput);
  const isAuthorValid = validateField(authorInput);
  const isGenreValid = validateField(genreInput);
  const isYearValid = validateField(yearInput);

  if (!isTitleValid || !isAuthorValid || !isGenreValid || !isYearValid) {
    return;
  }

  const newBookData = {
    id: `B${Date.now()}`,
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    genre: genreInput.value,
    year: Number(yearInput.value)
  };

  try {
    const savedBook = await postBookApi(newBookData);
    // Thêm sách vào đầu danh sách
    books.unshift(savedBook);
    populateGenresWithSet();
    renderBooks();
    addForm.reset();
  } catch (err) {
    alert(`Không thể thêm sách: ${err.message}`);
  }
});

// 8. Chế độ Sáng / Tối (Yêu cầu nâng cao)
function initTheme() {
  const saved = getSavedTheme();
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️ Chế độ sáng';
  }
}

themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  themeToggleBtn.textContent = isDark ? '☀️ Chế độ sáng' : '🌙 Chế độ tối';
  saveTheme(isDark ? 'dark' : 'light');
});

init();
