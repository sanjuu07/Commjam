function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-pink-100">
      <h1 className="text-2xl font-bold text-blue-600">
        CommJam
      </h1>

      <ul className="flex gap-6 font-medium">
        <li>Home</li>
        <li>Practice</li>
        <li>About</li>
      </ul>
    </nav>
  )
}

export default Navbar