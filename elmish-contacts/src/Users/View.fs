module User.View

open Elmish.React
module R = Fable.Helpers.React
open Fable.Helpers.React.Props
open Types

let placeholder msg =
    R.div [] [ R.str msg ]

let viewUsername user =
    lazyView placeholder user.name

let viewPlaceholder msg =
    R.section [] [
        lazyView placeholder msg
    ]

let tableRow xs =
    R.tr[] [ for x in xs -> R.td [] [R.str x.name] ]

let viewUsernames users =
    R.table [ ClassName "table" ]
        [
            R.thead [] [ R.td [] [R.str "Name"]];
            R.tbody [] [ tableRow users ]
        ]
    // R.section [] [
    //     R.ul []
    //         (users |> List.map viewUsername)
    // ]
