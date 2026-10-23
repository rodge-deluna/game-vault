import { Link, NavLink } from 'react-router'
import { useAuth } from '../auth/useAuth'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? 'text-white' : 'text-gray-400 hover:text-white'
}

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-gray-800">
      <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4">
        <Link to="/" className="text-xl font-bold">
          GameVault
        </Link>

        <NavLink to="/" end className={navLinkClass}>
          Games
        </NavLink>

        {user && (
          <>
            <NavLink to="/backlog" className={navLinkClass}>
              My Backlog
            </NavLink>
            <NavLink to="/import" className={navLinkClass}>
              Import
            </NavLink>
          </>
        )}

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-400">{user.username}</span>
              <button onClick={logout} className="text-sm text-gray-400 hover:text-white">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Log in
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
