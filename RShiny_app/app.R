

## Imports
library(shiny)
library(plotly)
library(dplyr)
library(shinydashboard)

highlight_color = '#FF9673'
bars_color = '#E1C8B4'


## Data
df <- read.csv("./Data/main_df.csv")
df_unique_lemmas_all <-
  df %>% distinct(Song_ID, lemma, .keep_all = TRUE)

df_unique_lemmas <-
  read.csv("./Data/df_unique_lemmas.csv")
proper_nouns <- read.csv("./Data/proper_nouns.csv")
nouns <- read.csv("./Data/nouns.csv")
verbs <- read.csv("./Data/verbs.csv")
adjectives <- read.csv("./Data/adjectives.csv")
adverbs <- read.csv("./Data/adverbs.csv")
determiners <- read.csv("./Data/determiners.csv")

singers_song_num = df[!duplicated(df$Song_ID),] %>% count(Artist_name)
all_singers = unique(df$Artist_name)

## Functions
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


get_subdf_wordsearch <- function(dataframe, words) {
  words <- unlist(strsplit(words, ","))
  words <-
    trimws(words,
           which = c("both", "left", "right"),
           whitespace = "[ \t\r\n]")
  return(filter(dataframe, dataframe$lemma %in% words))
}


get_bar_colors <- function(bars_list, highlighted_bar) {
  colors = rapply(list(bars_list == highlighted_bar), function(x)
    ifelse(x, highlight_color, bars_color), how = "replace")
  return(unlist(colors))
}


make_bar_plot <-
  function(data,
           column_name,
           x_label,
           colors,
           categoryorder = "total ascending",
           title = "",
           source = NULL) {
    plot_ly(
      x = data$n,
      y = data[[column_name]],
      type = "bar",
      source = source,
      text = data[[column_name]],
      textposition = "auto",
      textfont = list(size = 16),
      marker = list(color = colors)
    ) %>%
      layout(
        yaxis = list(categoryorder = categoryorder, showticklabels = FALSE),
        title = title,
        xaxis = list(title = x_label)
      )
    
  }



# Define UI for application that draws a histogram
ui <- fluidPage(
  tags$head(# Note the wrapping of the string in HTML()
    tags$style(HTML(
      "
      body {
        margin: 50px
      }"
    ))),
  
  
  titlePanel("Words used in the largest number of songs"),
  
  
  fluidRow(
    column(
      2,
      
      selectInput(
        "word_type",
        "Select POS type",
        c(
          "All words",
          "General Noun",
          "Proper Noun",
          "Verb",
          "Adjective",
          "Adverb",
          "Determiner"
        ),
        selected = "General Noun"
      ),
      radioButtons("topN", "Select number of words to show", c(5, 10, 20), selected = 10),
      textInput(
        "search_word",
        "Or search for word(s)",
        value = "",
        width = NULL,
        placeholder = NULL
      )
      
    ),
    
    
    
    column(4,
           plotlyOutput("barWords")),
    column(1,),
    column(
      1,
      radioButtons("orderingSingers", "Ordering", c("Descending", "Ascending")),
      radioButtons(
        "valueSingers",
        "Absolute value or percentage?",
        c("Absolute", "Percentage")
      )
    ),
    column(4,
           plotlyOutput("barSingers"))
  ),
  fluidRow(
    column(
      8,
      textOutput("songsTableTitle"),
      tags$head(
        tags$style(
          "#songsTableTitle{font-size: 20px;
                                margin-top: 100px; margin-bottom: 15px}"
        )
      ),
      actionButton("singersRestart", "Show all singers"),
      tags$head(tags$style("#singersRestart{margin-bottom: 15px}")),
      DT::dataTableOutput("songsTable")
      
    ),
    column(1),
    column(
      3,
      textOutput("zeroSingersTitle"),
      tags$head(
        tags$style(
          "#zeroSingersTitle{font-size: 20px;
                                margin-top: 100px; margin-bottom: 15px}"
        )
      ),
      tableOutput('zeroSingersTable')
    )
  )
)



