import { ApiServiceParam } from "./BaseApiService";
import { ReadOnlyApiService } from "./ReadOnlyApiService";

export class ModelApiService extends ReadOnlyApiService {
  async post<T>({ url, data = {}, config = {} }: ApiServiceParam): Promise<T> {
    try {
      const response = await this.axios.post(url, data, config);
      return response.data;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  async put<T>({ url, data = {}, config = {} }: ApiServiceParam): Promise<T> {
    try {
      const response = await this.axios.put(url, data, config);
      return response.data;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  async patch<T>({ url, data = {}, config = {} }: ApiServiceParam): Promise<T> {
    try {
      const response = await this.axios.patch(url, data, config);
      return response.data;
    } catch (err) {
      return this.handleErrors(err);
    }
  }

  async delete<T>({ url, config = {} }: ApiServiceParam): Promise<T> {
    try {
      const response = await this.axios.delete(url, config);
      return response.data;
    } catch (err) {
      return this.handleErrors(err);
    }
  }
}
