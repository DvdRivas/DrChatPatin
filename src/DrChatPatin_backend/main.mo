/////// MOPS //////
import Map "mo:map/Map";
import {thash} "mo:map/Map";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import List "mo:base/List";

////// BASE /////////


/////// TYPES ///////
import Types "Types"



actor {
  type User = Types.User;
  type UserInfo = Types.UserInfo;
  type DataBase = Types.DataBase;
  type Conv = Types.Conv;
  type Chat = Types.Chat;

  private var dataBase: DataBase = Map.new<User, UserInfo>();
  private let admin: Principal = Principal.fromText("z3z3v-rzxnm-kqddy-f3ccf-5lqi4-huzsj-zw52d-eiq22-hn6j3-vt3jq-iae");
  private stable var accessList: List.List<Principal> = List.nil();

//////////////////////////////////////////////////////////////////////////////////////////////////

  public shared (msg) func ReadChatList(): async [Chat] {
    if(await VerifyAcces(msg.caller)) {
      return []; 
    };
    let userChats: [Chat] = switch (Map.get(dataBase, thash, Principal.toText(msg.caller))){
      case (?found) { found.chats };
      case (null) { [] };
    };
    return userChats;
  };

//////////////////////////////////////////////////////////////////////////////////////////////////

  private func CreateNewChat(user: User, entry: Text): async UserInfo {
    
    let currentId: Nat = 1;
    let conv: Conv = entry;
    let newChat: Chat = {
      id = currentId;
      title = "Chat " # Nat.toText(currentId);
      chat = conv;
    };

    let updatedChats: [Chat] = [newChat];

    let updatedUserInfo: UserInfo = {
      chats = updatedChats;
      currentID = currentId;
    };

    ignore Map.put(dataBase, thash, user, updatedUserInfo);

    return updatedUserInfo;

  };

//////////////////////////////////////////////////////////////////////////////////////////////////

  public shared (msg) func NewChat(encryptedData: Text): async UserInfo {
    if(await VerifyAcces(msg.caller)) {
      return {chats = []; currentID = 0};
    };
    let userInfo: UserInfo = switch (Map.get(dataBase, thash, Principal.toText(msg.caller))){
      case (?found) { found };
      case (null) { let newUserInfo:UserInfo = await CreateNewChat(Principal.toText(msg.caller), encryptedData); return newUserInfo; };
    };

    let currentId: Nat = userInfo.currentID + 1;

    let conv: Conv = encryptedData; 
    
    let newChat: Chat = {
      id = currentId;
      title = "Chat " # Nat.toText(currentId);
      chat = conv;
    };

    let updatedChats = Array.append(userInfo.chats, [newChat]);

    let updatedUserInfo: UserInfo = {

      chats = updatedChats;
      currentID = currentId;
    };
    
    ignore Map.put(dataBase, thash,  Principal.toText(msg.caller), updatedUserInfo);


    return updatedUserInfo;
  };


//////////////////////////////////////////////////////////////////////////////////////////////////

public shared (msg) func UpdateDatabase(id: Nat, hist: Text) {
 if(await VerifyAcces(msg.caller)) {
    return  // si no tiene acceso, devolver lista vacía
  };
 var dataConv = switch (Map.get(dataBase, thash,  Principal.toText(msg.caller))) {
    case (null) { return };
    case (?found) { found }
 };
  let updatedChats = Array.map<Chat, Chat>(dataConv.chats, func (c: Chat): Chat {
        if (c.id == id) {
          return {
            id = c.id;
            title = c.title;
            chat = hist;
          };
        } else {
          return c;
        }
      });

      let updatedUserInfo: UserInfo = {
        chats = updatedChats;
        currentID = dataConv.currentID;
      };
      
    ignore Map.put(dataBase, thash,  Principal.toText(msg.caller), updatedUserInfo);

};

/////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

  public shared (msg) func DeleteChat(id:Nat): async () {
    if(await VerifyAcces(msg.caller)) {
      return 
    };
    let userChats: [Chat] = switch (Map.get(dataBase, thash,  Principal.toText(msg.caller))){
      case (?found) { found.chats };
      case (null) { return }
    };

    let updatedChats = Array.filter<Chat>(userChats, func(chat: Chat): Bool {
        chat.id != id; 
    });

    let updatedUserInfo: UserInfo = {
        chats = updatedChats;
        currentID = switch (Map.get(dataBase, thash,  Principal.toText(msg.caller))) {
            case (?found) { found.currentID }; 
            case (null) { 0 }; 
        };
    };
    ignore Map.put(dataBase, thash,  Principal.toText(msg.caller), updatedUserInfo);
  };

  public shared (msg) func AddAccess(principal: Text ): async Text {
    if (msg.caller != admin) {
      return "Access Denied!" 
    };    
    accessList := List.push<Principal>(Principal.fromText(principal), accessList);
    return "User " # principal # " Added!"
  
  };

  private func VerifyAcces(add: Principal): async Bool {
    return switch (List.find<Principal>(accessList, func p { p == add})) {
      case (?_found) { false };
      case ( null ) { false };
    };
  };

  public shared (msg) func Verify(): async Bool {
    return switch (List.find<Principal>(accessList, func p { p == msg.caller})) {
      case (?_found) { return true };
      case ( null ) { return false};
    };
  };

  public shared (msg) func RemoveAccess(principal: Text): async Text {
    if (msg.caller != admin) {
      return "Access Denied!"
    }; 
    accessList := List.filter<Principal>(accessList, func p {p != Principal.fromText(principal)});
    return "User " # principal # " Removed!" 
  };


};
