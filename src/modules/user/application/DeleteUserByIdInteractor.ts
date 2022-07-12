import UserService from "@user/domain/UserService";
import UserHasNotPermissionsError from "@user/application/error/UserHasNotPermissionsError";

interface DeleteUserByIdData {
    userId: string;
    userToDelete: string;
}

class DeleteUserByIdInteractor {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

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
