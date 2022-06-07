import { Response as NodeFetchResponse } from 'node-fetch';

export const handleHttpError = async (
  response: Response | NodeFetchResponse,
): Promise<Response | NodeFetchResponse> => {
  if (!response.ok) {
    const body = await response.json();
    if (body['message']) {
      throw new Error(body.message);
    }

    throw new Error(JSON.stringify(body));
  }

  return response;
};
