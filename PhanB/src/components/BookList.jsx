import BookCard from "./BookCard";

export default function BookList({ books, favoriteIds, onToggleFavorite }) {
  if (books.length === 0) {
    return <p>Không có cuốn sách nào thuộc thể loại này.</p>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favoriteIds.includes(book.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
