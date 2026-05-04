export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/50 bg-slate-950/80 px-8 py-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <span>Built by</span>
          <a
            href="https://www.gopikrishnanb.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#89dc12] hover:underline"
          >
            Gopikrishnan
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Gopi-krishnan-77"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#89dc12] transition-colors"
          >
            GitHub
          </a>
          <span>·</span>
          <span>No data stored · 100% client-side</span>
          <span>·</span>
          <span>© {new Date().getFullYear()} CallCheck</span>
        </div>
      </div>
    </footer>
  )
}
