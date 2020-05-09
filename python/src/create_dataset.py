if __name__ == "__main__":
    import argparse
    from pathlib import Path
    import sys
    import pandas as pd
    import tmdbsimple as tmdb

    project_path = Path().cwd().parent.parent
    data_path = project_path / "data"
    src_path = project_path / "python" / "src"
    sys.path.append(str(src_path))

    from cleaning import create_actors_dataframe

    parser = argparse.ArgumentParser()
    parser.add_argument('params', nargs='*', help='list of parameters')
    parser.add_argument('--dataset', dest='dataset', type=str,
                        help='Choose which dataset you want to create. Just actor is implemented at the moment')
    parser.add_argument('--token', dest='token', type=str,
                        help='Choose which dataset you want to create.')
    args = parser.parse_args()
    
    if 'actor' in args.dataset:
        tmdb.API_KEY = args.token
        credits = pd.read_csv(data_path / "tmdb-movie-metadata" / "tmdb_5000_credits.csv")
        _ = create_actors_dataframe(credits, data_path)