import { ApiServiceParam, BaseApiService } from "./BaseApiService";

export class ReadOnlyApiService extends BaseApiService {
  async fetch<T>({ url, config = {} }: ApiServiceParam): Promise<T> {
    try {
      const response = await this.axios.get(url, config);
      return response.data;
    } catch (err: any) {
      return this.handleErrors(err);
    }
  }

  async get<T>({ url, config = {} }: ApiServiceParam): Promise<T> {
    try {
      const response = await this.axios.get(url, config);
      return response.data;
    } catch (err: any) {
      return this.handleErrors(err);
    }
  }
}
