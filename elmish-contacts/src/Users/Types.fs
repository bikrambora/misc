module User.Types

type Geo =
    {lat: string;
     lng: string}

type Address =
    {street: string;
     suite: string;
     city: string;
     zipcode: string;
     geo: Geo}

type Company =
    {name: string;
     catchPhrase: string;
     bs: string}

type User =
    {id: int;
     name: string;
     username: string;
     email: string;
     phone: string;
     website: string;
     address: Address;
     company: Company}

type Model =
    {users: User list;
     error: bool}

type Msg =
    | FetchUsersSuccess of User list
    | FetchUsersError of System.Exception
