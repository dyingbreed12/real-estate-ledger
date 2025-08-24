export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4 text-primary">Ledger App</h2>
      <ul className="space-y-2">
        <li><a href="#employees" className="hover:text-primary">Employees</a></li>
        <li><a href="#address" className="hover:text-primary">Address</a></li>
        <li><a href="#calculator" className="hover:text-primary">Calculator</a></li>
        <li><a href="#graphs" className="hover:text-primary">Graphs</a></li>
        <a href="/crystal-ball" className="block px-4 py-2 rounded hover:bg-gray-200">
             🔮 Crystal Ball
        </a>
      </ul>
    </aside>
  );
}
