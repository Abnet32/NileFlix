import Image from "next/image";
import nieflix from "@/public/nileflix.jpg";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <main className="w-full">
        <section className="grid h-screen md:grid-cols-2">
          <div className="relative hidden md:block min-h-[calc(100dvh-3.75rem)]">
            <Image
              src={nieflix}
              alt="NileFlix"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />
            {/* <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
                E-brary
              </p>
              <h2 className="mt-2 text-3xl font-bold leading-tight">
                Learn coding skills with a clear, guided path.
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/80">
                Short lessons, practical exercises, and step-by-step growth from
                fundamentals to real software projects.
              </p>
            </div> */}
          </div>

          <div className="flex items-center justify-center bg-background/80 p-4 md:p-6">
            <div className="w-full max-w-md">{children}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
