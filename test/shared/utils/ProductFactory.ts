import Product from "../../../src/product/domain/Product";

const getEmptyProduct = (): Product => {
    return new Product({
        id: "",
        title: "",
        description: "",
        price: 0,
        ratings: 0,
        imageUrl: "",
        // TODO: do not hardcode this
        category: "Electronics",
        stock: 0,
    });
};

const getEmptyProductWithId = (productId: string): Product => {
    return new Product({
        id: productId,
        title: "",
        description: "",
        price: 0,
        ratings: 0,
        imageUrl: "",
        // TODO: do not hardcode this
        category: "Electronics",
        stock: 0,
    });
};

export { getEmptyProduct, getEmptyProductWithId };
