export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-sm text-gray-500">
        <p>© 2026 FixFast. All rights reserved.</p>
        <div className="flex gap-4">
          <a className="hover:text-gray-900 transition" href="#">About</a>
          <a className="hover:text-gray-900 transition" href="#">Privacy</a>
          <a className="hover:text-gray-900 transition" href="#">Terms</a>
          <a className="hover:text-gray-900 transition" href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
