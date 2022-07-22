import EmailService from "@shared/integrations/emails/EmailService";
import User from "@user/domain/User";
import UserService from "@user/domain/UserService";
import EmailAlreadyInUseError from "@user/application/error/EmailAlreadyInUseError";
import UserData from "@user/application/UserData";

type CreateUserData = {
    readonly userData: UserData;
};

class CreateUserInteractor {
    constructor(private readonly userService: UserService, private readonly emailService: EmailService) {}

    public async execute({ userData }: CreateUserData): Promise<UserData> {
        const user: User = await this.userService.getUserByEmail(userData.email);

        if (user) {
            throw new EmailAlreadyInUseError();
        }

        const newUser = new User({ ...userData, password: userData.password });

        const createdUser = await this.userService.insert(newUser);

        this.emailService.sendWelcomeEmail(userData.email);

        return UserData.fromModel(createdUser);
    }
}

export type { CreateUserData };
export default CreateUserInteractor;
