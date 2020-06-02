from pandas import DataFrame
from requests.models import HTTPError
import pandas as pd
import tmdbsimple as tmdb
import json

flatten = lambda l: [item for sublist in l for item in sublist]


def create_actors_dataframe(credits_df, save_path=None, actor_id=None):
    """Create the dataframe of actors present in the tmdb dataset.
    Parameters
    ----------
    credits_df : pandas.DataFrame
        dataframe from the file tmdb_5000_credits.csv
    save_path : str or None
        Save the dataframe to the given path if not None

    Return
    ------
    pandas.DataFrame
        DataFrame which contains information about actors in the tmdb dataset
    """
    columns_to_drop = ['also_known_as']
    actors = flatten([json.loads(item) for index, item in credits_df.cast.iteritems()])

    if actor_id is not None:
        list_of_id = list(set([actor['id'] for actor in actors]))
        recover_index = list_of_id.index(actor_id)
        list_of_id = list_of_id[recover_index:]
    else:
        list_of_id = set([actor['id'] for actor in actors])
    actors.clear()

    for state, id in enumerate(list_of_id):
        try:
            actor = tmdb.People(id).info()
        except HTTPError:
            print(f'id {id} not found')
        else:
            actors.append(actor)
        if save_path is not None and state % 500 == 0:
            actors_df = pd.DataFrame(actors).set_index('id').drop(columns_to_drop, axis=1)
            actors_df.to_csv(save_path)

    actors_df = pd.DataFrame(actors).set_index('id').drop(columns_to_drop, axis=1)
    if save_path is not None:
        actors_df.to_csv(save_path)
    return list_of_id


def clean_movies_dataframe(movies_df: pd.DataFrame, save_path=None)-> pd.DataFrame:
    """
    Create dataset containing all informations related to a movie (budget, income, popularity...)

    Parameters
    ----------
    movies_df : pandas.DataFrame
        dataframe from the file tmdb_5000_movies.csv
    save_path : str or None
        Save the dataframe to the given path if not None

    Returns
    -------
    pandas.DataFrame
        DataFrame which contains information about movies in the tmdb dataset
    """

    df = movies_df.copy()
    for col in ['keywords', 'genres', 'spoken_languages']:
        df[col] = df[col].map(lambda values: '-'.join([value['name'] for value in json.loads(values)]))
    df['release_date'] = pd.to_datetime(df['release_date'], format='%Y%m%d', errors='ignore')
    df = df.drop(['production_companies', 'production_countries', 'homepage', 'overview', 'tagline'], axis=1)
    df.reset_index(drop=True)
    if save_path is not None:
        df.to_csv(save_path, index=False)

    return df


def create_genders_table(movies_df: pd.DataFrame, save_path: object = None) -> pd.DataFrame:
    """
    Create table (DataFrame) which links gender to our id.
    Parameters
    ----------
    movies_df : pandas.DataFrame
    save_path : str or None
        Save the dataframe to the given path if not None

    Returns
    -------
    pandas.DataFrame
        DataFrame indexing gender to our id

    """
    genders_list = flatten([json.loads(item) for index, item in movies_df.genres.iteritems()])
    genders_set = set([(g['id'], g['name']) for g in genders_list])

    genders_table = pd.DataFrame(genders_set, columns=['id', 'name'])

    if save_path is not None:
        genders_table.to_csv(save_path, index=False)

    return genders_table


def create_genders_movies(movies_df:pd.DataFrame, save_path: object = None) -> pd.DataFrame:
    """
    Create table (DataFrame) which links gender id to movie id

    Parameters
    ----------
    movies_df : pandas.DataFrame
        dataframe from the file tmdb_5000_movies.csv
    save_path : str or None
        Save the dataframe to the given path if not None

    Returns
    -------
    pandas.DataFrame
        DataFrame which contains gender_id and movie_id
    """

    movies_genders = pd.DataFrame({'movie_id': [], 'gender_id': []})
    for index, row in movies_df.iterrows():
        genres = json.loads(row['genres'])
        for genre in genres:
            movies_genders = movies_genders.append({'movie_id': int(row.id), 'gender_id': int(genre['id'])},
                                                   ignore_index=True)
            movies_genders.movie_id = movies_genders.movie_id.astype('int64')
            movies_genders.gender_id = movies_genders.gender_id.astype('int64')
    if save_path is not None:
        movies_genders.to_csv(save_path, index=False)


    return movies_genders
