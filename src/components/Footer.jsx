export default function Footer() {
  return (
    <footer className="border-t border-surface-container bg-surface-bright/95 backdrop-blur-sm">
      <div className="page-shell py-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold tracking-tight text-on-surface header-anchor">
            University Academic Editorial
          </span>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant max-w-md">
            A clear registration and feedback flow for campus events, workshops, and student life.
          </p>
          <p className="text-[10px] uppercase tracking-widest text-outline">
            © 2026 University Academic Editorial. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 md:justify-end">
          <a className="secondary-action px-4 py-2 text-xs uppercase tracking-widest" href="#">
            Privacy Policy
          </a>
          <a className="secondary-action px-4 py-2 text-xs uppercase tracking-widest" href="#">
            Terms of Service
          </a>
          <a className="secondary-action px-4 py-2 text-xs uppercase tracking-widest" href="#">
            Campus Directory
          </a>
        </div>
      </div>
    </footer>
  )
}