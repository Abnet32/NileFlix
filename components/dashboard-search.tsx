import MovieSearch from "@/components/movie-search";

type DashboardSearchProps = {
  scope?: "all" | "movie" | "tv" | "anime";
};

export default function DashboardSearch({
  scope = "all",
}: DashboardSearchProps) {
  return (
    <div className="px-3 pt-4 sm:px-5">
      <div className="max-w-4xl mx-auto">
        <MovieSearch compact hrefPrefix="/dashboard" defaultScope={scope} />
      </div>
    </div>
  );
}
