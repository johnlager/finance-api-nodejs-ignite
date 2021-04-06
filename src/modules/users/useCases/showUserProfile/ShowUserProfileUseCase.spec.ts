import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

import { ShowUserProfileError } from "./ShowUserProfileError";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"; 

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should show an existing user profile by id", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "a@p.com",
      password: "123"
    };

    const user = await inMemoryUsersRepository.create(createUser);
    const user_id = user.id as string;
    const response = await showUserProfileUseCase.execute(user_id);

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("email");
    expect(response).toHaveProperty("password");
  });

  it("Should throw an error when a non-existing profile id is given", async () => {
    expect(async() => {
      await showUserProfileUseCase.execute("123");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});