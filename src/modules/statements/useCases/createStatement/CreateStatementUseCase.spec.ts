import "reflect-metadata";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { AppError } from "../../../../shared/errors/AppError";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
};

describe("Create an Statement", () => {
  beforeEach(()=> {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Create an statement of deposit type", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "a@p.com",
      password: "123"
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
  });

  it("Create an statement with invalid user", async () => {
    expect( async()=> {
      const createUser: ICreateUserDTO = {
        name: "john",
        email: "a@p.com",
        password: "123"
      };
      const user = await inMemoryUsersRepository.create(createUser);
      const user_id = user.id as string;
      const createStatement = {
        user_id,
        type: "deposit" as OperationType,
        amount: 2000,
        description: "teste",
      }
      const statement = await createStatementUseCase.execute(createStatement);  
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Create an withdraw", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "a@p.com",
      password: "123"
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
      amount: 2000,
      description: "teste",
    };
    const statement = await createStatementUseCase.execute(createWithdrawStatement);
    
    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("user_id");
    expect(statement).toHaveProperty("type");
    expect(statement).toHaveProperty("amount");
    expect(statement).toHaveProperty("description");
  });

  it("Create an withdraw with not enough balance", async () => {
    expect( async () => {
      const createUser: ICreateUserDTO = {
        name: "john",
        email: "a@p.com",
        password: "123"
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
      await createStatementUseCase.execute(createWithdrawStatement);  
    }).rejects.toBeInstanceOf(AppError);
  });
});