#!/usr/bin/python3

"""
A script that takes in a txt file containing the data from the Wikimedia 
Commons Chinese decomposition, and outputs a CSV file with the data used for 
radical

https://commons.wikimedia.org/w/index.php?title=Commons:Chinese_characters_decomposition
"""

import re

#TODO: use loggers instead of prints

input_path = "resources/wiki_raw.txt"
output_path = "resources/wiki_processed.txt"

composition_kinds = {
  "一": 1, "吅": 2, "吕": 3,
  "回": 4, "咒": 5, "弼": 6,
  "品": 7, "叕": 8, "冖": 9,
  "+": 10, "*": 11
}

def process_line(line):
  line = line.split();
  ctr = 0

  # Chinese character
  character = line[ctr]
  ctr += 1

  # no. of strokes
  strokes = line[ctr]
  ctr += 1

  # composition type
  kind = composition_kinds[line[ctr]]
  ctr += 1

  parts = []
  for i in range(0, 2):
    # character(s) in part
    parts.extend(line[ctr])
    ctr += 1

    # no. of strokes in part
    strokes = line[ctr]
    ctr += 1

    # verification for part
    if line[ctr] == "?":
      ctr += 1

  # Cangjie input method
  if is_letters(line[ctr]):
    ctr += 1

  # radical
  radical = line[ctr]

  return [character, kind, parts[0], parts[1]]

def is_letters(string):
  """ 
  checks if a string only has alphabetical characters. For some reason,
  isalpha() returns true on some Chinese characters so I can't use that 
  """
  return re.match("^[a-zA-Z]*$", string) != None 

def main():
  with open(input_path, mode="r", encoding="utf-16") as infile:
    with open(output_path, mode="w+", encoding="utf-16") as outfile:
      for line in infile:
        processed = ", ".join(str(x) for x in process_line(line))
        print(processed, file=outfile)

if __name__ == "__main__":
  main()

