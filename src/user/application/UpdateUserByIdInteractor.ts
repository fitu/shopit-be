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
        await this.userService.checkUserPermissions(userId, userData.id);

        const user = await this.userService.getUserById(userData.id);

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
