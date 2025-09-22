import { UpdatedAt } from "sequelize-typescript";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { InputPlaceOrderDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

describe("PlaceOrderUseCase unit test", () => {
    describe("validateProducts method", () => {
        const mockClientFacade = {
            add: jest.fn(),
            find: jest.fn().mockResolvedValue(true),
        };

        const mockProductFacade = {
            addProduct: jest.fn(),
            findProduct: jest.fn(),
            checkStock: jest.fn(({ productId }: { productId: string }) => Promise.resolve({
                productId,
                stock: productId === "33f2ac2f-dfd5-4c64-8c7c-84ef1e9da902" ? 0 : 10
            }))
        };

        const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade);

        it("should throw error if no products are selected", async () => {
            // Arrange
            const input: InputPlaceOrderDto = { clientId: "a18d6a80-1ff5-4bd2-b098-0cfbd94d7a92", products: [] };

            // Act & Assert
            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrowError("No products selected");
        });

        it("should throw an error when product is out of stock", async () => {
            let input: InputPlaceOrderDto = {
                clientId: "a18d6a80-1ff5-4bd2-b098-0cfbd94d7a92",
                products: [{ productId: "33f2ac2f-dfd5-4c64-8c7c-84ef1e9da902" }]
            };

            await expect(placeOrderUseCase["validateProducts"](input))
                .rejects.toThrowError("Product 33f2ac2f-dfd5-4c64-8c7c-84ef1e9da902 is out of stock");

            input = {
                clientId: "a18d6a80-1ff5-4bd2-b098-0cfbd94d7a92",
                products: [
                    { productId: "b2d5f1e1-5c3b-4f2e-9f4a-8c7c9e9a9e9a" },
                    { productId: "33f2ac2f-dfd5-4c64-8c7c-84ef1e9da902" }
                ]
            };

            await expect(placeOrderUseCase["validateProducts"](input))
                .rejects.toThrowError("Product 33f2ac2f-dfd5-4c64-8c7c-84ef1e9da902 is out of stock");

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: "a18d6a80-1ff5-4bd2-b098-0cfbd94d7a92",
                products: [
                    { productId: "b2d5f1e1-5c3b-4f2e-9f4a-8c7c9e9a9e9a" },
                    { productId: "33f2ac2f-dfd5-4c64-8c7c-84ef1e9da902" },
                    { productId: "c3e6f2e2-6d4c-5g3f-0g5b-9d8d0f0b0f0b" }
                ]
            };

            await expect(placeOrderUseCase["validateProducts"](input))
                .rejects.toThrowError("Product 33f2ac2f-dfd5-4c64-8c7c-84ef1e9da902 is out of stock");

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
        });
    });

    describe("getProducts method", () => {
        const mockDate = new Date(2000, 1, 1);

        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        const mockClientFacade = {
            add: jest.fn(),
            find: jest.fn().mockResolvedValue(true),
        };

        const mockProductFacade = {
            addProduct: jest.fn(),
            findProduct: jest.fn(),
            checkStock: jest.fn(({ productId }: { productId: string }) => Promise.resolve({
                productId,
                stock: 10
            }))
        };

        const mockCatalogFacade = {
            find: jest.fn().mockResolvedValue(null),
            findAll: jest.fn(),
        };

        const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade, mockCatalogFacade);

        it("should throw an error when product not found", async () => {
            const productId = "33f2ac2f-dfd5-4c64-8c7c-84ef1e9da902";

            await expect(placeOrderUseCase["getProduct"](productId))
                .rejects.toThrowError("Product 33f2ac2f-dfd5-4c64-8c7c-84ef1e9da902 not found");

            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });

        it("should return a product", async () => {
            // Arrange
            const product = {
                id: "c2f93865-21fb-4fdc-9db4-c9c63895f3aa",
                name: "Product 0",
                description: "Product 0 description",
                salesPrice: 0,
            }

            mockCatalogFacade.find.mockResolvedValue(product);

            // Act & Assert
            await expect(placeOrderUseCase["getProduct"](product.id))
                .resolves.toEqual(
                    new Product({
                        id: new Id(product.id),
                        name: product.name,
                        description: product.description,
                        salesPrice: product.salesPrice
                    })
                );
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });

    });

    describe("execute method", () => {
        it("should throw an error when client not found", async () => {
            // Arrange
            const mockClientFacade = {
                add: jest.fn(),
                find: jest.fn().mockResolvedValue(null),
            };
            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, undefined);
            const input: InputPlaceOrderDto = { clientId: "a18d6a80-1ff5-4bd2-b098-0cfbd94d7a92", products: [] };

            // Act & Assert
            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("Client not found");
        });

        it("should throw an error when products are not valid", async () => {
            // Arrange
            const mockClientFacade = {
                add: jest.fn(),
                find: jest.fn().mockResolvedValue(true),
            };
            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, undefined);
            const input: InputPlaceOrderDto = { clientId: "a18d6a80-1ff5-4bd2-b098-0cfbd94d7a92", products: [] };

            // Act & Assert
            await expect(placeOrderUseCase.execute(input)).rejects.toThrowError("No products selected");
        });

        describe("place an order", () => {
            const clientProps = {
                id: "d5e88e7b-b16a-4976-bd3a-8631add0015e",
                name: "Client 0",
                document: "0000",
                email: "client@user.com",
                street: "some address",
                number: "1",
                complement: "",
                city: "some city",
                state: "some state",
                zipCode: "000"
            }

            const mockClientFacade = {
                add: jest.fn(),
                find: jest.fn().mockResolvedValue(clientProps),
            };

            const mockPaymentFacade = {
                process: jest.fn()
            }

            const mockCheckoutRepository = {
                addOrder: jest.fn(),
                findOrder: jest.fn()
            }

            const mockInvoiceFacade = {
                generate: jest.fn().mockResolvedValue({ id: "cfda8164-20c1-4732-b1e6-53251979f130" }),
                find: jest.fn()
            }

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade,
                undefined,
                undefined,
                mockCheckoutRepository,
                mockInvoiceFacade,
                mockPaymentFacade
            );

            const products = {
                "e53c1460-ed9b-414d-a4f3-64304a21e06e": new Product({
                    id: new Id("e53c1460-ed9b-414d-a4f3-64304a21e06e"),
                    name: "Product 1",
                    description: "some description",
                    salesPrice: 40,
                }),
                "be37f425-7694-4440-a24e-4f2d26f4ba03": new Product({
                    id: new Id("be37f425-7694-4440-a24e-4f2d26f4ba03"),
                    name: "Product 2",
                    description: "some description",
                    salesPrice: 30,
                }),
            }

            const mockValidateProducts = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - return null errors
                .mockResolvedValue(null);

            const mockGetProduct = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "getProduct")
                //@ts-expect-error - not return never
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId]
                });

            it("should not be approved", async () => {
                // Arrange
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "56210f7e-33a2-4e35-94a4-8b8f79cfe152",
                    orderId: "b93e302e-302c-416c-b086-a4c28b1862a4",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: InputPlaceOrderDto = {
                    clientId: "d5e88e7b-b16a-4976-bd3a-8631add0015e",
                    products: [
                        { productId: "e53c1460-ed9b-414d-a4f3-64304a21e06e" },
                        { productId: "be37f425-7694-4440-a24e-4f2d26f4ba03" },
                    ]
                }

                // Act
                let output = await placeOrderUseCase.execute(input);
                
                // Assert
                expect(output).toBeDefined();
                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "e53c1460-ed9b-414d-a4f3-64304a21e06e" },
                    { productId: "be37f425-7694-4440-a24e-4f2d26f4ba03" },
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "d5e88e7b-b16a-4976-bd3a-8631add0015e" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
            });

            it("should be approved", async () => {
                // Arrange
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "56210f7e-33a2-4e35-94a4-8b8f79cfe152",
                    orderId: "b93e302e-302c-416c-b086-a4c28b1862a4",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                const input: InputPlaceOrderDto = {
                    clientId: "d5e88e7b-b16a-4976-bd3a-8631add0015e",
                    products: [
                        { productId: "e53c1460-ed9b-414d-a4f3-64304a21e06e" },
                        { productId: "be37f425-7694-4440-a24e-4f2d26f4ba03" },
                    ]
                }

                // Act
                let output = await placeOrderUseCase.execute(input);

                // Assert
                expect(output).toBeDefined();
                expect(output.invoiceId).toBe("cfda8164-20c1-4732-b1e6-53251979f130");
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    { productId: "e53c1460-ed9b-414d-a4f3-64304a21e06e" },
                    { productId: "be37f425-7694-4440-a24e-4f2d26f4ba03" },
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "d5e88e7b-b16a-4976-bd3a-8631add0015e" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.street,
                    number: clientProps.number,
                    complement: clientProps.complement,
                    city: clientProps.city,
                    state: clientProps.state,
                    zipCode: clientProps.zipCode,
                    items: [
                        {
                            id: products["e53c1460-ed9b-414d-a4f3-64304a21e06e"].id.id,
                            name: products["e53c1460-ed9b-414d-a4f3-64304a21e06e"].name,
                            price: products["e53c1460-ed9b-414d-a4f3-64304a21e06e"].salesPrice,
                        },
                        {
                            id: products["be37f425-7694-4440-a24e-4f2d26f4ba03"].id.id,
                            name: products["be37f425-7694-4440-a24e-4f2d26f4ba03"].name,
                            price: products["be37f425-7694-4440-a24e-4f2d26f4ba03"].salesPrice,
                        }
                    ]
                });
            });

        });

    });

});