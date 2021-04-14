import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("User Authentication", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should return user and token when valid user email and password are given", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "a@p.com",
      password: "123",
    };
    await createUserUseCase.execute(createUser);
    const response = await authenticateUserUseCase.execute({
      email: createUser.email,
      password: createUser.password,
    });
    expect(response).toHaveProperty("user");
    expect(response).toHaveProperty("token");
    expect(response.user.name).toEqual(createUser.name);
    expect(response.user.email).toEqual(createUser.email);
  });

  it("Should throw and error when an invalid email is given", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "email@email.com",
      password: "123",
    };
    await createUserUseCase.execute(createUser);
    const fakeEmail = "Fake@email.com";

    expect(
      authenticateUserUseCase.execute({
        email: fakeEmail,
        password: createUser.password,
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("Should throw and error when an invalid password is given", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "email@email.com",
      password: "123",
    };
    await createUserUseCase.execute(createUser);
    const fakePassword = "Fake@email.com";

    expect(
      authenticateUserUseCase.execute({
        email: createUser.email,
        password: fakePassword,
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});
