interface AvatarAttributes {
    id: number;
    publicId: string;
    url: string;
}

class Avatar implements AvatarAttributes {
    constructor(public id: number, public publicId: string, public url: string) {}
}

export type { AvatarAttributes };
export default Avatar;
