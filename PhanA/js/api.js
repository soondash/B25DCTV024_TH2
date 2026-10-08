export const MOCKAPI_URL = ''; 

export async function fetchBooks() {
  const url = MOCKAPI_URL || './books.json';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Lỗi tải dữ liệu (HTTP ${response.status})`);
  }
  return await response.json();
}

export async function postBookApi(newBook) {
  if (!MOCKAPI_URL) return newBook;
  const response = await fetch(MOCKAPI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBook)
  });
  if (!response.ok) {
    throw new Error('Không thể thêm sách lên MockAPI');
  }
  return await response.json();
}

export async function deleteBookApi(bookId) {
  if (!MOCKAPI_URL) return true;
  const response = await fetch(`${MOCKAPI_URL}/${bookId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Không thể xóa sách trên MockAPI');
  }
  return true;
}
