module User.View

open Elmish.React
module R = Fable.Helpers.React
open Fable.Helpers.React.Props
open Types

let headers =
    ["Name"; "Email"; "Company"; "Username"; "City"]

let placeholder msg =
    R.div [] [R.str msg]

let viewPlaceholder msg =
    R.section [] [lazyView placeholder msg]

let tableHeaders headers =
    [R.tr [] (List.map (fun x -> R.td [] [R.str x]) headers)]

/// Renders a list of users
let viewUsers =
    List.map
        (fun x ->
            R.tr []
                [R.td [] [R.str x.name]
                 R.td [] [R.str x.email]
                 R.td [] [R.str x.company.name]
                 R.td [] [R.str x.username]
                 R.td [] [R.str x.address.city]])

// Main render function for users list
let viewUsernames users =
    R.table
        [ClassName "table"]
        [R.thead [] [R.tr [] (tableHeaders headers)]
         R.tbody [] (viewUsers users)]
