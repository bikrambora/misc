module Counter.State

open Elmish
open Types

let init () : Model * Cmd<Msg> =
  { count = 0 }, []

let update msg model =
  match msg with
  | Increment ->
      { model with count = model.count + 2 }, []
  | Decrement ->
      { model with count = model.count - 1 }, []
  | Reset ->
      { model with count = 0 }, []
