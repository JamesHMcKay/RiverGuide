import { IUser } from "./types";

function parseUserObject(input: any): IUser {
    const user: IUser = {
        username: input.username,
        email: input.email,
        provider: input.provider,
        createdAt: input.createdAt,
        id: input._id,
        user_favourites: input.user_favourites ? input.user_favourites : [],
        role: input.role.type,
    };
    return user;
}

export default parseUserObject;
