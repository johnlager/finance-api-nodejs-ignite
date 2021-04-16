import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateTransactionUseCase } from "./CreateTransactionUseCase";

class CreateTransactionController {
  async execute(request: Request, response: Response): Promise<Response> {
    // user id vem do request.user
    const { id } = request.user;
    const { receiver_id } = request.params;
    const { amount, description } = request.body;

    const createTransactionUseCase = container.resolve(
      CreateTransactionUseCase
    );

    await createTransactionUseCase.execute({
      sender_id: id,
      receiver_id,
      amount,
      description,
    });

    return response.json({ id, receiver_id, amount, description });
  }
}

export { CreateTransactionController };
