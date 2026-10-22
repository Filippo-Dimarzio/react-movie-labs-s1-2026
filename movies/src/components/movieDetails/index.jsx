import { useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import MovieReviews from "../movieReviews"
import {useQuery} from "@tanstack/react-query";
import { getMovieRecommendations } from "../../api/tmdb-api";
import { getMovieCredits } from "../../api/tmdb-api";

const root = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: 1.5,
    margin: 0,
};
const chip = { margin: 0.5 };

const MovieDetails = ({ movie }) => {  // Don't miss this!
const [drawerOpen, setDrawerOpen] = useState(false);

const { data: recommendations, error: recommendationsError, isPending: recommendationsPending,
   isError: recommendationsIsError } = useQuery({
  queryKey: ['recommendations', { id: movie.id }],
  queryFn: getMovieRecommendations,
});

const { data: credits, error: creditsError, isPending: creditsPending, 
  isError: creditsIsError } = useQuery({
    queryKey: ["credits", { id: movie.id }],
    queryFn: getMovieCredits,
  }); 

  return (
    <>
      <Typography variant="h5" component="h3">
        Overview
      </Typography>

      <Typography variant="h6" component="p">
        {movie.overview}
      </Typography>

      <Paper 
        component="ul" 
        sx={{...root}}
      >
        <li>
          <Chip label="Genres" sx={{...chip}} color="primary" />
        </li>
        {movie.genres.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} sx={{...chip}} />
          </li>
        ))}
      </Paper>
      
      <Paper component="ul" sx={{...root}}>
        <Chip icon={<AccessTimeIcon />} label={`${movie.runtime} min.`} />
        <Chip
          icon={<MonetizationIcon />}
          label={`${movie.revenue.toLocaleString()}`}
        />
        <Chip
          icon={<StarRate />}
          label={`${movie.vote_average} (${movie.vote_count})`}
        />
        <Chip label={`Released: ${movie.release_date}`} />
      </Paper>
      
      <Paper 
        component="ul" 
        sx={{...root}}
      >
        <li>
          <Chip label="Production Countries" sx={{...chip}} color="primary" />
        </li>
        {movie.production_countries.map((c) => (
          <li key={c.name}>
            <Chip label={c.name} sx={{...chip}} />
          </li>
        ))}
      </Paper>


            <Typography variant="h5" component="h3">
        Recommendations
      </Typography>

      {recommendationsPending ? (
        <Typography>Loading recommendations...</Typography>
      ) : recommendationsIsError ? (
        <Typography color="error">{recommendationsError.message}</Typography>
      ) : (
        <Paper component="ul" sx={{ ...root }}>
          {recommendations.slice(0, 5).map((recommendedMovie) => (
            <li key={recommendedMovie.id}>
              <Chip label={recommendedMovie.title} sx={{ ...chip }} />
            </li>
          ))}
        </Paper>
      )}

      <Typography variant="h5" component="h3">
        Cast
      </Typography>

      {creditsPending ? (
        <Typography>Loading cast...</Typography>
      ) : creditsIsError ? (
        <Typography color="error">{creditsError.message}</Typography>
      ) : (
        <Paper component="ul" sx={{ ...root }}>
          {credits.slice(0, 10).map((person) => (
            <li key={person.credit_id}>
              <Chip
                label={`${person.name} (${person.character})`}
                sx={{ ...chip }}
              />
            </li>
          ))}
        </Paper>
      )}

      <Fab
        color="secondary"
        variant="extended"
        onClick={() =>setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '1em',
          right: '1em'
        }}
      >
        <NavigationIcon />
        Reviews
      </Fab>
      <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MovieReviews movie={movie} />
      </Drawer>

      </>
  );
};
export default MovieDetails ;