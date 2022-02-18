import unidecode
import pandas as pd
from difflib import SequenceMatcher


def lower_and_remove_diacritics(string):
    return unidecode.unidecode(string.lower())


def check_if_titles_match(df, old_column, new_column):
    # manually check if some songs got wrong lyrics
    df1 = df.copy().dropna(subset=[old_column, new_column])
    df1[old_column] = df1[old_column].map(
        lambda x: lower_and_remove_diacritics(x))
    df1[old_column] = df1[old_column].str.split('(').str[0]
    df1[old_column] = df1[old_column].str.strip()
    df1[new_column] = df1[new_column].map(
        lambda x: lower_and_remove_diacritics(x))
    df1[new_column] = df1[new_column].str.split('(').str[0]
    df1[new_column] = df1[new_column].str.strip()

    return df1[df1[old_column] != df1[new_column]][[old_column, new_column]]


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()


def check_row_similariy(df, column1, column2, threshold=0.05):
    for row in df.iterrows():
        if type(row[1][column1]) == str and type(row[1][column2]) == str:
            similarity = similar(lower_and_remove_diacritics(" ".join(row[1][column1].splitlines(
            ))), lower_and_remove_diacritics(" ".join(row[1][column2].splitlines())))
            if similarity < threshold:
                wrong_rows.append(row[0])

    return wrong_rows
