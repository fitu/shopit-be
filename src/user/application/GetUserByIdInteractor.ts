import NotFoundError from "../../shared/error/NotFoundError";
import UserService from "../../user/domain/UserService";
import UserData from "./UserData";

interface GetUserByIdData {
    userId: string;
}

class GetUserByIdInteractor {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async execute({ userId }: GetUserByIdData): Promise<UserData> {
        const user = await this.userService.getUserById(userId);

        if (!user) {
            // TODO: do not hardcode this
            throw new NotFoundError("User not found");
        }

        return UserData.fromModel(user);
    }
}

export type { GetUserByIdData };
export default GetUserByIdInteractor;
