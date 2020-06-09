# Ideate

_Goal: generate good concepts and ideas for supporting some of the project’s design requirements_

_artifacts: ideas & sketches_

### 1) Select a design requirement

The idea behind this visualization is to provide insights to the users about keys that make a movie successful. The visualizations will use several metrics and movies' information as box-office admission, incomes, difference between incomes and production budget, ratings on specific websites (*imdb*, *allociné*), does a blockbuster is a successful movie (high budget, low to high incomes).

### 1) Sketch first idea - Word cloud

The idea of this visualization is to create a word cloud based on both movies' genre and movies' description. The user will be able to change the word cloud by manipulating two cursors : popularity and ratings (maybe budget/incomes ?). Users could see easily what concepts are hiding behind a good movies. 

<img src="img/wordcloud.PNG" alt="wordcloud-sketch1" style="zoom:100%;" />

### 2) Sketch another idea - Choropleth map with production companies

Another visualization could focus on repartition of production companies across the world. We could plot each company logo exactly on their address/latitude-longitude. When the user click on the logo, many information could appears in a tooltips like :

- 10 most popular films
- Global budget
- etc

We could color countries by criterions as total budget/incomes. I think we must normalize data because some countries produce a huge number of movies.

The users will be able to filter by rating, budget, etc the number of companies display on the map. Film produce by many companies could be represented as link between two (or several) logo.

![choropleth_map](img/choropleth_map.jpg)

