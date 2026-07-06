export function Footer() {
  return (
    <footer className="py-8 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <p className="text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} TelmaFood. Created by{" "}
          <a
            href="https://github.com/mohammadhossein-asadi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover transition-colors"
          >
            Mohammadhossein Asadi
          </a>
        </p>
      </div>
    </footer>
  );
}
