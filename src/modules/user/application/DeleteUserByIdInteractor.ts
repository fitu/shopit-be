import UserService from "@user/domain/UserService";
import UserHasNotPermissionsError from "@user/application/error/UserHasNotPermissionsError";

type DeleteUserByIdData = {
    readonly userId: string;
    readonly userToDelete: string;
};

class DeleteUserByIdInteractor {
    constructor(private readonly userService: UserService) {}

    public async execute({ userId, userToDelete }: DeleteUserByIdData): Promise<void> {
        const isAdmin = await this.userService.isAdmin(userId);

        if (!isAdmin) {
            throw new UserHasNotPermissionsError();
        }

        await this.userService.deleteUserById(userToDelete);
    }
}

export type { DeleteUserByIdData };
export default DeleteUserByIdInteractor;
