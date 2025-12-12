import { ModelService } from "../../ask";

export default class FactsApiService extends ModelService {
  constructor() {
    super({ requiresAuth: false }); // will add the Bearer token
  }
  async listAll() {
    return this.get({ url: `/facts` });
  }
}
