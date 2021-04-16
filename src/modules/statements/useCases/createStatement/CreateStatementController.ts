import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER_SENDER = "transfer_sender",
  TRANSFER_RECEIVER = "transfer_receiver",
}

export class CreateStatementController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;

    const type = request.params.type as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
    });

    return response.status(201).json(statement);
  }
}
