module Global

type Page =
  | Home
  | Counter
  | About
  | Users

let toHash page =
  match page with
  | About -> "#about"
  | Counter -> "#counter"
  | Home -> "#home"
  | Users -> "#users"
