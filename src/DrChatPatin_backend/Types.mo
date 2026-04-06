import Map "mo:map/Map";




module Types {
    public type DataBase = Map.Map<User, UserInfo>;
    public type User = Text;

    public type UserInfo = {
        chats: [Chat];
        currentID: Nat;
    };


    public type Chat = {
        id: Nat;
        title: Text;
        chat: Conv;
    };
        
    public type Conv = Text;
}