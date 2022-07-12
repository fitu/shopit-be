import Page, { DEFAULT_ITEMS_PER_PAGE } from "@shared/Page";

const getMockPage = <T>(data: Array<T>): Page<Array<T>> => {
    const page = new Page<Array<T>>({
        data,
        currentPage: 1,
        totalNumberOfDocuments: data.length,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    });

    return page;
};

export { getMockPage };
