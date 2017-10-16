module User.State

open Elmish
open Elmish.React
open Fable.Core.JsInterop
open Fable.Helpers.React
open Fable.Helpers.React.Props
open Fable.Import
open Fable.PowerPack
open Fable.PowerPack.Fetch
open Types

let fetchUsers url =
    promise {
        return! fetchAs<User list> url []
    }

let usersFetch =
    Cmd.ofPromise fetchUsers "https://jsonplaceholder.typicode.com/users" FetchUsersSuccess FetchUsersError

let init () : Model * Cmd<Msg> =
  { users = []; error = false }, usersFetch

let placeholder msg =
    div [] [ str msg ]

let viewUsername user =
    lazyView placeholder user.name

let viewNoUsers msg =
    section [] [
        lazyView placeholder msg
    ]

let viewUsernames users =
    section [] [
        ul []
            (users |> List.map viewUsername)
    ]

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
