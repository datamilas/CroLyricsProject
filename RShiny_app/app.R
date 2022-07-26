


## Imports
library(shiny)
library(plotly)
library(dplyr)
library(shinydashboard)
library(shinyWidgets)

highlight_color = "#3d8dbc"
bars_color = "#d3d3d3"

box_title_style = 'font-size:20px;font-weight: bold'



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

singers_song_num = df[!duplicated(df$Song_ID), ] %>% count(Artist_name)
all_singers = unique(df$Artist_name)
num_singers = length(unique(df$Artist_name))
num_songs = length(unique(df$Song_ID))
num_words = dim(df)[1]


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
  if (is.null(highlighted_bar)) {
    colors = bars_color
  }
  else{
    colors = rapply(list(bars_list == highlighted_bar), function(x)
      ifelse(x, highlight_color, bars_color), how = "replace")
  }
  
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
ui <- dashboardPage(
  dashboardHeader(title = "Cro Lyrics Dashboard"),
  
  dashboardSidebar(sidebarMenu(
    menuItem(
      "Explore by words",
      tabName = "exploreWords",
      icon = icon("align-left")
    ),
    menuItem(
      "Explore by singers",
      tabName = "exploreSingers",
      icon = icon("microphone")
    )
  )),
  
  
  dashboardBody(
    valueBox(
      width = 4,
      tags$p(num_singers, style = "font-size: 120%;"),
      tags$p("Singers", style = "font-size: 150%;"),
      icon = icon("microphone"),
      color = "light-blue"
    ),
    valueBox(
      width = 4,
      tags$p(num_songs, style = "font-size: 120%;"),
      tags$p("Songs", style = "font-size: 150%;"),
      color = "light-blue",
      icon = icon("music")
    ),
    valueBox(
      width = 4,
      tags$p(num_words, style = "font-size: 120%;"),
      tags$p("Words", style = "font-size: 150%;"),
      color = "light-blue",
      icon = icon("align-left")
    ),
    
    tabItems(
      # First tab content
      tabItem(tabName = "exploreWords",
              
              fluidRow(
                box(
                  width = 6,
                  title = p("Words used in the largest number of songs", style = box_title_style),
                  solidHeader = FALSE,
                  status = "primary",
                  column(
                    width = 4,
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
                  
                  column(width = 8, plotlyOutput("barWords"))
                ),
                
                
                box(
                  width = 6,
                  title = span(textOutput("barsSingersTitle"), style = box_title_style),
                  solidHeader = FALSE,
                  status = "primary",
                  column(
                    width = 2,
                    radioButtons("orderingSingers", "Ordering", c("Descending", "Ascending")),
                    radioButtons(
                      "valueSingers",
                      "Absolute value or percentage?",
                      c("Absolute", "Percentage")
                    )
                  ),
                  
                  column(width = 8, plotlyOutput("barSingers"))
                )
              ),
              
              
              
              fluidRow(
                box(
                  width = 7,
                  title = span(textOutput("songsTableTitle"), style = box_title_style),
                  solidHeader = FALSE,
                  status = "primary",
                  actionButton("singersRestart", "Show all singers"),
                  tags$head(tags$style("#singersRestart{margin-bottom: 15px}")),
                  DT::dataTableOutput("songsTable")
                  
                ),
                box(
                  width = 5
                  ,
                  title = span(textOutput("zeroSingersTitle"), style = box_title_style),
                  solidHeader = FALSE,
                  status = "primary",
                  tableOutput('zeroSingersTable')
                  
                )
              )),
      
      # Second tab content
      tabItem(tabName = "exploreSingers",
              fluidRow(
                box(
                  width = 7,
                  title = p("Most used words by singer", style = box_title_style),
                  solidHeader = FALSE,
                  status = "primary",
                  
                  column(
                    width = 4,
                    pickerInput(
                      'singerSelection',
                      "Select a Singer",
                      sort(all_singers),
                      options = list(`live-search` = TRUE)
                    ),
                    selectInput(
                      "word_type_singers",
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
                    radioButtons(
                      "topNSingers",
                      "Select number of words to show",
                      c(5, 10, 20),
                      selected = 10
                    ),
                    radioButtons(
                      "valueWordsSingers",
                      "Absolute value or percentage?",
                      c("Absolute", "Percentage")
                    )
                  ),
                  
                  
                  column(width = 8, plotlyOutput("wordsBySinger"))
                  
                ),
                
                box(
                  width = 5,
                  title = span(textOutput("songsTableSingersTitle"), style = box_title_style),
                  solidHeader = FALSE,
                  status = "primary",
                  DT::dataTableOutput("songsTableSingers")
                )
              ))
    ),
    
    
    hr(),
    
    p(
      span("Sources:"),
      a("lyricstranslate.com,", href = "https://lyricstranslate.com/"),
      a("cuspajz.com,", href = "https://cuspajz.com/"),
      a("tekstovi.net", href = "https://tekstovi.net/")
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
      temp_df <-
        get_subdf_wordsearch(df_unique_lemmas_all, input$search_word)
    }
    return(temp_df)
  })
  
  
  # Get top N words
  top_words_global <- reactive({
    if (top_words_tf()) {
      top_words <-
        arrange(temp_df_global() %>% count(lemma), desc(n))[0:input$topN, ]
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
  temp_df_highlight_word_global <- reactive({
    return(filter(
      temp_df_global(),
      temp_df_global()$lemma == highlight_word_global()
    ))
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
    make_bar_plot(top_words_global(),
                  "lemma",
                  "Number of Songs",
                  colors,
                  source =
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
    
    colors = get_bar_colors(top_words_singers$Artist_name, clicked_singer())
    
    make_bar_plot(
      top_words_singers,
      "Artist_name",
      x_label,
      colors,
      source = "barSingersClicks",
      categoryorder = categoryorder,
    )
    
  })
  
  
  # Render title of barSingers plot
  output$barsSingersTitle <- renderText({
    sprintf("Singers using the word '%s'", highlight_word_global())
    
  })
  
  
  # Table of songs
  output$songsTable = DT::renderDataTable({
    temp_df_table <- temp_df_highlight_word_global()
    if (clicked_singer() != "") {
      temp_df_table <-
        filter(temp_df_table,
               temp_df_table$Artist_name == clicked_singer())
    }
    
    temp_df_table$Lyrics_url <-
      paste0("<a href='",
             temp_df_table$Lyrics_url,
             "'>",
             temp_df_table$Song,
             "</a>")
    
    temp_df_table <-
      temp_df_table[c("Artist_name", "Lyrics_url", "Views")]
    colnames(temp_df_table) <-
      c("Singer", "Song", "Views")
    
    temp_df_table <-
      temp_df_table[order(temp_df_table$Views, decreasing = TRUE),]
    
    rownames(temp_df_table) <-
      NULL        # Resetting index numbers of rows
    temp_df_table
    
  }, escape = FALSE)
  
  
  # Render title of table of songs
  output$songsTableTitle <- renderText({
    if (clicked_singer() == "") {
      sprintf("Songs mentioning the word '%s'", highlight_word_global())
    }
    else{
      sprintf(
        "Songs mentioning the word '%s' by %s",
        highlight_word_global(),
        clicked_singer()
      )
    }
  })
  
  # Render the table of singers not using the word
  output$zeroSingersTable <- renderTable({
    count_songs = temp_df_highlight_word_global() %>% count(Artist_name)
    
    zero_singers <-
      all_singers[!(all_singers %in% count_songs$Artist_name)]   #get singers that do not mention the word
    zero_singers_df <- data.frame(unlist(zero_singers))
    colnames(zero_singers_df) <- c("Singer")
    
    if (dim(zero_singers_df)[1] > 0) {
      zero_singers_df
    }
    else{
      sprintf(
        "All singers in the databse use the word '%s' in at least one of their songs",
        highlight_word_global()
      )
    }
    
  }, colnames = FALSE)
  
  # Render the title of singers that are not using the word
  output$zeroSingersTitle <- renderText({
    sprintf("Singers not using the word '%s'", highlight_word_global())
  })
  
  
  
  ### Explore by singers dashboard
  
  # Follow which word is clicked
  
  temp_df_singers_global <- reactive({
    temp_df <- get_subdf(input$word_type_singers)
    return(temp_df)
  })
  
  top_words_singers_global <- reactive({
    temp_df <- temp_df_singers_global() %>%
      filter(Artist_name == input$singerSelection) %>%
      count(lemma) %>%
      arrange(desc(n))
    
    if (dim(temp_df)[1] >= strtoi(input$topNSingers)) {
      temp_df <-
        temp_df %>% filter(temp_df$n >= temp_df[input$topNSingers, "n"])
    }
    
    return(temp_df)
  })
  
  
  
  clicked_word_singers <- reactiveVal(NULL)
  observeEvent(event_data("plotly_click", source = "wordsBySingerClicks"),
               {
                 clicked_word_singers(event_data("plotly_click", source = "wordsBySingerClicks")$y)
               })
  
  
  observeEvent(list(input$word_type_singers, input$singerSelection), {
    clicked_word_singers(NULL)
  })
  
  # If no word is clicked by the user highlight top word
  highlight_word_singers_global <- reactive({
    if (is.null(clicked_word_singers())) {
      highlight_word <- top_words_singers_global()[1, "lemma"]
    }
    else{
      highlight_word <- clicked_word_singers()
    }
    return(highlight_word)
  })
  
  ## Outputs
  
  
  # Words used by the singer
  output$wordsBySinger <- renderPlotly({
    # Get dataframe filtered by word type
    
    x_label <- "Number of Songs"
    top_words <- top_words_singers_global()
    
    if (input$valueWordsSingers == "Percentage") {
      total_sn <-
        filter(singers_song_num,
               singers_song_num$Artist_name == input$singerSelection)$n
      print(total_sn)
      top_words$n <- top_words$n / total_sn * 100
      x_label <- "Percentage of songs"
    }
    
    colors = get_bar_colors(top_words$lemma, highlight_word_singers_global())
    
    make_bar_plot(
      top_words,
      "lemma",
      colors = colors,
      x_label = x_label,
      source = "wordsBySingerClicks"
    )
  })
  
  
  
  # Table of songs
  output$songsTableSingers = DT::renderDataTable({
    temp_df_table <- temp_df_singers_global() %>%
      filter(Artist_name == input$singerSelection &
               lemma == highlight_word_singers_global()) %>%
      distinct(Song_ID, .keep_all = TRUE) %>%
      arrange(desc(Views))
    
    
    temp_df_table$Lyrics_url <-
      paste0("<a href='",
             temp_df_table$Lyrics_url,
             "'>",
             temp_df_table$Song,
             "</a>")
    
    temp_df_table <-
      temp_df_table[c("Lyrics_url", "Views")]
    colnames(temp_df_table) <-
      c("Song", "Views")
    
    rownames(temp_df_table) <-
      NULL        # Resetting index numbers of rows
    temp_df_table
    
  }, escape = FALSE)
  
  
  # Render title of table of songs by singer
  output$songsTableSingersTitle <- renderText({
    sprintf(
      "Songs by %s mentioning the word '%s'",
      input$singerSelection,
      highlight_word_singers_global()
    )
    
  })
  
  
  
  
}

# Run the application
shinyApp(ui = ui, server = server)
