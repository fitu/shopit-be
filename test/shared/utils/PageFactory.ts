import Page from "../../../src/shared/Page";

const ITEMS_PER_PAGE = 20;

const getMockPage = <T> (data: Array<T>): Page<Array<T>> => {
    return new Page<Array<T>>({
        data,
        currentPage: 1,
        totalNumberOfDocuments: data.length,
        itemsPerPage: ITEMS_PER_PAGE,
    });
};

export { getMockPage };
