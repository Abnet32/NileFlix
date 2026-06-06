const portfolioHref = "https://abinet.me";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-linear-to-b from-card/70 to-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand column */}
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              NileFlix
            </h3>
            <p className="max-w-xs text-xs leading-5 text-muted-foreground">
              Discover movies, TV shows, and anime. Powered by TMDB and VidLink.
            </p>
          </div>

          {/* Attribution column */}
          <div className="text-center">
            <p className="max-w-md text-xs leading-5 text-muted-foreground">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB. All movie information, posters, and trailers are sourced from
              third-party providers.
            </p>
          </div>

          {/* Credits column */}
          <div className="flex flex-col items-center gap-1 md:items-end">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} NileFlix
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Made with</span>
              <span aria-hidden className="text-blue-500">💙</span>
              <a
                href={portfolioHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground transition-colors hover:text-primary hover:underline"
              >
                By Abnet
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
