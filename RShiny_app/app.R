#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#
#Imports
library(shiny)
library(plotly)
library(dplyr)
library(shinydashboard)


highlight_color = '#FF9673'
bars_color = '#E1C8B4'

#Data
print(getwd())
df <- read.csv("../Python/R_dataframes/main_df.csv")
df_unique_lemmas <- read.csv("../Python/R_dataframes/df_unique_lemmas.csv")
proper_nouns <- read.csv("../Python/R_dataframes/proper_nouns.csv")
nouns <- read.csv("../Python/R_dataframes/nouns.csv")
verbs <- read.csv("../Python/R_dataframes/verbs.csv")
adjectives <- read.csv("../Python/R_dataframes/adjectives.csv")
adverbs <- read.csv("../Python/R_dataframes/adverbs.csv")
determiners <- read.csv("../Python/R_dataframes/determiners.csv")

singers_song_num = df[!duplicated(df$Song_ID), ]%>% count(Artist_name)


#Functions

get_subdf <- function(wordtype) {
  if (wordtype == "Proper Noun") {
    dataframe = proper_nouns
  } 
  else if (wordtype == "General Noun") {
    dataframe = nouns
  }
  else if (wordtype == "Verb") {
  dataframe = verbs
  }
  else if (wordtype == "Adjective") {
  dataframe = adjectives
  }
  else if (wordtype == "Adverb") {
  dataframe = adverbs
  }
  else if (wordtype == "Determiner") {
  dataframe = determiners
  }
  else {
    dataframe = df_unique_lemmas
  }
  return(dataframe)
}

get_subdf_wordsearch <-function(dataframe, words){
  words <- unlist(strsplit(words,","))
  words <- trimws(words, which = c("both", "left", "right"), whitespace = "[ \t\r\n]")
  return(filter(dataframe, dataframe$lemma %in% words))
}


get_bar_colors <- function(bars_list, highlighted_bar){
  colors = rapply(list(bars_list==highlighted_bar),function(x) ifelse(x, highlight_color, bars_color), how = "replace")
  return(unlist(colors))
}  

make_bar_plot <- function(data, column_name, x_label, colors, categoryorder = "total ascending", title="", source=NULL){
  plot_ly(
    x = data$n,
    y = data[[column_name]],
    type = "bar", source=source,
    text = data[[column_name]],
    textposition = "auto",
    textfont = list(size = 16),
    marker = list(color = colors))%>% 
    layout(yaxis = list(categoryorder = categoryorder, showticklabels = FALSE),
           title = title, 
           xaxis = list(title = x_label))

}



