import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { AppError } from "../../../../shared/errors/AppError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
};

describe("Get balance", () => {
  beforeEach(()=> {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });
  
  it("Get user balance", async () => {
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
    await createStatementUseCase.execute(createStatement);
    await createStatementUseCase.execute(createStatement);
    const balance = await getBalanceUseCase.execute({ user_id });
    expect(balance.balance).toEqual(4000);
  });

  it("Get user balance with invalid user", async () => {
    expect( async () => {
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
      await createStatementUseCase.execute(createStatement);
      await createStatementUseCase.execute(createStatement);
      await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(AppError);
  });
});