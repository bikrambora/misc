open System

type Move = Up | Down | Left | Right
type Position = { x: int; y: int }
type Robot = { position: Position }
type Board = { size: Position }

let (|ValidUp|_|) (y, maxY) (_:Move) = if y + 1 <= maxY then Some(y + 1) else None
let (|ValidDown|_|) (y, minY) (_:Move) = if y - 1 >= minY then Some(y - 1) else None
let (|ValidLeft|_|) (x, minX) (_:Move) = if x - 1 <= minX then Some(x - 1) else None
let (|ValidRight|_|) (x, maxX) (_:Move) = if x + 1 <= maxX then Some(x + 1) else None

let moveTo board (move:Move) robot =
    let { x = x; y = y } = robot.position
    let { x = maxX; y = maxY } = board.size
    let verticalMove newY = { position = { x = x; y = newY } }
    let horizontalMove newX = { position = { x = newX; y = y } }
    match move with
    | Up    & ValidUp (y, maxY) newY | Down  & ValidDown (y, 0) newY        -> verticalMove newY
    | Left  & ValidLeft (x, 0) newX  | Right & ValidRight (x, maxX) newX    -> horizontalMove newX
    | _                                                                     -> robot

[<EntryPoint>]
let main argv =
    let robot = { position = { x = 0; y = 0 } }
    let board: Board = { size = { x = 4; y = 4 } }
    let sequence = robot
                    |> moveTo board Up
                    |> moveTo board Right
                    |> moveTo board Right
                    |> moveTo board Up
                    |> moveTo board Up
                    |> moveTo board Left

    printfn "%s" (string sequence.position)
    0
