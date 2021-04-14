import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should create an user", async () => {
    const createUser: ICreateUserDTO = {
      name: "John",
      email: "a@b.com",
      password: "123",
    };
    const response = await createUserUseCase.execute(createUser);

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("email");
    expect(response).toHaveProperty("password");

    expect(response.name).toEqual(createUser.name);
    expect(response.email).toEqual(createUser.email);
  });

  it("Should not create an user with an e-mail that is already in use", async () => {
    const createUser: ICreateUserDTO = {
      name: "John",
      email: "a@b.com",
      password: "123",
    };
    await createUserUseCase.execute(createUser);

    expect(createUserUseCase.execute(createUser)).rejects.toEqual(
      new CreateUserError()
    );
  });
});
