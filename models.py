class Character:
  def __init__(self, cp, kind, parts):
    self.cp     = cp      # int   (code point)
    self.kind   = kind    # int   (kind number)
    self.parts  = parts   # [int] (components' code points)

class Database:
  def __init__(self):
    self.characters = {}  # int -> Character   (code point)
    self.part_map   = {}  # int -> [Character] (code points)
    self.kind_map   = {}  # int -> [Character] (kind number)

  def add_character(self, char):
    """ Given a Character object, add it to the database's maps """

    # characters
    self.characters[char.cp] = char

    # part map
    for part in char.parts:
      if part in self.part_map:
        self.part_map[part].append(char)
      else:
        self.part_map[part] = [char]

    # kind map
    if char.kind in self.kind_map:
      self.kind_map[char.kind].append(char)
    else:
      self.kind_map[char.kind] = [char]
  
  # a simple find method for testing. Will be replaced later
  def find_character(self, cp):
    return self.characters[cp]
