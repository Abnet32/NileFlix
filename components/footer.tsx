const portfolioHref = "https://abinet.me"; 

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-linear-to-b from-card/70 to-background px-4 py-6 text-sm text-muted-foreground">
      <div className="container mx-auto max-w-7xl">
        {/* <div className="rounded-2xl px-5 py-5"> */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-center lg:text-left">
            <div className="text-sm  text-foreground">
              &copy; {new Date().getFullYear()} NileFlix
            </div>
          </div>

          <p className="max-w-2xl text-center text-xs leading-5 lg:text-center">
            This content is provided by third-party sources and is not hosted,
            produced, or endorsed by NileFlix. We aggregate movie data to help
            you discover titles. All movie information, including posters and
            trailers, is sourced
          </p>

          <div className="flex flex-col items-center gap-2 lg:items-end">
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-foreground">
              <span className="text-xs text-muted-foreground">Made with</span>
              <span aria-hidden className="text-blue-500">
                💙
              </span>
              <a
                href={portfolioHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold transition hover:text-primary hover:underline"
              >
                Abnet
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </footer>
  );
}
