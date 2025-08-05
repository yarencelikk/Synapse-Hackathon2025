import apiClient from '../lib/axios';
import type { InteractionRequest, InteractionResponse } from '../types';

export const invokeAgent = async (request: InteractionRequest): Promise<InteractionResponse> => {
  const response = await apiClient.post('/interactions/invoke', request);
  return response.data;
};