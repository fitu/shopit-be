import UserService from "@user/domain/UserService";
import UserNotFoundError from "@user/application/error/UserNotFoundError";
import UserData from "@user/application/UserData";

type GetUserByIdData = {
    readonly userId: string;
};

class GetUserByIdInteractor {
    constructor(private readonly userService: UserService) {}

    public async execute({ userId }: GetUserByIdData): Promise<UserData> {
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new UserNotFoundError();
        }

        return UserData.fromModel(user);
    }
}

export type { GetUserByIdData };
export default GetUserByIdInteractor;
