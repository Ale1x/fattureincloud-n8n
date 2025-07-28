import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { IssuedDocumentsApi, IssuedDocument, CreateIssuedDocumentRequest, ModifyIssuedDocumentRequest, Configuration } from '@fattureincloud/fattureincloud-ts-sdk';
import { IFattureInCloudModule } from '../interfaces';
import { IssuedDocumentsResource } from '../resources/IssuedDocumentsResource';

export class IssuedDocumentsModule implements IFattureInCloudModule {
	resource = IssuedDocumentsResource;

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
			throw new NodeOperationError(
				context.getNode(),
				'Access token not found in credentials. Please re-authenticate your Fatture in Cloud connection.',
				{ itemIndex }
			);
		}

		const config = new Configuration({
			accessToken,
		});

		const issuedDocumentsApi = new IssuedDocumentsApi(config);

		const companyId = context.getNodeParameter('companyId', itemIndex) as number;
		let responseData;

		switch (operation) {
			case 'create':
				const documentType = context.getNodeParameter('documentType', itemIndex) as string;
				const entity = context.getNodeParameter('entity', itemIndex) as any;
				const date = context.getNodeParameter('date', itemIndex) as string;
				const number = context.getNodeParameter('number', itemIndex) as number;
				const subject = context.getNodeParameter('subject', itemIndex, '') as string;
				const itemsList = context.getNodeParameter('itemsList', itemIndex, {}) as any;
				const paymentsList = context.getNodeParameter('paymentsList', itemIndex, {}) as any;
				const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

				// Validate entity is provided and has required name field
				if (!entity || !entity.entityDetails || !entity.entityDetails.name || entity.entityDetails.name.trim() === '') {
					throw new NodeOperationError(
						context.getNode(),
						'Entity (Client) name is required to create an issued document. Please fill in the client name in the Entity section.',
						{ itemIndex }
					);
				}

				// Process items list
				const processedItems = (itemsList.item || []).map((item: any) => ({
					...item,
					vat: item.vat?.vatDetails || { id: 0, value: 22, description: '' }
				}));

				// Process payments list
				const processedPayments = (paymentsList.payment || []).map((payment: any) => ({
					...payment,
					payment_terms: payment.payment_terms?.termsDetails || { days: 0, type: 'standard' }
				}));

				const issuedDocument: IssuedDocument = {
					type: documentType as any,
					entity: entity.entityDetails,
					date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
					number: number,
					subject: subject,
					items_list: processedItems,
					payments_list: processedPayments,
					...additionalFields,
				};

				const createRequest: CreateIssuedDocumentRequest = {
					data: issuedDocument
				};

				const createResponse = await issuedDocumentsApi.createIssuedDocument(companyId, createRequest);
				responseData = createResponse.data;
				break;

			case 'get':
				const documentId = context.getNodeParameter('documentId', itemIndex) as number;
				const getResponse = await issuedDocumentsApi.getIssuedDocument(companyId, documentId);
				responseData = getResponse.data;
				break;

			case 'getAll':
				const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
				const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

				// Default to 'invoice' type for listing, could be made configurable
				const listResponse = await issuedDocumentsApi.listIssuedDocuments(companyId, 'invoice');
				let documents = listResponse.data.data || [];
				
				if (!returnAll && documents.length > limit) {
					documents = documents.slice(0, limit);
				}
				responseData = documents;
				break;

			case 'update':
				const updateDocumentId = context.getNodeParameter('documentId', itemIndex) as number;
				const updateEntity = context.getNodeParameter('entity', itemIndex) as any;
				const updateDate = context.getNodeParameter('date', itemIndex) as string;
				const updateNumber = context.getNodeParameter('number', itemIndex) as number;
				const updateSubject = context.getNodeParameter('subject', itemIndex, '') as string;
				const updateItemsList = context.getNodeParameter('itemsList', itemIndex, {}) as any;
				const updatePaymentsList = context.getNodeParameter('paymentsList', itemIndex, {}) as any;
				const updateAdditionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

				// Validate entity is provided
				if (!updateEntity || !updateEntity.entityDetails || Object.keys(updateEntity.entityDetails).length === 0) {
					throw new NodeOperationError(
						context.getNode(),
						'Entity (Client) information is required to update an issued document. Please fill in at least the client name.',
						{ itemIndex }
					);
				}

				// Process items list
				const updateProcessedItems = (updateItemsList.item || []).map((item: any) => ({
					...item,
					vat: item.vat?.vatDetails || { id: 0, value: 22, description: '' }
				}));

				// Process payments list
				const updateProcessedPayments = (updatePaymentsList.payment || []).map((payment: any) => ({
					...payment,
					payment_terms: payment.payment_terms?.termsDetails || { days: 0, type: 'standard' }
				}));

				const updateIssuedDocument: IssuedDocument = {
					entity: updateEntity.entityDetails,
					date: updateDate ? new Date(updateDate).toISOString().split('T')[0] : undefined,
					number: updateNumber,
					subject: updateSubject,
					items_list: updateProcessedItems,
					payments_list: updateProcessedPayments,
					...updateAdditionalFields,
				};

				const updateRequest: ModifyIssuedDocumentRequest = {
					data: updateIssuedDocument
				};

				const updateResponse = await issuedDocumentsApi.modifyIssuedDocument(companyId, updateDocumentId, updateRequest);
				responseData = updateResponse.data;
				break;

			case 'delete':
				const deleteDocumentId = context.getNodeParameter('documentId', itemIndex) as number;
				await issuedDocumentsApi.deleteIssuedDocument(companyId, deleteDocumentId);
				responseData = { success: true, deleted: deleteDocumentId };
				break;

			default:
				throw new Error(`Unknown operation: ${operation}`);
		}

		return responseData;
	}
}