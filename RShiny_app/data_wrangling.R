
library(dplyr)
library(ggplot2)

#Data
df <- read.csv("Python/R_dataframes/main_df.csv")

df_unique_lemmas <- read.csv("Python/R_dataframes/df_unique_lemmas.csv")
proper_nouns <- read.csv("Python/R_dataframes/proper_nouns.csv")
nouns <- read.csv("Python/R_dataframes/nouns.csv")


get_subdf <- function(wordtype) {
  if (wordtype == "Proper Noun") {
    dataframe = proper_nouns
  } else if (wordtype == "General Noun") {
    dataframe = nouns
  }
  else {
    dataframe = df
  }
  return(dataframe)
}


make_bar_plot <- function(data, x_label){
  g <- data %>% ggplot(aes(x=reorder(lemma,n), y = n))+
    geom_bar(fill = "lightblue", stat = "identity", width=.8, position = position_dodge(width = .25))+
    geom_text(aes(label=lemma, y=(data[,2])))+
    labs(title = "", y = x_label, x = "") +
    coord_flip()+
    theme(legend.position="none")+
    theme(axis.text.y=element_blank(), #remove x axis labels
          axis.ticks.y=element_blank()) #remove x axis ticks
  
  return(g)
  
}


make_plotly_plot <- function(data, x_label){
  fig <- plot_ly(
    x = data$n,
    y = data$lemma,
    type = "bar",
    marker = list(color = as.integer(top_words$lemma == "svijet")))
  
  return(fig)
}
dataframe = get_subdf("General Noun")
top_words = arrange(dataframe %>% count(lemma), desc(n))[0:10, ]


get_bar_colors <- function(bars_list, highlighted_bar){
  colors = rapply(list(bars_list==highlighted_bar),function(x) ifelse(x,'#FF9673','#E1C8B4'), how = "replace")
  return(colors)
}  



plot_ly(
  x = top_words$n,
  y = top_words$lemma,
  type = "bar",
  marker = list(color=unlist(get_bar_colors(top_words$lemma, "san"))))


