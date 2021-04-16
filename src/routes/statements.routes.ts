import { Router } from "express";

import { CreateStatementController } from "../modules/statements/useCases/createStatement/CreateStatementController";
import { CreateTransactionController } from "../modules/statements/useCases/createTransaction/CreateTransactionController";
import { GetBalanceController } from "../modules/statements/useCases/getBalance/GetBalanceController";
import { GetStatementOperationController } from "../modules/statements/useCases/getStatementOperation/GetStatementOperationController";
import { ensureAuthenticated } from "../shared/infra/http/middlwares/ensureAuthenticated";

const statementRouter = Router();
const getBalanceController = new GetBalanceController();
const createStatementController = new CreateStatementController();
const getStatementOperationController = new GetStatementOperationController();
const createTransactionController = new CreateTransactionController();

statementRouter.use(ensureAuthenticated);

statementRouter.get("/balance", getBalanceController.execute);
statementRouter.post("/:type", createStatementController.execute);
statementRouter.post(
  "/transfer/:receiver_id",
  createTransactionController.execute
);
statementRouter.get("/:statement_id", getStatementOperationController.execute);

export { statementRouter };
