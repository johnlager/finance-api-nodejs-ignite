import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
describe("User Authentication", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should return user and token when valid user email and password are given", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "a@p.com",
      password: "123",
    };

    const response = await authenticateUserUseCase.execute({email: createUser.email, password: createUser.password});

    expect(response).toHaveProperty("user");
    expect(response).toHaveProperty("token");
  });

  it("Should throw and error when an invalid email is given", async () => {
    expect( async () => {
      const createUser: ICreateUserDTO = {
        name: "john",
        email: "email@email.com",
        password: "123",
      };
  
      const fakeEmail = "Fake@email.com";
      await authenticateUserUseCase.execute({email: fakeEmail, password: createUser.password});  
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should throw and error when an invalid password is given", async () => {
    expect( async () => {
      const createUser: ICreateUserDTO = {
        name: "john",
        email: "email@email.com",
        password: "123",
      };
  
      const fakePassword = "Fake@email.com";
      await authenticateUserUseCase.execute({ email: createUser.email, password: fakePassword });  
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});