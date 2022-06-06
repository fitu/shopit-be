import Page, { DEFAULT_ITEMS_PER_PAGE } from "../../../src/shared/Page";

const getMockPage = <T> (data: Array<T>): Page<Array<T>> => {
    return new Page<Array<T>>({
        data,
        currentPage: 1,
        totalNumberOfDocuments: data.length,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    });
};

export { getMockPage };
