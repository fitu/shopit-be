import NotAllowError from "../../shared/error/NotAllowError";
import NotFoundError from "../../shared/error/NotFoundError";
import UserService from "../../user/domain/UserService";
import User from "../domain/User";

import UserData from "./UserData";

interface UpdateUserByIdData {
    userId: string;
    userData: UserData;
}

class UpdateUserByIdInteractor {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async execute({ userId, userData }: UpdateUserByIdData): Promise<UserData> {
        const user = await this.userService.getUserById(userData.id);

        if (!user) {
            // TODO: do not hardcode this
            throw new NotFoundError("User not found");
        }

        const hasUserPermissions = await this.userService.hasUserPermissions(userId, userData.id);

        if (!hasUserPermissions) {
            // TODO: do not hardcode this
            throw new NotAllowError("You are not allow to do this action");
        }

        const userDataWithoutNulls = UserData.filterNulls(userData);
        const userToUpdate = new User({
            ...user,
            ...userDataWithoutNulls,
        });

        const updatedUser = await this.userService.updateUserById(userData.id, userToUpdate);

        return UserData.fromModel(updatedUser);
    }
}

export type { UpdateUserByIdData };
export default UpdateUserByIdInteractor;
