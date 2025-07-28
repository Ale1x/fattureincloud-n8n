import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import { 
	Configuration, 
	IssuedDocumentsApi, 
	ClientsApi, 
	UserApi,
	IssuedDocument,
	Client,
	CreateIssuedDocumentRequest,
	CreateClientRequest,
	ModifyIssuedDocumentRequest,
	ModifyClientRequest
} from '@fattureincloud/fattureincloud-ts-sdk';

export class FattureInCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fatture in Cloud',
		name: 'fattureInCloud',
		icon: { light: 'file:fic.png', dark: 'file:fic.png' },
		group: ['productivity'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Fatture in Cloud API using the official SDK',
		defaults: {
			name: 'Fatture in Cloud',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'fattureInCloudOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Client',
						value: 'client',
					},
					{
						name: 'Company',
						value: 'company',
					},
				],
				default: 'invoice',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new invoice',
						action: 'Create an invoice',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an invoice',
						action: 'Delete an invoice',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an invoice',
						action: 'Get an invoice',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many invoices',
						action: 'Get many invoices',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an invoice',
						action: 'Update an invoice',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['client'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new client',
						action: 'Create a client',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a client',
						action: 'Delete a client',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a client',
						action: 'Get a client',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many clients',
						action: 'Get many clients',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a client',
						action: 'Update a client',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['company'],
					},
				},
				options: [
					{
						name: 'Get Info',
						value: 'getInfo',
						description: 'Get user and company information',
						action: 'Get user and company information',
					},
				],
				default: 'getInfo',
			},
			// Company ID field (required for most operations)
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'number',
				required: true,
				displayOptions: {
					hide: {
						resource: ['company'],
					},
				},
				default: 0,
				description: 'The company ID for the operation',
			},
			// Invoice fields
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: 0,
				description: 'The ID of the issued document',
			},
			{
				displayName: 'Document Type',
				name: 'documentType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Credit Note',
						value: 'credit_note',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Proforma',
						value: 'proforma',
					},
					{
						name: 'Quote',
						value: 'quote',
					},
					{
						name: 'Receipt',
						value: 'receipt',
					},
				],
				default: 'invoice',
				description: 'The type of document to create',
			},
			{
				displayName: 'Entity (Client)',
				name: 'entity',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Entity Details',
						name: 'entityDetails',
						values: [
							{
						displayName: 'Address City',
						name: 'address_city',
						type: 'string',
						default: '',
						description: 'Entity city',
							},
							{
						displayName: 'Address Postal Code',
						name: 'address_postal_code',
						type: 'string',
						default: '',
						description: 'Entity postal code',
							},
							{
						displayName: 'Address Province',
						name: 'address_province',
						type: 'string',
						default: '',
						description: 'Entity province',
							},
							{
						displayName: 'Address Street',
						name: 'address_street',
						type: 'string',
						default: '',
						description: 'Entity street address',
							},
							{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: 'Italia',
						description: 'Entity country',
							},
							{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Entity name',
							},
							{
						displayName: 'Tax Code',
						name: 'tax_code',
						type: 'string',
						default: '',
						description: 'Entity tax code',
							},
							{
						displayName: 'VAT Number',
						name: 'vat_number',
						type: 'string',
						default: '',
						description: 'Entity VAT number',
							},
						],
					},
				],
			},
			{
				displayName: 'Document Date',
				name: 'date',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['create', 'update'],
					},
				},
				default: '',
			},
			{
				displayName: 'Document Number',
				name: 'number',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['create', 'update'],
					},
				},
				default: 1,
			},
			{
				displayName: 'Items',
				name: 'itemsList',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['invoice'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Item',
						name: 'item',
						values: [
							{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Item description',
							},
							{
						displayName: 'Net Price',
						name: 'net_price',
						type: 'number',
						default: 0,
						description: 'Net price per unit',
							},
							{
						displayName: 'Product Name',
						name: 'product_name',
						type: 'string',
						default: '',
						description: 'Product or service name',
							},
							{
						displayName: 'Quantity',
						name: 'qty',
						type: 'number',
						default: 1,
							},
							{
						displayName: 'VAT Percentage',
						name: 'vat_percentage',
						type: 'number',
						default: 22,
							},
						],
					},
				],
			},
			// Client fields
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['client'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: 0,
				description: 'The ID of the client',
			},
			{
				displayName: 'Client Name',
				name: 'clientName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['client'],
						operation: ['create', 'update'],
					},
				},
				default: '',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['client'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Address City',
						name: 'address_city',
						type: 'string',
						default: '',
						description: 'Client city',
					},
					{
						displayName: 'Address Postal Code',
						name: 'address_postal_code',
						type: 'string',
						default: '',
						description: 'Client postal code',
					},
					{
						displayName: 'Address Province',
						name: 'address_province',
						type: 'string',
						default: '',
						description: 'Client province',
					},
					{
						displayName: 'Address Street',
						name: 'address_street',
						type: 'string',
						default: '',
						description: 'Client street address',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: 'Italia',
						description: 'Client country',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'Client email',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Client phone number',
					},
					{
						displayName: 'Tax Code',
						name: 'tax_code',
						type: 'string',
						default: '',
						description: 'Client tax code',
					},
					{
						displayName: 'VAT Number',
						name: 'vat_number',
						type: 'string',
						default: '',
						description: 'Client VAT number',
					},
				],
			},
			// Return all results option
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		const credentials = await this.getCredentials('fattureInCloudOAuth2Api');
		const config = new Configuration({
			accessToken: credentials.accessToken as string,
		});

		for (let i = 0; i < length; i++) {
			try {
				let responseData;

				if (resource === 'invoice') {
					const companyId = this.getNodeParameter('companyId', i) as number;
					const issuedDocumentsApi = new IssuedDocumentsApi(config);

					if (operation === 'create') {
						const documentType = this.getNodeParameter('documentType', i) as string;
						const entity = this.getNodeParameter('entity', i) as any;
						const date = this.getNodeParameter('date', i) as string;
						const number = this.getNodeParameter('number', i) as number;
						const itemsList = this.getNodeParameter('itemsList', i) as any;

						const issuedDocument: IssuedDocument = {
							type: documentType as any,
							entity: entity.entityDetails || null,
							date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
							number: number,
							items_list: itemsList.item || [],
						};

						const request: CreateIssuedDocumentRequest = {
							data: issuedDocument
						};

						const response = await issuedDocumentsApi.createIssuedDocument(companyId, request);
						responseData = response.data;
					} else if (operation === 'get') {
						const documentId = this.getNodeParameter('documentId', i) as number;

						const response = await issuedDocumentsApi.getIssuedDocument(companyId, documentId);
						responseData = response.data;
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const response = await issuedDocumentsApi.listIssuedDocuments(companyId, 'invoice');
						let documents = response.data.data || [];
						if (!returnAll && documents.length > limit) {
							documents = documents.slice(0, limit);
						}
						responseData = documents;
					} else if (operation === 'update') {
						const documentId = this.getNodeParameter('documentId', i) as number;
						const entity = this.getNodeParameter('entity', i) as any;
						const date = this.getNodeParameter('date', i) as string;
						const number = this.getNodeParameter('number', i) as number;
						const itemsList = this.getNodeParameter('itemsList', i) as any;

						const issuedDocument: IssuedDocument = {
							entity: entity.entityDetails || null,
							date: date ? new Date(date).toISOString().split('T')[0] : undefined,
							number: number,
							items_list: itemsList.item || [],
						};

						const request: ModifyIssuedDocumentRequest = {
							data: issuedDocument
						};

						const response = await issuedDocumentsApi.modifyIssuedDocument(companyId, documentId, request);
						responseData = response.data;
					} else if (operation === 'delete') {
						const documentId = this.getNodeParameter('documentId', i) as number;

						await issuedDocumentsApi.deleteIssuedDocument(companyId, documentId);
						responseData = { success: true, deleted: documentId };
					}
				} else if (resource === 'client') {
					const companyId = this.getNodeParameter('companyId', i) as number;
					const clientsApi = new ClientsApi(config);

					if (operation === 'create') {
						const clientName = this.getNodeParameter('clientName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;

						const client: Client = {
							name: clientName,
							...additionalFields,
						};

						const request: CreateClientRequest = {
							data: client
						};

						const response = await clientsApi.createClient(companyId, request);
						responseData = response.data;
					} else if (operation === 'get') {
						const clientId = this.getNodeParameter('clientId', i) as number;

						const response = await clientsApi.getClient(companyId, clientId);
						responseData = response.data;
					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50) as number;

						const response = await clientsApi.listClients(companyId);
						let clients = response.data.data || [];
						if (!returnAll && clients.length > limit) {
							clients = clients.slice(0, limit);
						}
						responseData = clients;
					} else if (operation === 'update') {
						const clientId = this.getNodeParameter('clientId', i) as number;
						const clientName = this.getNodeParameter('clientName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;

						const client: Client = {
							name: clientName,
							...additionalFields,
						};

						const request: ModifyClientRequest = {
							data: client
						};

						const response = await clientsApi.modifyClient(companyId, clientId, request);
						responseData = response.data;
					} else if (operation === 'delete') {
						const clientId = this.getNodeParameter('clientId', i) as number;

						await clientsApi.deleteClient(companyId, clientId);
						responseData = { success: true, deleted: clientId };
					}
				} else if (resource === 'company') {
					const userApi = new UserApi(config);

					if (operation === 'getInfo') {
						const response = await userApi.getUserInfo();
						responseData = response.data;
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as any || {}),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}