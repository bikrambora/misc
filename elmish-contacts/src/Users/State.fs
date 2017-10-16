module User.State

open Elmish
open Fable.Import
open Fable.PowerPack
open Fable.PowerPack.Fetch
open Types
open View

let fetchUsers url =
    promise {
        return! fetchAs<User list> url []
    }

let usersFetch =
    Cmd.ofPromise fetchUsers "https://jsonplaceholder.typicode.com/users" FetchUsersSuccess FetchUsersError

let init () : Model * Cmd<Msg> =
  { users = []; error = false }, usersFetch

let (|Error|NoUsers|Users|) = function
    | { error = true }  -> Error "Error fetching"
    | { users = [] }    -> NoUsers "No users found"
    | { users = users } -> Users users

let root model dispatch =
    match model with
    | Error msg   -> viewNoUsers msg
    | NoUsers msg -> viewNoUsers msg
    | Users users -> viewUsernames users

let update msg model : Model * Cmd<Msg> =
  match msg with
  | FetchUsersSuccess users ->
      printfn "success: %A" (users |> List.head)
      {model with
        users = users;
        error = false}, []
  | FetchUsersError ex ->
      printfn "error: %A" ex
      {model with
        error = true;
        users = []}, []
