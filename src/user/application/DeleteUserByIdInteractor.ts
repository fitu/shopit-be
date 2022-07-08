import NotAllowError from "../../shared/error/NotAllowError";
import UserService from "../../user/domain/UserService";

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
            // TODO: remove hardcoded
            throw new NotAllowError("You are not allow to do this action");
        }

        await this.userService.deleteUserById(userToDelete);
    }
}

export type { DeleteUserByIdData };
export default DeleteUserByIdInteractor;
