open System

type Move = Up | Down | Left | Right
type Position = { x: int; y: int }
type Robot = { position: Position }
type Board = { size: Position }


let moveTo board move robot =
    let { x = x; y = y } = robot.position
    let { x = maxX; y = maxY } = board.size
    match move with
    | Up    when y + 1 <= maxY -> { position = { x = x; y = y + 1 }}
    | Down  when y - 1 >= 0  -> { position = { x = x; y = y - 1 }}
    | Left  when x - 1 >= 0 -> { position = { x = x - 1; y = y }}
    | Right when x + 1 <= maxX -> { position = { x = x + 1; y = y }}
    | _     -> robot

[<EntryPoint>]
let main argv =
    let robot = { position = { x = 0; y = 0 } }
    let board: Board = { size = { x = 4; y = 4 } }
    let sequence = robot
                    |> moveTo board Up
                    |> moveTo board Up
                    |> moveTo board Right
                    |> moveTo board Right
                    |> moveTo board Right
                    |> moveTo board Down

    printfn "%s" (string sequence.position)
    0
