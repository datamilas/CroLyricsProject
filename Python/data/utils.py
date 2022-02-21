import unidecode
import pandas as pd
from difflib import SequenceMatcher
import re

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

def remove_punct(s):
    return re.sub(r'[^\w\s]','',s)



def check_row_similariy(df, column1, column2, threshold=0.7, car_to_check = 100):
    wrong_rows = []
    for row in df.iterrows():
        if type(row[1][column1]) == str and type(row[1][column2]) == str:
            col1_str = remove_punct(lower_and_remove_diacritics("".join(row[1][column1].splitlines())))
            col2_str = remove_punct(lower_and_remove_diacritics("".join(row[1][column2].splitlines())))
            similarity = similar(col1_str[0:car_to_check], col2_str[0:car_to_check])
            if similarity < threshold:
                print(col1_str)
                print("XXXXXX")
                print(col2_str)
                print(similarity)
                print("XXXXXX")
                print("XXXXXX")
                wrong_rows.append(row[0])

    return wrong_rows
