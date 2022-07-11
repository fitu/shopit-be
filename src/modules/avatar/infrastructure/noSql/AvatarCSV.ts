import Avatar from "../../domain/Avatar";

class AvatarCSV {
    constructor(public id: string, public publicId: string | null, public url: string | null) {}

    static toModel(avatarCSV: AvatarCSV): Avatar {
        return new Avatar({
            id: avatarCSV.id,
            publicId: avatarCSV.publicId,
            url: avatarCSV.url,
        });
    }
}

export default AvatarCSV;
