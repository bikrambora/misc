module Counter.Types

type Model = {
    count: int
}

type Msg =
  | Increment
  | Decrement
  | Reset
