import { step1CreateRequisitionUseCase } from '../use-cases/create-account/step1CreateRequisitionUseCase';
import { step2FinalizeRequisitionUseCase } from '../use-cases/create-account/step2FinalizeRequisitionUseCase';
import { step3FetchAccountsUseCase } from '../use-cases/create-account/step3FetchAccountsUseCase';
import { step4SaveAccountUseCase } from '../use-cases/create-account/createAccountUseCase';

export const createAccountController = {
  initiate: async (userId, institutionId, redirectUrl) => {
    const requisition = await step1CreateRequisitionUseCase(institutionId, redirectUrl);
    return { requisitionId: requisition.id, link: requisition.link };
  },

  finalize: async (userId, institutionId, ref) => {
    const requisition = await step2FinalizeRequisitionUseCase(ref);
    const accounts = await step3FetchAccountsUseCase(requisition.id);
    return step4SaveAccountUseCase(userId, institutionId, accounts);
  }
}; 