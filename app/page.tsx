import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-shell">
      <section className="hero-wrap">
        <header className="hero-nav">
          <span className="brand-mark">NileFlix</span>
          <div className="hero-nav-actions">
            <Link className="ghost-btn" href="/sign-in">
              Sign in
            </Link>
            <Link className="solid-btn" href="/sign-up">
              Start free
            </Link>
          </div>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">Cinema-grade streaming platform</p>
            <h1>Discover stories you cannot stop watching.</h1>
            <p>
              Stream hand-picked series, blockbuster premieres, and timeless
              classics. Curated rails, instant playback, and secure account sync
              powered by Better Auth.
            </p>
            <div className="hero-cta-row">
              <Link className="solid-btn" href="/sign-up">
                Create your account
              </Link>
              <Link className="ghost-btn" href="/sign-in">
                I already have an account
              </Link>
            </div>
          </div>

          <aside className="hero-panel">
            <h2>Tonight&apos;s lineup</h2>
            <ul>
              <li>
                <span>The Solar Archive</span>
                <small>Sci-fi thriller • 2h 05m</small>
              </li>
              <li>
                <span>Midnight on Delta-9</span>
                <small>Drama • Limited series</small>
              </li>
              <li>
                <span>Rivers of Glass</span>
                <small>Adventure • New release</small>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="feature-row">
        <article className="feature-card">
          <h3>Instant Authentication</h3>
          <p>
            Email/password onboarding and social sign-in designed for fast,
            low-friction account creation.
          </p>
        </article>
        <article className="feature-card">
          <h3>Session Awareness</h3>
          <p>
            Reliable user sessions with smooth redirects keep every visit secure
            and personalized.
          </p>
        </article>
        <article className="feature-card">
          <h3>Cross-device Continuity</h3>
          <p>
            Watch history, profile data, and preferences move with you wherever
            you sign in.
          </p>
        </article>
      </section>
    </main>
  );
}
