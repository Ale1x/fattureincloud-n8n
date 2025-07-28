import { IExecuteFunctions } from 'n8n-workflow';
import { ClientsApi, Client, CreateClientRequest, ModifyClientRequest, Configuration } from '@fattureincloud/fattureincloud-ts-sdk';
import { IFattureInCloudModule } from '../interfaces';
import { ClientsResource } from '../resources/ClientsResource';

export class ClientsModule implements IFattureInCloudModule {
	resource = ClientsResource;

	async execute(context: IExecuteFunctions, operation: string, itemIndex: number): Promise<any> {
		const credentials = await context.getCredentials('fattureInCloudOAuth2Api') as any;
		
		// Handle different OAuth2 token storage formats in n8n
		let accessToken: string;
		if (credentials.oauthTokenData?.access_token) {
			accessToken = credentials.oauthTokenData.access_token;
		} else if (credentials.access_token) {
			accessToken = credentials.access_token;
		} else if (credentials.accessToken) {
			accessToken = credentials.accessToken;
		} else {
			throw new Error('Access token not found in credentials. Please re-authenticate your Fatture in Cloud connection.');
		}

		const config = new Configuration({
			accessToken,
		});

		const clientsApi = new ClientsApi(config);

		const companyId = context.getNodeParameter('companyId', itemIndex) as number;
		let responseData;

		switch (operation) {
			case 'create':
				const clientName = context.getNodeParameter('clientName', itemIndex) as string;
				const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

				const client: Client = {
					name: clientName,
					...additionalFields,
				};

				const createRequest: CreateClientRequest = {
					data: client
				};

				const createResponse = await clientsApi.createClient(companyId, createRequest);
				responseData = createResponse.data;
				break;

			case 'get':
				const clientId = context.getNodeParameter('clientId', itemIndex) as number;
				const getResponse = await clientsApi.getClient(companyId, clientId);
				responseData = getResponse.data;
				break;

			case 'getAll':
				const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
				const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

				const listResponse = await clientsApi.listClients(companyId);
				let clients = listResponse.data.data || [];
				
				if (!returnAll && clients.length > limit) {
					clients = clients.slice(0, limit);
				}
				responseData = clients;
				break;

			case 'update':
				const updateClientId = context.getNodeParameter('clientId', itemIndex) as number;
				const updateClientName = context.getNodeParameter('clientName', itemIndex) as string;
				const updateAdditionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

				const updateClient: Client = {
					name: updateClientName,
					...updateAdditionalFields,
				};

				const updateRequest: ModifyClientRequest = {
					data: updateClient
				};

				const updateResponse = await clientsApi.modifyClient(companyId, updateClientId, updateRequest);
				responseData = updateResponse.data;
				break;

			case 'delete':
				const deleteClientId = context.getNodeParameter('clientId', itemIndex) as number;
				await clientsApi.deleteClient(companyId, deleteClientId);
				responseData = { success: true, deleted: deleteClientId };
				break;

			case 'getInfo':
				// Note: This endpoint might not be available in the current SDK
				// Placeholder implementation
				responseData = { message: 'Client info endpoint not yet implemented in SDK' };
				break;

			default:
				throw new Error(`Unknown operation: ${operation}`);
		}

		return responseData;
	}
}