import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should show an existing user profile by id", async () => {
    const createUser: ICreateUserDTO = {
      name: "john",
      email: "a@p.com",
      password: "123",
    };
    const user = await inMemoryUsersRepository.create(createUser);
    const user_id = user.id as string;
    const response = await showUserProfileUseCase.execute(user_id);

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("email");
    expect(response).toHaveProperty("password");
    expect(response.name).toEqual(createUser.name);
    expect(response.email).toEqual(createUser.email);
  });

  it("Should throw an error when a non-existing profile id is given", async () => {
    expect(showUserProfileUseCase.execute("123")).rejects.toEqual(
      new ShowUserProfileError()
    );
  });
});
