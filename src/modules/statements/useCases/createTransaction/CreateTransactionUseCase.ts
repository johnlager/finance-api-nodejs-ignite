import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";

@injectable()
class CreateTransactionUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    sender_id,
    receiver_id,
    amount,
    description,
  }): Promise<void> {
    const sender = await this.usersRepository.findById(sender_id);
    const receiver = await this.usersRepository.findById(receiver_id);

    if (!sender || !receiver) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    console.log(amount);

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    // const sender_withdraw = await this.statementsRepository.create({});

    const senderStatementOperation = await this.statementsRepository.create({
      user_id: sender.id as string,
      type: "transfer_sender",
      amount,
      description,
      receiver_id: receiver.id as string,
    });

    const receiverStatementOperation = await this.statementsRepository.create({
      user_id: receiver.id as string,
      type: "transfer_receiver",
      amount,
      description,
      sender_id: sender.id as string,
    });
  }
}

export { CreateTransactionUseCase };
