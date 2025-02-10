import { tmdbObjProps } from "@/components/contexts/tmdbContext";
import TrendingSlides from "@/components/emblaCarousel/templates/trending";
import useTmdbFetch from "@/components/hooks/tmdb";

export default async function TrendingCarousel() {
  const movies: tmdbObjProps[] = [];
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { fetchAllTrending } = useTmdbFetch();

  const response = await fetchAllTrending();
  response && movies.push(...response);

  return movies.length ? <TrendingSlides contentData={movies} /> : null;
}
