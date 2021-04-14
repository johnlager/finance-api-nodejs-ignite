import "reflect-metadata";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create an Statement", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Create an statement of deposit type", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "a@p.com",
      password: "123",
    };
    const user = await inMemoryUsersRepository.create(createUser);
    const user_id = user.id as string;
    const createStatement = {
      user_id,
      type: "deposit" as OperationType,
      amount: 2000,
      description: "teste",
    };
    const statement = await createStatementUseCase.execute(createStatement);

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
    expect(statement).toHaveProperty("type");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");

    expect(statement.user_id).toEqual(createStatement.user_id);
    expect(statement.amount).toEqual(createStatement.amount);
    expect(statement.type).toEqual(createStatement.type);
  });

  it("Should throw an error when create a statement with invalid user", async () => {
    // const createUser: ICreateUserDTO = {
    //   name: "john",
    //   email: "a@p.com",
    //   password: "123",
    // };
    // const user = await inMemoryUsersRepository.create(createUser);
    const user_id = "invalid_statement_id";
    const createStatement = {
      user_id,
      type: "deposit" as OperationType,
      amount: 2000,
      description: "teste",
    };

    await expect(
      createStatementUseCase.execute(createStatement)
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("Should throw an error when create a withdraw with not enough balance", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "a@p.com",
      password: "123",
    };
    const user = await inMemoryUsersRepository.create(createUser);
    const user_id = user.id as string;
    const createDepositStatement = {
      user_id,
      type: "deposit" as OperationType,
      amount: 2000,
      description: "teste",
    };
    await createStatementUseCase.execute(createDepositStatement);
    const createWithdrawStatement = {
      user_id,
      type: "withdraw" as OperationType,
      amount: 5000,
      description: "teste",
    };
    await expect(
      createStatementUseCase.execute(createWithdrawStatement)
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
