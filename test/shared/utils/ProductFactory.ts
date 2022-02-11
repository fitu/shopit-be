import Product from "../../../src/product/domain/Product";

const emptyProduct = new Product({
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

export { emptyProduct };
