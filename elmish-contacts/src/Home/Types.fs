module Home.Types

type Post = {
    userId: int;
    id: int;
    title: string;
    body: string;
}

type Model = string

type Msg =
  | ChangeStr of string
  | FetchedPost of Post
  | FetchError of System.Exception
