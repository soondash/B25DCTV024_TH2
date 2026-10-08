export default function GenreFilter({ genres, selectedGenre, onSelectGenre }) {
  return (
    <div className="genre-buttons">
      {genres.map((genre) => (
        <button
          key={genre}
          type="button"
          className={selectedGenre === genre ? "btn-genre active" : "btn-genre"}
          onClick={() => onSelectGenre(genre)}
        >
          {genre === "ALL" ? "Tất cả" : genre}
        </button>
      ))}
    </div>
  );
}
