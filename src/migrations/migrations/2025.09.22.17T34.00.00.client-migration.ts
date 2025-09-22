import { MigrationFn } from 'umzug';
import { DataTypes, Sequelize } from 'sequelize';

export const up: MigrationFn = async ({ context: sequelize }) => {
    await (sequelize as Sequelize).getQueryInterface().createTable('clients', {
        id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        document: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        street: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        number: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        complement: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        city: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        state: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        zipCode: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'zip_code'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'updated_at'
        }
    });
};

export const down: MigrationFn = async ({ context: sequelize }) => {
    await (sequelize as Sequelize).getQueryInterface().dropTable('clients');
};