import { MigrationFn } from 'umzug';
import { Sequelize, DataTypes } from 'sequelize';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    // Primeiro cria a tabela orders
    await sequelize.getQueryInterface().createTable('orders', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        clientId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "client_id",
            references: {
                model: 'clients',
                key: 'id'
            }
        }
    });

    // Depois cria a tabela order_items que depende de orders
    await sequelize.getQueryInterface().createTable('order_items', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "order_id",
            references: {
                model: 'orders',
                key: 'id'
            }
        },
        productId: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "product_id",
            references: {
                model: 'products',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    // Remove as tabelas na ordem inversa
    await sequelize.getQueryInterface().dropTable('order_items');
    await sequelize.getQueryInterface().dropTable('orders');
};