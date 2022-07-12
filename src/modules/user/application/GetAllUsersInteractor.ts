import Page from "@shared/Page";
import UserService from "@user/domain/UserService";
import UserData from "@user/application/UserData";

interface GetAllUsersData {
    page: number;
    itemsPerPage: number;
}

class GetAllUsersInteractor {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    public async execute({ page, itemsPerPage }: GetAllUsersData): Promise<Page<Array<UserData>>> {
        const allUsersWithMetadata = await this.userService.getAllUsers(page, itemsPerPage);

        return {
            ...allUsersWithMetadata,
            data: allUsersWithMetadata.data.map((user) => UserData.fromModel(user)),
        };
    }
}

export type { GetAllUsersData };
export default GetAllUsersInteractor;
