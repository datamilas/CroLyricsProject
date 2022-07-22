This is a repo of my personal project in which I scraped the lyrics of the songs of popular Croatian artists, built an interactive dashboard to analyze the lyrics, and built a clustering algorithm to cluster the artists with similar lyrics.

Steps of the workflow are as follow:

1. [Webscraping the Lyrics](#webscraping-the-lyrics)
2. [Data Cleaning and NLP](#data-cleaning-and-nlp)
3. Summary analysis of lyrics and building Dashboard
4. Clustering

## Webscraping the Lyrics
[This](https://github.com/datamilas/CroLyricsProject/blob/master/Python/google_colab/scraping.ipynb) notebook is used for webscraping and can be run in google colab. It uses BeautifulSoup, selenium and discogs API to scrape lyrics and some additional information on songs 

### Data sources

**Lyrics sources**

[tekstovi.net](https://tekstovi.net)  
**Pros**: has good database of songs, that are easily scrapable using BeautifulSoup  
**Cons**: the lyrics do not have diacritic signs  
**Info to scrape**: song name, lyrics, number of views  
**Scraping method**: BeautifulSoup


[lyricstranslate.com](https://lyricstranslate.com)  
**Pros:** good diacritics, text in english, sometimes info on album and writers  
**Cons:** not as extensive as tekstovi.net  
**Info to scrape:** lyrics, lyrics in english, album, writers  
**Scraping method**: selenium

[cuspajz.com](https://cuspajz.com)  
**Pros:** good diacritics  
**Cons:** not well updated  
**Info to scrape:** lyrics  
**Scraping method**: selenium

Since tekstovi.net has the best database, it is used to get the basline list of songs for every artists, as well as lyrics for those songs. However, since the lyrics on this site are missing diacritic signs, other sources are used to get better lyrics.
<br/><br/>
<br/><br/>
**Additional info about writer, year, album name:**

[diskografija.com](https://diskografija.com)  
**Pros:** reliable info  
**Cons:** not well updated  
**Scraping method**: selenium  

[discogs.com](https://discogs.com)  
**Pros:** has official API  
**Cons:** some mistakes  
**Scraping method**: official API



## Data Cleaning and NLP
[This](https://github.com/datamilas/CroLyricsProject/blob/master/Python/google_colab/scraping.ipynb) notebook is used to perform Data cleaning and NLP.

### Data cleaning
Data cleaning step uses regex to remove the words that are not part of the lyrics, such as "Refren" and "Pripjev". Regex is also used to clean up some weird punctuation.

Since some of the songs have lyrics from several different sources, the priority is given to the most reliable available source. The hierarchy of reliability is as follows: lyricstranslate.com, cuspajz.com, tekstovinet.net.

### NLP
Cleaned data was fed into the [Classla pipline](https://pypi.org/project/classla/) which performs:
- tokenization and sentence splitting
- part-of-speech tagging
- lemmatization
- dependency parsing
= named entity recognition

