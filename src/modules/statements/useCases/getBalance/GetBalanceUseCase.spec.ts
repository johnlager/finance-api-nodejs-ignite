import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Get user balance", async () => {
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

    await createStatementUseCase.execute(createStatement);
    await createStatementUseCase.execute(createStatement);

    const balance = await getBalanceUseCase.execute({ user_id });

    expect(balance.balance).toEqual(4000);
  });

  it("Should throw an error when get the balance of an invalid user", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "invalid_id" })
    ).rejects.toEqual(new GetBalanceError());
  });
});
