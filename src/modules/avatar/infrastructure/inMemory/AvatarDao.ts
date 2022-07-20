import Avatar from "@avatar/domain/Avatar";
import { fromAvatarDaoToModel, fromModelToAvatarDao } from "@avatar/infrastructure/inMemory/avatarParsers";

class AvatarDao {
    readonly id?: string;
    readonly publicId: string;
    readonly url: string;

    constructor({ id, publicId, url }: { id?: string; publicId: string; url: string }) {
        this.id = id;
        this.publicId = publicId;
        this.url = url;
    }

    public toModel(): Avatar {
        return fromAvatarDaoToModel(this);
    }

    public toDao(avatar: Avatar): AvatarDao {
        return fromModelToAvatarDao(avatar);
    }
}

export default AvatarDao;
