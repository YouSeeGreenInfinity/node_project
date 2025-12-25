import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database";

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  birthDate: Date;
  email: string;
  password: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type UserCreationAttributes = Omit<
  UserAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;

  public firstName!: string;

  public lastName!: string;

  public middleName!: string | null;

  public birthDate!: Date;

  public email!: string;

  public password!: string;

  public role!: "admin" | "user";

  public isActive!: boolean;

  public createdAt!: Date;

  public updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Имя обязательно для заполнения",
        },
        len: {
          args: [2, 50],
          msg: "Имя должно содержать от 2 до 50 символов",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Фамилия обязательна для заполнения",
        },
        len: {
          args: [2, 50],
          msg: "Фамилия должна содержать от 2 до 50 символов",
        },
      },
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: "Отчество не должно превышать 50 символов",
        },
      },
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Некорректная дата рождения",
          args: true,
        },
        isNotFuture(value: string) {
          const date = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (date > today) {
            throw new Error("Дата рождения не может быть в будущем");
          }
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Некорректный формат email",
        },
        notEmpty: {
          msg: "Email обязателен для заполнения",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Пароль обязателен для заполнения",
        },
        len: {
          args: [6, 100],
          msg: "Пароль должен содержать от 6 до 100 символов",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
      validate: {
        isIn: {
          args: [["admin", "user"]],
          msg: "Роль может быть только 'admin' или 'user'",
        },
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Users",
    modelName: "User",
    timestamps: true,
    paranoid: false,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        fields: ["role"],
      },
      {
        fields: ["isActive"],
      },
    ],
  }
);

export default User;
