import UserService from "../../user/domain/UserService";
import User from "../domain/User";
import UserHasNotPermissionsError from "./error/UserHasNotPermissionsError";
import UserNotFoundError from "./error/UserNotFoundError";

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
            throw new UserNotFoundError();
        }

        const hasUserPermissions = await this.userService.hasUserPermissions(userId, userData.id);

        if (!hasUserPermissions) {
            throw new UserHasNotPermissionsError();
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
