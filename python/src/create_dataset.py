if __name__ == "__main__":
    import argparse
    from pathlib import Path
    import sys
    import pandas as pd
    #import tmdbsimple as tmdb

    project_path = Path().cwd().parent.parent
    data_path = project_path / "data"
    src_path = project_path / "python" / "src"
    sys.path.append(str(src_path))

    #from cleaning import create_actors_dataframe
    from cleaning import clean_movies_dataframe

    movies = pd.read_csv(data_path / "tmdb-movie-metadata" / "tmdb_5000_movies.csv")
    _ = clean_movies_dataframe(movies, data_path / "movies_details.csv")


    parser = argparse.ArgumentParser()
    parser.add_argument('params', nargs='*', help='list of parameters')
    parser.add_argument('--dataset', dest='dataset', type=str,
                        help='Choose which dataset you want to create. Just actor is implemented at the moment')
    parser.add_argument('--token', dest='token', type=str,
                        help='Choose which dataset you want to create.')
    parser.add_argument('--actor_id', dest='actor_id', type=int, default=None,
                        help='start the download to the given actor id')
    args = parser.parse_args()
    
    if 'actor' in args.dataset:
        tmdb.API_KEY = args.token
        credits = pd.read_csv(data_path / "tmdb-movie-metadata" / "tmdb_5000_credits.csv")
        _ = create_actors_dataframe(credits, data_path / "actors_bis.csv", actor_id=args.actor_id)
