module User.Actions

open Elmish
open Fable.PowerPack
open Fable.PowerPack.Fetch
open Types

let fetchUsers url =
    promise {
        return! fetchAs<User list> url []
    }

let usersFetch =
    Cmd.ofPromise fetchUsers "https://jsonplaceholder.typicode.com/users" FetchUsersSuccess FetchUsersError

let clearError =
    Cmd.ofMsg ClearError
