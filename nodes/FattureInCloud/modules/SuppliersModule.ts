import { IExecuteFunctions } from 'n8n-workflow';
import { SuppliersApi, Supplier, CreateSupplierRequest, ModifySupplierRequest, Configuration } from '@fattureincloud/fattureincloud-ts-sdk';
import { IFattureInCloudModule } from '../interfaces';
import { SuppliersResource } from '../resources/SuppliersResource';

export class SuppliersModule implements IFattureInCloudModule {
	resource = SuppliersResource;

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

		const suppliersApi = new SuppliersApi(config);

		const companyId = context.getNodeParameter('companyId', itemIndex) as number;
		let responseData;

		switch (operation) {
			case 'create':
				const supplierName = context.getNodeParameter('supplierName', itemIndex) as string;
				const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

				const supplier: Supplier = {
					name: supplierName,
					...additionalFields,
				};

				const createRequest: CreateSupplierRequest = {
					data: supplier
				};

				const createResponse = await suppliersApi.createSupplier(companyId, createRequest);
				responseData = createResponse.data;
				break;

			case 'get':
				const supplierId = context.getNodeParameter('supplierId', itemIndex) as number;
				const getResponse = await suppliersApi.getSupplier(companyId, supplierId);
				responseData = getResponse.data;
				break;

			case 'getAll':
				const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
				const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

				const listResponse = await suppliersApi.listSuppliers(companyId);
				let suppliers = listResponse.data.data || [];
				
				if (!returnAll && suppliers.length > limit) {
					suppliers = suppliers.slice(0, limit);
				}
				responseData = suppliers;
				break;

			case 'update':
				const updateSupplierId = context.getNodeParameter('supplierId', itemIndex) as number;
				const updateSupplierName = context.getNodeParameter('supplierName', itemIndex) as string;
				const updateAdditionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

				const updateSupplier: Supplier = {
					name: updateSupplierName,
					...updateAdditionalFields,
				};

				const updateRequest: ModifySupplierRequest = {
					data: updateSupplier
				};

				const updateResponse = await suppliersApi.modifySupplier(companyId, updateSupplierId, updateRequest);
				responseData = updateResponse.data;
				break;

			case 'delete':
				const deleteSupplierId = context.getNodeParameter('supplierId', itemIndex) as number;
				await suppliersApi.deleteSupplier(companyId, deleteSupplierId);
				responseData = { success: true, deleted: deleteSupplierId };
				break;

			default:
				throw new Error(`Unknown operation: ${operation}`);
		}

		return responseData;
	}
}