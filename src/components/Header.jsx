export default function Header({ email, onSignOut }) {
  return (
    <header className="app-header">
      <h1>Mealbox</h1>
      <div className="header-user">
        <span className="header-email">{email}</span>
        <button className="signout-btn" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}