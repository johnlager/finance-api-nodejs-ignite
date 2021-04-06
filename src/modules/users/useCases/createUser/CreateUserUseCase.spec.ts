import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should create an user", async () => {
    const user: ICreateUserDTO = {
      name: "John",
      email: "a@b.com",
      password: "123",
    };

    const response = await createUserUseCase.execute(user);
    expect(response).toHaveProperty("name");
  });

  it("Should not create an user with an e-mail that is already in use", async () => {
    expect(async() => {
      const user: ICreateUserDTO = {
        name: "John",
        email: "a@b.com",
        password: "123",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);  
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});