import { useState } from "react";
import { initialBooks } from "./data/books";
import Header from "./components/Header";
import Section from "./components/Section";
import GenreFilter from "./components/GenreFilter";
import BookList from "./components/BookList";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("ALL");
  const [darkMode, setDarkMode] = useState(false);

  // Tạo danh sách các nút thể loại bằng Set
  const genres = ["ALL", ...new Set(initialBooks.map((book) => book.genre))];

  // Xử lý bật/tắt yêu thích
  const handleToggleFavorite = (bookId) => {
    setFavoriteIds((prevIds) =>
      prevIds.includes(bookId)
        ? prevIds.filter((id) => id !== bookId)
        : [...prevIds, bookId],
    );
  };

  // Lọc sách theo thể loại được chọn
  const filteredBooks =
    selectedGenre === "ALL"
      ? initialBooks
      : initialBooks.filter((book) => book.genre === selectedGenre);

  return (
    <div className={darkMode ? "app-wrapper dark-mode" : "app-wrapper"}>
      <Header
        libraryName="Thư Viện Lớp AIoT"
        favoriteCount={favoriteIds.length}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />

      <main className="container">
        <Section title="Lọc theo thể loại">
          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />
        </Section>

        <Section
          title={`Danh sách sách (${filteredBooks.length} / ${initialBooks.length} cuốn)`}
        >
          <BookList
            books={filteredBooks}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        </Section>
      </main>

      <Footer />
    </div>
  );
}
