class Character:
  def __init__(self, cp, kind, part1, part2):
    self.cp     = cp      # int       (code point)
    self.kind   = kind    # int       (kind number)
    self.part1  = part1   # (int)     (components' code points)
    self.part2  = part2   # (int)     (components' code points)

class Database:
  def __init__(self):
    self.char_set   = set() # {Character}
    self.char_map   = {}    # int     -> Character
    self.part1_map  = {}    # (int)   -> {Character}
    self.part2_map  = {}    # (int)   -> {Character}
    self.kind_map   = {}    # int     -> {Character}

  @staticmethod
  def update_map(mapping, key, value):
    """ Updates a map where the value is a set to either create or add to.
    Used specifically for part1, part2 and kind maps"""
    if key in mapping:
      mapping[key].add(value)
    else:
      mapping[key] = {value}
    return mapping

  def add_character(self, char):
    """ Given a Character object, add it to the database's maps """
    self.char_set.add(char);
    self.char_map[char.cp] = char

    self.part1_map  = Database.update_map(self.part1_map, char.part1, char)
    self.part2_map  = Database.update_map(self.part2_map, char.part2, char)
    self.kind_map   = Database.update_map(self.kind_map, char.kind, char)
  
  def find_character(self, cp):
    """ Finds a specific character using a code point """
    return self.char_map.get(cp, None)
    
  def find_characters(self, kind=-1, part1=None, part2=None):
    """ Finds a set of characters given certain criteria """
    matches = self.char_set

    if kind != -1:
      matches = matches & self.kind_map.get(kind, set())

    if part1:
      matches = matches & self.part1_map.get(part1, set())

    if part2:
      matches = matches & self.part2_map.get(part2, set())
  
    return matches
