import UserService from "@user/domain/UserService";
import User from "@user/domain/User";
import UserHasNotPermissionsError from "@user/application/error/UserHasNotPermissionsError";
import UserNotFoundError from "@user/application/error/UserNotFoundError";
import UserData from "@user/application/UserData";

type UpdateUserByIdData = {
    readonly userId: string;
    readonly userData: UserData;
};

class UpdateUserByIdInteractor {
    constructor(private readonly userService: UserService) {}

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
