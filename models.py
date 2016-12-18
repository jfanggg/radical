class Character:
  def __init__(self, cp, kind, part1, part2):
    self.cp     = cp      # int       (code point)
    self.kind   = kind    # int       (kind number)
    self.part1  = part1   # (int)     (components' code points)
    self.part2  = part2   # (int)     (components' code points)

class Database:
  def __init__(self):
    self.characters = {}  # int     -> Character   (code point)
    self.part1_map  = {}  # (int)   -> [Character] (code points)
    self.part2_map  = {}  # (int)   -> [Character] (code points)
    self.kind_map   = {}  # int     -> [Character] (kind number)

  @staticmethod
  def update_map(mapping, key, value):
    """ Updates a map where the value is a list to either create or append to.
    Used specifically for part1, part2 and kind maps"""
    if key in mapping:
      mapping[key].append(value)
    else:
      mapping[key] = [value]
    return mapping

  def add_character(self, char):
    """ Given a Character object, add it to the database's maps """
    self.characters[char.cp] = char

    self.part1_map  = Database.update_map(self.part1_map, char.part1, char)
    self.part2_map  = Database.update_map(self.part2_map, char.part2, char)
    self.kind_map   = Database.update_map(self.kind_map, char.kind, char)
  
  def find_character(self, cp):
    """ Finds a specific character using a code point """
    return self.characters.get(cp, None)
    
  def find_characters(self, kind=None, part1=None, part2=None):
    """ Finds a set of characters given certain criteria """
    matches = set(self.characters.values())

    if kind:
      matches &= set(self.kind_map[kind])

    if part1:
      matches &= set(self.part1_map[part1])

    if part2:
      matches &= set(self.part2_map[part2])
  
    return matches
