import { ModelService } from "../../ask";

export type Breed = {
  id: string;
  type: "breed";
  attributes: any;
};

export class BreedsApiService extends ModelService {
  constructor() {
    super({ requiresAuth: false }); // will not add the Bearer token
  }
  async getAll() {
    return this.get<Breed[]>({ url: `/breeds` });
  }
  async getById(breedId: string) {
    return this.get<Breed>({ url: `/breeds/${breedId}` });
  }
}
