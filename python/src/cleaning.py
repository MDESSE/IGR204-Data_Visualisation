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
        if save_path is not None and state%500==0:
            actors_df = pd.DataFrame(actors).set_index('id').drop(columns_to_drop, axis=1)
            actors_df.to_csv(save_path)

    actors_df = pd.DataFrame(actors).set_index('id').drop(columns_to_drop, axis=1)
    if save_path is not None:
        actors_df.to_csv(save_path)
    return list_of_id


def clean_movies_dataframe(movies: dataframe) -> dataframe :

    """
    Create dataset containing all informations related to a movie (budget, income, popularity...)
    :param movies: tmdb dataset
    :return: dataset with movie informations
    """

    df = movies.copy()
    for col in ['keywords', 'genres', 'spoken_languages']:
        df[col] = df[col].map(lambda values: '-'.join([value['name'] for value in json.loads(values)]))
    df = df.drop(['production_companies', 'production_countries'], axis=1)
    return df