server <- function(input, output) {
  
  ## Observe which input changed
  
  # Check if user is using search option or top words
  top_words_tf <- reactiveVal(TRUE) 
  
  observeEvent(input$search_word, {
    top_words_tf(FALSE)
    clicked_singer("")
    clicked_word(NULL)
    
  })
  
  observeEvent(list(input$word_type, input$topN), {
    top_words_tf(TRUE)
    clicked_singer("")
    clicked_word(NULL)
    
  })
  
  
  # Get dataframe filtered by word type or search term
  temp_df_global <- reactive({
    if (top_words_tf()) {
      temp_df <- get_subdf(input$word_type)
    } else{
      temp_df <- get_subdf_wordsearch(df_unique_lemmas_all, input$search_word)
    }
    return(temp_df)
  })
  
  
  # Get top N words
  top_words_global <- reactive({
    if (top_words_tf()) {
      top_words <- arrange(temp_df_global() %>% count(lemma), desc(n))[0:input$topN,]
    } else{
      top_words <- arrange(temp_df_global() %>% count(lemma), desc(n))
    }
    return(top_words)
  })
  
  # Follow which word is clicked
  clicked_word <- reactiveVal(NULL)
  observeEvent(event_data("plotly_click", source = "barWordsClicks"), {
    clicked_word(event_data("plotly_click", source = "barWordsClicks")$y)
    clicked_singer("")
  })
  
  
  # If no word is clicked by the user highlight top word
  highlight_word_global <- reactive({
    top_words <- top_words_global()
    if (is.null(clicked_word())) {
      highlight_word <- top_words[1, "lemma"]
    }
    else{
      highlight_word <- clicked_word()
    }
    return(highlight_word)
  })

  
  # Get dataframe filtered by highlight word
  temp_df_highlight_word_global <-reactive({
    return(filter(temp_df_global(), temp_df_global()$lemma == highlight_word_global()))
  })
  
  
  # Follow which singer is clicked
  clicked_singer <- reactiveVal("")
  observeEvent(event_data("plotly_click", source = "barSingersClicks"), {
    clicked_singer(event_data("plotly_click", source = "barSingersClicks")$y)
  })
  
  observeEvent(input$singersRestart, {
    clicked_singer("")
  })
  
  
  
  
  
  ## Outputs
  
  # Top words plot
  output$barWords <- renderPlotly({
    colors = get_bar_colors(top_words_global()$lemma, highlight_word_global())
    make_bar_plot(top_words_global(), "lemma", "Number of Songs", colors, source =
                    "barWordsClicks")
  })
  
  
  # Singers using words
  output$barSingers <- renderPlotly({
    count_songs = temp_df_highlight_word_global() %>% count(Artist_name)
    count_songs = merge(count_songs, singers_song_num, "Artist_name", all.x =
                          TRUE)  #add info on total number of songs
    colnames(count_songs) <- c("Artist_name", "n", "total_n")
    count_songs$perc = count_songs$n / count_songs$total_n * 100
    
    if (input$valueSingers == "Percentage") {
      count_songs = subset(count_songs, select = c("Artist_name", "perc"))
      colnames(count_songs) <- c("Artist_name", "n")
      x_label = "Percentage of Songs"
    } else{
      x_label = "Number of Songs"
    }
    
    
    if (input$orderingSingers == "Descending") {
      top_words_singers = arrange(count_songs, desc(n))
      if (dim(top_words_singers)[1] > 10) {
        top_words_singers = filter(top_words_singers,
                                   top_words_singers$n >= top_words_singers[10, "n"])
      }
      categoryorder = "total ascending"
    } else {
      top_words_singers = arrange(count_songs, n)
      if (dim(top_words_singers)[1] > 10) {
        top_words_singers = filter(top_words_singers,
                                   top_words_singers$n <= top_words_singers[10, "n"])
      }
      categoryorder = "total descending"
    }
    
    title = sprintf("Singers using the word '%s'", highlight_word_global())
    colors = get_bar_colors(top_words_singers$Artist_name, clicked_singer())
    
    make_bar_plot(
      top_words_singers,
      "Artist_name",
      x_label,
      colors,
      source = "barSingersClicks",
      categoryorder = categoryorder,
      title = title
    )
  })
  
  
  
  # Table of songs
  output$songsTable = DT::renderDataTable({

    temp_df_table <- temp_df_highlight_word_global()
    if (clicked_singer() != "") {
      temp_df_table <- filter(temp_df_global(), temp_df_global()$Artist_name == clicked_singer())
    }

    temp_df_table$Lyrics_url <-
      paste0(
        "<a href='",
        temp_df_table$Lyrics_url,
        "'>",
        temp_df_table$Lyrics_url,
        "</a>"
      )
    
    temp_df_table <-
      temp_df_table[c("Artist_name", "Song", "Lyrics_url", "Views")]
    colnames(temp_df_table) <-
      c("Singer", "Song", "Lyrics", "Views")
    
    temp_df_table <-
      temp_df_table[order(temp_df_table$Views, decreasing = TRUE), ]
    
    rownames(temp_df_table) <- NULL        # Resetting index numbers of rows
    temp_df_table
    
  }, escape = FALSE)
  
  
  # Render title of table of songs
  output$songsTableTitle <- renderText({

    if (clicked_singer() == "") {
      sprintf("Songs mentioning the word '%s'", highlight_word_global())
    }
    else{
      sprintf("Songs mentioning the word '%s' by %s",
              highlight_word_global(),
              clicked_singer())
    }
  })
  
  
  output$zeroSingersTable <- renderTable({
    count_songs = temp_df_highlight_word_global() %>% count(Artist_name)
    
    zero_singers <-
      all_singers[!(all_singers %in% count_songs$Artist_name)]   #get singers that do not mention the word
    zero_singers_df <- data.frame(unlist(zero_singers))
    colnames(zero_singers_df) <- c("Singer")
    zero_singers_df
  })
  
  output$zeroSingersTitle <- renderText({
    
    sprintf("Singers not using the word '%s'", highlight_word_global())
  })
  
  
}

# Run the application
shinyApp(ui = ui, server = server)
