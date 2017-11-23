module User.State

open User.Actions
open User.Types
open User.View

open Elmish

let initialModel =
    {users = [];
     error = false}

let init () =
    initialModel, usersFetch

let (|Error|NoUsers|Users|) = function
    | { error = true }  -> Error "Error fetching"
    | { users = [] }    -> NoUsers "No users found"
    | { users = users } -> Users users

let root model dispatch =
    match model with
    | Error msg   -> viewPlaceholder msg
    | NoUsers msg -> viewPlaceholder msg
    | Users users -> viewUsers users

let update msg model : Model * Cmd<Msg> =
    match msg with
    | FetchUsersSuccess users ->
        printfn "success: %A" (users |> List.head)
        let newState = {model with users = users;}
        newState, clearError
    | FetchUsersError ex ->
        printfn "error: %A" ex
        let newState = {model with error = true;}
        newState, clearUser
    | ClearError ->
        let newState = {model with error = false;}
        newState, []
    | ClearUsers ->
        let newState = {model with users = [];}
        newState, []
