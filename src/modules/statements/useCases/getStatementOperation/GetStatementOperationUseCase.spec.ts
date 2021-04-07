import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
};

describe("Get statement operation", () => {
  beforeEach(()=> {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("Get user statement operation by id", async () => {
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
    const statement_id = statement.id as string;
    const response = await getStatementOperationUseCase.execute({user_id, statement_id});
    expect(response).toEqual(statement);
  });

  it("Should throw an error when a non-existing user_id is given", async () => {
    expect(async () => {
      const createUser: ICreateUserDTO = {
        name: "john",
        email: "a@p.com",
        password: "123"
      };
      await inMemoryUsersRepository.create(createUser);
      const user_id = "invalid id";
      const createStatement = {
        user_id,
        type: "deposit" as OperationType,
        amount: 2000,
        description: "teste",
      };
      const statement = await createStatementUseCase.execute(createStatement);
      const statement_id = statement.id as string;
      await getStatementOperationUseCase.execute({user_id, statement_id});
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should throw an error when a non-existing statement_id is given", async () => {
    expect(async () => {
      const createUser: ICreateUserDTO = {
        name: "john",
        email: "a@p.com",
        password: "123"
      };
      const user = await inMemoryUsersRepository.create(createUser);
      const user_id = user.id as string;
      const statement_id = "invalid id";
      await getStatementOperationUseCase.execute({user_id, statement_id});
    }).rejects.toBeInstanceOf(AppError);
  });
});