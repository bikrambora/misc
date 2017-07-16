open System

type Move = Up | Down | Left | Right
type Position = { x: int; y: int }
type Robot = { position: Position }
type Board = { size: Position }
type State = { robot: Robot; board: Board }

let flip f x y = f y x
let inc = (+) 1
let dec = flip (-) 1

let (|ValidUp|_|) (newY:int, maxY:int) (_:Move) = if newY <= maxY then Some(newY) else None
let (|ValidDown|_|) (newY:int, minY:int) (_:Move) = if newY >= minY then Some(newY) else None
let (|ValidLeft|_|) (newX:int, minX:int) (_:Move) = if newX >= minX then Some(newX) else None
let (|ValidRight|_|) (newX:int, maxX:int) (_:Move) = if newX <= maxX then Some(newX) else None

let moveTo state move =
    let { x = x; y = y } = state.robot.position
    let { x = maxX; y = maxY } = state.board.size
    let moveY newY = { state with robot = { position = { x = x; y = newY } } }
    let moveX newX = { state with robot = { position = { x = newX; y = y } } }
    match move with
    | Up    & ValidUp (inc y, maxY) newY | Down  & ValidDown (dec y, 0) newY        -> moveY newY
    | Left  & ValidLeft (dec x, 0) newX  | Right & ValidRight (inc x, maxX) newX    -> moveX newX
    | _                                                                             -> state

let (|ArrowKey|_|) = function
    | ConsoleKey.UpArrow    -> Some(Up)
    | ConsoleKey.DownArrow  -> Some(Down)
    | ConsoleKey.LeftArrow  -> Some(Left)
    | ConsoleKey.RightArrow -> Some(Right)
    | _                     -> None

[<EntryPoint>]
let main argv =
    let robot = { position = { x = 0; y = 0 } }
    let board: Board = { size = { x = 4; y = 4 } }
    let initialState = { robot = robot; board = board }

    let rec game (state: State) =
        match Console.ReadKey(true).Key with
        | ArrowKey direction -> printfn "%s" (string direction)
                                let newState = moveTo state direction
                                game(newState)
        | ConsoleKey.Escape  -> printfn "exiting"
                                state
        | _                  -> printfn "wrong input"
                                game(state)

    printfn "Use arrow keys to move and ESC to exit"
    let result = game(initialState)
    printfn "%s" (string result.robot.position)
    0
