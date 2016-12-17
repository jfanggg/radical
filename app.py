from models import Character, Database
from flask import Flask, send_file
from flask_restful import Resource, Api

# constants
db_path = "resources/wiki_processed.txt"

# initialize data
def initialize_db():
  db = Database()
  with open(db_path, mode="r", encoding="utf-16") as db_file:
    for line in db_file:
      string, kind, part1, part2 = line.split(", ")
      character = Character(ord(string), kind, [part1, part2])
      db.add_character(character)
  return db

db = initialize_db()
  
# initialize Flask
app = Flask(__name__)
api = Api(app)

# Flask-RESTful
class CharacterResource(Resource):
  def get(self, char_cp):
    character = db.find_character(char_cp)
    return {
      "string": chr(character.cp),
      "kind": character.kind,
      "part1": character.parts[0],
      "part2": character.parts[1]
    }

@app.route("/")
def index():
    return send_file("templates/index.html")

api.add_resource(CharacterResource, "/char/<int:char_cp>")

if __name__ == "__main__":
    app.run("0.0.0.0")
