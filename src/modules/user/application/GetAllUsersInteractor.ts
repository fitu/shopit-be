import Page from "@shared/Page";
import UserService from "@user/domain/UserService";
import UserData from "@user/application/UserData";

type GetAllUsersData = {
    readonly page: number;
    readonly itemsPerPage: number;
};

class GetAllUsersInteractor {
    constructor(private readonly userService: UserService) {}

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
