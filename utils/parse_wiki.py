#!/usr/bin/python3

"""
A script that takes in a txt file containing the data from the Wikimedia Commons Chinese 
decomposition, and outputs a CSV file with the data used for radical

https://commons.wikimedia.org/w/index.php?title=Commons:Chinese_characters_decomposition
"""

import re

#TODO: use loggers instead of prints

input_path = "../resources/wiki_raw.txt"
output_path = "../resources/wiki_processed.txt"

composition_kinds = {
  "一": 1, "吅": 2, "吕": 3,
  "回": 4, "咒": 5, "弼": 6,
  "品": 7, "叕": 8, "冖": 9,
  "+": 10, "*": 11
}

def process_line(line):
  line = line.split();
  ctr = 0

  # 1) Chinese character
  character = line[ctr]
  ctr += 1

  # 2) no. of strokes
  strokes = line[ctr]
  ctr += 1

  # 3) composition type
  if line[ctr] not in composition_kinds:
    print("Composition type for %s was not found" % line[ctr])
    return None
  composition_kind = composition_kinds[line[ctr]]
  ctr += 1

  # 4) character(s) in first part
  part1 = line[ctr]
  ctr += 1

  # 5) no. of strokes in first part
  strokes1 = line[ctr]
  ctr += 1

  # 6) verification for first part
  if line[ctr] == "?":
    ctr += 1

  # 7) character(s) in second part
  part2 = line[ctr]
  ctr += 1

  # 8) no. of strokes in first part
  strokes2 = line[ctr]
  ctr += 1

  # 9) verification for first part
  if line[ctr] == "?":
    ctr += 1

  # 10) Cangjie input method
  if is_letters(line[ctr]):
    ctr += 1

  # 11) radical
  radical = line[ctr]

  return [character, composition_kind, part1, part2]

# checks if a string only has alphabetical characters. For some reason,
# isalpha() returns true on some Chinese character
def is_letters(string):
  return re.match("^[a-zA-Z]*$", string) != None 

def main():
  with open(input_path, mode="r", encoding="utf-16") as infile:
    with open(output_path, mode="w+", encoding="utf-16") as outfile:
      for line in infile:
        processed = ", ".join(str(x) for x in process_line(line))
        print(processed, file=outfile)

if __name__ == "__main__":
  main()

