const convertUUIDToId = (uuid: string): string => uuid.split("-").join("").substring(0, 24);

export { convertUUIDToId };
