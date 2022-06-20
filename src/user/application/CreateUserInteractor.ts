import EmailService from "../../shared/integrations/emails/EmailService";
import User from "../domain/User";
import UserService from "../domain/UserService";

import UserData from "./UserData";

interface CreateUserData {
    userData: UserData;
}

class CreateUserInteractor {
    private userService: UserService;
    private emailService: EmailService;

    constructor(userService: UserService, emailService: EmailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    public async execute({ userData }: CreateUserData): Promise<UserData> {
        const newUser = new User({ ...userData });
        const createdUser = await this.userService.insert(newUser);

        this.emailService.sendWelcomeEmail(userData.email);

        return UserData.fromModel(createdUser);
    }
}

export type { CreateUserData };
export default CreateUserInteractor;
