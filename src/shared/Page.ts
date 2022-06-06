import { Request } from "express";
import { isNil } from "lodash";

const DEFAULT_ITEMS_PER_PAGE = 5;

class Page<T> {
    readonly data: T;
    readonly total: number;
    readonly currentPage: number;
    readonly previousPage: number;
    readonly nextPage: number;
    readonly lastPage: number;
    readonly hasPreviousPage: boolean;
    readonly hasNextPage: boolean;

    constructor({
        data,
        currentPage,
        totalNumberOfDocuments,
        itemsPerPage,
    }: {
        data: T;
        currentPage: number;
        totalNumberOfDocuments: number;
        itemsPerPage: number;
    }) {
        const hasMorePages = itemsPerPage * currentPage < totalNumberOfDocuments;
        const hasLessPages = currentPage > 1;

        this.data = data;
        this.total = totalNumberOfDocuments;
        this.currentPage = currentPage;
        this.previousPage = hasLessPages ? currentPage - 1 : null;
        this.nextPage = hasMorePages ? currentPage + 1 : null;
        this.lastPage = Math.ceil(totalNumberOfDocuments / itemsPerPage);
        this.hasPreviousPage = hasMorePages;
        this.hasNextPage = hasLessPages;
    }
};

const getPageAndItemsPerPage = (req: Request): Array<number> => {
    const { page, itemsPerPage } = req.query;
    const pageToRequest = !isNil(page) && !isNaN(+page) ? +page : 1;
    const itemsPerPageToRequest = !isNil(itemsPerPage) && !isNaN(+itemsPerPage) ? +itemsPerPage : DEFAULT_ITEMS_PER_PAGE;

    return [pageToRequest, itemsPerPageToRequest];
};

export { DEFAULT_ITEMS_PER_PAGE };
export default Page;
export { getPageAndItemsPerPage };
