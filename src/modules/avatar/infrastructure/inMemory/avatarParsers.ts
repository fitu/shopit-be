import Avatar from "@avatar/domain/Avatar";
import AvatarDao from "@avatar/infrastructure/inMemory/AvatarDao";

const fromAvatarDaoToModel = (avatarDao: AvatarDao): Avatar => {
    const avatar = new Avatar({
        id: avatarDao.id,
        publicId: avatarDao.publicId,
        url: avatarDao.url,
    });

    return avatar;
};

const fromModelToAvatarDao = (avatar: Avatar): AvatarDao => {
    const avatarDao = new AvatarDao({
        id: avatar.id,
        publicId: avatar.publicId,
        url: avatar.url,
    });

    return avatarDao;
};

export { fromAvatarDaoToModel, fromModelToAvatarDao };
