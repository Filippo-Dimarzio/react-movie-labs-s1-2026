import { useContext } from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import { useQueries } from "@tanstack/react-query";
import { getMovie } from "../api/tmdb-api";
import Spinner from "../components/spinner";
import RemoveFromPlaylistIcon from "../components/cardIcons/removeFromPlaylist";

const PlaylistPage = () => {
    const {playlist: movieIds} = useContext(MoviesContext);

    const playlistMovieQueries = useQueries({
    queries: movieIds.map((movieId) => ({
      queryKey: ["movie", { id: movieId }],
      queryFn: getMovie,
    })),
  });

  const isPending = playlistMovieQueries.find((movie) => movie.isPending);
  if (isPending){
    return <Spinner />;
  }

const failedQuery = playlistMovieQueries.find((movie) => movie.isError);
if (failedQuery) {
  return <h1>{failedQuery.error.message}</h1>;
}

const movies = playlistMovieQueries.map((query) => {
    return query.data;
});

return (
    <PageTemplate
        title="Must Watch Movies"
        movies={movies}
         action={(movie) => <RemoveFromPlaylistIcon movie={movie} />}
    />
);
};

export default PlaylistPage;