# Define UI for application that draws a histogram
ui <- fluidPage(
  
  tags$head(
    # Note the wrapping of the string in HTML()
    tags$style(HTML("
      body {
        margin: 50px
      }"))
  ),


    # Application title
    titlePanel("Words used in the largest number of songs"),
    
    
    fluidRow(
      column(2,
             
               selectInput("word_type", "Select POS type", 
                           c("All words", "General Noun", "Proper Noun", "Verb", "Adjective", "Adverb", "Determiner"),
                           selected = "General Noun"),
               radioButtons("topN", "Select number of words to show", c(5, 10, 20), selected = 10),
               textInput("search_word", "Or search for word(s)", value = "", width = NULL, placeholder = NULL)
               
             ),
             
             
          
      column(4,
             # Show a plot of the generated distribution
               plotlyOutput("barWords")
               
      ),
      column(1,
      ),
      column(1,
             radioButtons("orderingSingers", "Ordering", c("Descending", "Ascending")),
             radioButtons("valueSingers", "Absolute value or percentage?", c("Absolute", "Percentage"))
      ),
      column(4,
             plotlyOutput("barSingers")
      )
    ),
    fluidRow(
      column(10,
        textOutput("songsTableTitle"),
        tags$head(tags$style("#songsTableTitle{font-size: 25px;
                                margin-top: 100px; margin-bottom: 15px}")
        ),
        actionButton("singersRestart", "Show all singers"),
        tags$head(tags$style("#singersRestart{margin-bottom: 15px}")
        ),       
        DT::dataTableOutput("songsTable")
        
    ) )
)

# Define server logic required to draw a histogram
server <- function(input, output) {

  
  

  ### generate bar plot based on input$word_type from ui.R
  #observe which input changed  
    top_words_tf <- reactiveVal(TRUE)
    
    observeEvent(input$search_word, {
      top_words_tf(FALSE)
      clicked_singer("")
      clicked_word(NULL)

    })
  
    observeEvent(list(input$word_type,input$topN), {
      top_words_tf(TRUE)
      clicked_singer("")
      clicked_word(NULL)
      
    })

    
    top_words_global <- reactive({
      if (top_words_tf()){
        temp_df = get_subdf(input$word_type)
        top_words = arrange(temp_df %>% count(lemma), desc(n))[0:input$topN, ]
      }else{
        temp_df = get_subdf_wordsearch(df, input$search_word)
        top_words = arrange(temp_df %>% count(lemma), desc(n))
      }
      return(top_words)
    })
    
    
    clicked_word <- reactiveVal(NULL)
    
    observeEvent(event_data("plotly_click", source = "barWordsClicks"), {
      clicked_word(event_data("plotly_click", source = "barWordsClicks")$y)
      clicked_singer("")
      
    })
    
    clicked_singer <- reactiveVal("")
    observeEvent(event_data("plotly_click", source = "barSingersClicks"), {
     clicked_singer(event_data("plotly_click", source = "barSingersClicks")$y)
    })
    
    observeEvent(input$singersRestart, {
      clicked_singer("")
    })
    
    
    

    #render appropriate plot
    output$barWords <- renderPlotly({

      top_words = top_words_global()
      if (is.null(clicked_word())){highlight_word = top_words[1, "lemma"]}
      else{highlight_word = clicked_word()}
      
      colors = get_bar_colors(top_words$lemma, highlight_word)
      make_bar_plot(top_words, "lemma", "Number of Songs", colors, source="barWordsClicks")

      })
    
    
    
    output$barSingers <- renderPlotly({
      
      top_words = top_words_global()
      if (is.null(clicked_word())){highlight_word = top_words[1, "lemma"]}
      else{highlight_word = clicked_word()}
      
      
      if (top_words_tf()){
        temp_df = get_subdf(input$word_type)
      }else{
        temp_df = get_subdf_wordsearch(df, input$search_word)
      }
      
      temp_df_singers = filter(temp_df, temp_df$lemma==highlight_word)
      count_songs = temp_df_singers %>% count(Artist_name)
      count_songs = merge(count_songs, singers_song_num, "Artist_name", all.x=TRUE)
      colnames(count_songs) <- c("Artist_name", "n", "total_n")
      count_songs$perc = count_songs$n/count_songs$total_n*100
      
      if (input$valueSingers=="Percentage"){
        count_songs = subset(count_songs, select=c("Artist_name", "perc"))
        colnames(count_songs) <- c("Artist_name", "n")
        x_label = "Percentage of Songs"
      }else{x_label = "Number of Songs"}
      
      
      if (input$orderingSingers == "Descending"){
        top_words_singers = arrange(count_songs, desc(n))
        top_words_singers = filter(top_words_singers, top_words_singers$n>=top_words_singers[10, "n"])
        categoryorder = "total ascending"
      }else {
        top_words_singers = arrange(count_songs, n)
        top_words_singers = filter(top_words_singers, top_words_singers$n<=top_words_singers[10, "n"])
        categoryorder = "total descending"
      }
      
      title = sprintf("Singers mentioning the word '%s'", highlight_word)

      colors = get_bar_colors(top_words_singers$Artist_name, clicked_singer())
      
      make_bar_plot(top_words_singers, "Artist_name", x_label, colors, source="barSingersClicks", categoryorder = categoryorder, title=title)
      
      
    })
    
    
    

    output$songsTable = DT::renderDataTable({
      top_words = top_words_global()
      if (is.null(clicked_word())){highlight_word = top_words[1, "lemma"]}
      else{highlight_word = clicked_word()}
      
      
      if (top_words_tf()){
        temp_df = get_subdf(input$word_type)
      }else{
        temp_df = get_subdf_wordsearch(df, input$search_word)
      }
      
      if (clicked_singer()!=""){
        temp_df <- filter(temp_df, temp_df$Artist_name==clicked_singer())
      }
      temp_df_singers <- filter(temp_df, temp_df$lemma==highlight_word)
      temp_df_singers$Lyrics_url <- paste0("<a href='",temp_df_singers$Lyrics_url,"'>",temp_df_singers$Lyrics_url,"</a>")
      
      temp_df_singers <- temp_df_singers[c("Artist_name", "Song", "Lyrics_url", "Views")]
      colnames(temp_df_singers) <- c("Singer", "Song", "Lyrics", "Views")

      temp_df_singers <- temp_df_singers[order(temp_df_singers$Views, decreasing = TRUE),]
      
      rownames(temp_df_singers) <- NULL        # Resetting index numbers of rows
      temp_df_singers
      
      }, escape = FALSE)
    
    
    output$songsTableTitle <- renderText({
      top_words <- top_words_global()
      
      if (is.null(clicked_word())){highlight_word = top_words[1, "lemma"]}
      else{highlight_word = clicked_word()}
      
      if (clicked_singer()==""){sprintf("Songs mentioning the word '%s'", highlight_word)}
      else{sprintf("Songs mentioning the word '%s' by %s", highlight_word, clicked_singer())}
    })

  }

# Run the application 
shinyApp(ui = ui, server = server)
