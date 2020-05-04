# <center> How to make a successful movie
>**Group Q  : Axel CAMARA, François CULIERE, Matthieu DESSE, Vincent RICHARD and Hiroto YAMAKAWA**



At first, it is essential to define what is a successful movie. 

Several intuition axis : box-office, incomes, difference between incomes and budget, rates on secific web sites (*imdb*, *allociné*), does a blockbuster is a successful movie (high budget, low to high incomes) ?

We can look at  :

- Box-office admission,
- Incomes,

- Difference between incomes and production budget,

- Ratings on specific websites (*imdb*, *allociné*),

  

  We will use all these metrics and some others to try and answer to the question above, both from a financial and creative point of views. 

### A description of the problem

#### Who are the users :

> Producers and more generally cinema professionals $\rightarrow$  business and artistic points of view
>
> Investors $\rightarrow$ Business point of view
>
> Journalists $\rightarrow$ artistic point of view
>
> Cine-lovers $\rightarrow$ artistic points of view

#### What are their backgrounds:

> business people interested in the financial metrics
>
> Artistic people or consumers more interested  with the ratings and others insights (awards, )

#### What are they trying to understand from the Data

>What makes a successful movie ? 
>
>What makes a movie a milestone of a generation. 
>
>How much money is involved for it ? 
>
>How could influence producers to support independent movie ?

#### Is your visualization aimed primarly at exploring or communicating the data?

> I would say communicative rather than Explorative. Therefore, after an important data-mining phase, we will build our visualization to answer questions above and others else ! 



### Questions we may explore :

#### Financial Data:  

- Evolution of most profitable movies
- Investment vs profit (do you need to invest a lot to get a successful movie ?)
- a closer look to the  blockbusters ( from the most expensive to the most  lucrative )
  - https://en.wikipedia.org/wiki/Blockbuster_(entertainment)


#### Geographical Data: 

- Where are successful movies produced (localization of the studio) ? Filming locations ?

- Most powerful studios ?

- Which studios produce the most of successful movies ?

- Where are scenes of successful movie filmed ? (check if data set available)


#### Actors Data: 

- Are famous actors required to produce a successful movie?

- How many actors became famous with a successful movie?

- Are some actors only known for playing successful movie?

- who earn the most ? https://minimaxir.com/2016/04/movie-gender/


#### Consumers:

- Are blockbusters the best rated movies?  (IMDB, Rottentomato ratings)

- How those movies influenced the pop culture (check if data available)

  

### Where does that idea come from :

- We wanted to work on movies but it was a scope way too broad. We then looked for movies with Oscars, but some movies don't have enough information of them(independent studios/ producers). We finally found the right balance with successful movies . 
- Advantages : a lot information more or less structured in the web, producers, categories , actors, studio,  highly documented movies.



### **Data description** :

We will begin with the dataset proposed in IGR204. But we will try to enhance it with external data as well :

- scrapped data (wikipidia, imdb, ...)
- following datasets :
  - https://data.world/crowdflower/blockbuster-database
  - https://github.com/tsKenneth/Film-IMDB-Blockbuster-Prediction/tree/master/Dataset
  - https://minimaxir.com/2016/04/movie-gender/
  - https://editorial.rottentomatoes.com/guide/best-summer-blockbusters-of-all-time/2/
  - http://rstudio-pubs-static.s3.amazonaws.com/342210_7c8d57cfdd784cf58dc077d3eb7a2ca3.html 
  - https://www.omdbapi.com/


