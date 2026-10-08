export default function Header({
  libraryName,
  favoriteCount,
  darkMode,
  onToggleTheme,
}) {
  return (
    <header className="header">
      <h1>📚 {libraryName}</h1>
      <div className="header-actions">
        <span className="fav-badge">❤️ Yêu thích: {favoriteCount}</span>
        <button type="button" className="btn-theme" onClick={onToggleTheme}>
          {darkMode ? "☀️ Chế độ sáng" : "🌙 Chế độ tối"}
        </button>
      </div>
    </header>
  );
}
