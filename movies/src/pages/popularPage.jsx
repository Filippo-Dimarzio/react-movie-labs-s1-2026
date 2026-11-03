import PageTemplate from "../components/templateMovieListPage";
import { getPopularMovies } from "../api/tmdb-api";
import AddToPlaylistIcon from "../components/cardIcons/addToPlaylist";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/spinner";
import { useState } from "react";



const PopularPage = () => {
  const [page, setPage] = useState(1);
  
  const { data, error, isPending, isError } = useQuery({
    queryKey: ["popular", { page }],
    queryFn: getPopularMovies,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <PageTemplate
      title="Popular Movies"
      movies={data.results}
      action={(movie) => <AddToPlaylistIcon movie={movie} />}
      page={page}
      pageCount={data.total_pages}
      onPageChange={setPage}
    />
  );
};

export default PopularPage;