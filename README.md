# Bài thực hành 02 - Lập trình Web

## So sánh cách làm giao diện bằng DOM thuần (Phần A) và React (Phần B)

| Tiêu chí | Phần A – JavaScript thuần (DOM) | Phần B – React cơ bản |
| :--- | :--- | :--- |
| **Cách tiếp cận** | **Imperative (Mệnh lệnh):** Lập trình viên phải chỉ định từng bước thao tác DOM (`document.createElement`, `textContent`, `appendChild`, xóa node cũ khi render lại). | **Declarative (Khai báo):** Chỉ cần mô tả giao diện thông qua JSX dựa trên trạng thái (`state`). React tự động cập nhật DOM khi `state` thay đổi. |
| **Quản lý trạng thái (State)** | Biến toàn cục/module (`books`, `favoriteIds`) tách rời với giao diện; khi dữ liệu đổi phải tự gọi hàm `renderBooks()` và `updateFavCounter()` thủ công. | Dữ liệu và giao diện đồng bộ tự động thông qua hook `useState`. Khi gọi `setFavoriteIds`, cả `Header` và `BookCard` tự động render lại. |
| **Xử lý sự kiện** | Phải gắn `addEventListener` thủ công và dùng kỹ thuật **Event Delegation** (`e.target.closest()`) trên thẻ cha để tối ưu cho các phần tử sinh động. | Gắn trực tiếp sự kiện (`onClick`) lên từng component và truyền hàm xử lý từ cha xuống con thông qua `props` một cách tường minh. |
| **Khả năng tái sử dụng** | Khó tách nhỏ và tái sử dụng giao diện; code tạo DOM bằng `createElement` dài dòng khi cấu trúc thẻ phức tạp. | Tách giao diện thành các Component độc lập (`Header`, `Section`, `GenreFilter`, `BookCard`, `BookList`, `Footer`), tái sử dụng linh hoạt nhờ `props` và `children`. |
