from models import Character, Database
from flask import Flask, send_file, abort
from flask_restful import Resource, Api
from webargs import fields, validate
from webargs.flaskparser import use_kwargs

# Constants
DB_PATH = "resources/wiki_processed.txt"
MAX_RESULTS = 50


# Helper functions
def int_tuple(iterable):
  return tuple(int(element) for element in iterable)

def chr_list(iterable):
  return [chr(element) for element in iterable]

def ord_tuple(iterable):
  return tuple(ord(element) for element in iterable)

def slice_list(my_list, start, max_length):
  if start >= len(my_list):
    return []
  else:
    end = min(len(my_list), start + max_length)
    return my_list[start:end]

def initialize_db():
  db = Database()
  with open(DB_PATH, mode="r", encoding="utf-16") as db_file:
    for line in db_file:
      parts = line.strip().split(", ")

      cp    = ord(parts[0])
      kind  = int(parts[1])
      part1 = ord_tuple(parts[2])
      part2 = ord_tuple(parts[3])

      character = Character(cp, kind, part1, part2)
      db.add_character(character)

  return db

# Flask things
app = Flask(__name__)
api = Api(app)

class CharacterResource(Resource):
  """ resource for looking up a specific, known character. """
  def get(self, char_cp):
    character = db.find_character(char_cp)

    if character is None:
      abort(404)

    return {
      "character": chr(character.cp),
      "kind": character.kind,
      "part1": chr_list(character.part1),
      "part2": chr_list(character.part2)
    }

class CharactersResource(Resource):
  """ resource for looking up a set of characters via parameters. """

  characters_args = {
    "kind": fields.Int(validate=validate.Range(min=0, max=10)),
    "part1": fields.String(),
    "part2": fields.String(),
    "start": fields.Int(missing=0)
  }

  @use_kwargs(characters_args)
  def get(self, kind, part1, part2, start):
    part1 = int_tuple(part1.split("-")) if part1 else None
    part2 = int_tuple(part2.split("-")) if part2 else None

    characters_set = db.find_characters(kind, part1, part2)
    characters = chr_list([character.cp for character in characters_set])
    characters = slice_list(characters, start, MAX_RESULTS)

    return {
      "characters": characters,
      "num_characters": len(characters_set)
    }

@app.route("/")
def index():
  return send_file("templates/index.html")

api.add_resource(CharacterResource, "/api/char/<int:char_cp>")
api.add_resource(CharactersResource, "/api/chars/")

if __name__ == "__main__":
  db = initialize_db()
  app.run("0.0.0.0")
