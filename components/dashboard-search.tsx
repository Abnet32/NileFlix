import MovieSearch from "@/components/movie-search";

export default function DashboardSearch() {
  return (
    <div className="px-3 pt-4 sm:px-5">
      <div className="max-w-xl">
        <MovieSearch compact hrefPrefix="/dashboard" />
      </div>
    </div>
  );
}
