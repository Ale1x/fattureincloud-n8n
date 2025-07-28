import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	INodeProperties,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

// Import modules
import { UserModule } from './modules/UserModule';
import { CompaniesModule } from './modules/CompaniesModule';
import { ClientsModule } from './modules/ClientsModule';
import { IssuedDocumentsModule } from './modules/IssuedDocumentsModule';
import { SuppliersModule } from './modules/SuppliersModule';

// Import interfaces
import { IFattureInCloudModule } from './interfaces';

export class FattureInCloudModular implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fatture in Cloud (Modular)',
		name: 'fattureInCloudModular',
		icon: 'file:fic.svg',
		group: ['productivity'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Fatture in Cloud API using modular architecture',
		defaults: {
			name: 'Fatture in Cloud (Modular)',
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
						name: 'Client',
						value: 'client',
					},
					{
						name: 'Company',
						value: 'company',
					},
					{
						name: 'Issued Document',
						value: 'issuedDocument',
					},
					{
						name: 'Supplier',
						value: 'supplier',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'issuedDocument',
				// Description omitted as it's redundant with displayName
			},
		],
	};

	private modules: Map<string, IFattureInCloudModule> = new Map();

	constructor() {
		// Initialize modules
		const userModule = new UserModule();
		const companiesModule = new CompaniesModule();
		const clientsModule = new ClientsModule();
		const issuedDocumentsModule = new IssuedDocumentsModule();
		const suppliersModule = new SuppliersModule();

		this.modules.set(userModule.resource.name, userModule);
		this.modules.set(companiesModule.resource.name, companiesModule);
		this.modules.set(clientsModule.resource.name, clientsModule);
		this.modules.set(issuedDocumentsModule.resource.name, issuedDocumentsModule);
		this.modules.set(suppliersModule.resource.name, suppliersModule);

		// Build properties dynamically
		this.buildProperties();
	}

	private buildProperties() {
		const resourceOperations: { [key: string]: INodeProperties } = {};
		const allProperties: INodeProperties[] = [];

		// Build operation properties for each resource
		this.modules.forEach((module, resourceName) => {
			const resource = module.resource;
			
			// Create operation property for this resource
			resourceOperations[resourceName] = {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: '',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [resourceName],
					},
				},
				options: resource.operations.map(op => ({
					name: op.displayName,
					value: op.value,
					description: op.description,
					action: op.action,
				})),
				// Description omitted as it's redundant with displayName
			};

			// Add resource-specific properties
			resource.properties.forEach(prop => {
				// Add resource filter to display options
				if (!prop.displayOptions) {
					prop.displayOptions = {};
				}
				if (!prop.displayOptions.show) {
					prop.displayOptions.show = {};
				}
				prop.displayOptions.show.resource = [resourceName];
				
				allProperties.push(prop);
			});

			// Add operation-specific properties
			resource.operations.forEach(operation => {
				if (operation.properties) {
					operation.properties.forEach(prop => {
						// Add resource and operation filters to display options
						if (!prop.displayOptions) {
							prop.displayOptions = {};
						}
						if (!prop.displayOptions.show) {
							prop.displayOptions.show = {};
						}
						prop.displayOptions.show.resource = [resourceName];
						if (!prop.displayOptions.show.operation) {
							prop.displayOptions.show.operation = [];
						}
						if (Array.isArray(prop.displayOptions.show.operation)) {
							prop.displayOptions.show.operation.push(operation.value);
						}
						
						allProperties.push(prop);
					});
				}
			});
		});

		// Add operation properties
		Object.values(resourceOperations).forEach(prop => {
			this.description.properties!.push(prop);
		});

		// Add all other properties
		this.description.properties!.push(...allProperties);
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Create module factory
		const createModule = (resourceName: string): IFattureInCloudModule | null => {
			switch (resourceName) {
				case 'user':
					return new UserModule();
				case 'company':
					return new CompaniesModule();
				case 'client':
					return new ClientsModule();
				case 'issuedDocument':
					return new IssuedDocumentsModule();
				case 'supplier':
					return new SuppliersModule();
				default:
					return null;
			}
		};

		// Get the appropriate module
		const module = createModule(resource);
		if (!module) {
			throw new NodeOperationError(
				this.getNode(),
				`Unknown resource: ${resource}`,
				{ level: 'warning' }
			);
		}

		for (let i = 0; i < length; i++) {
			try {
				const responseData = await module.execute(this, operation, i);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData || {}),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error: any) {
				// Extract more detailed error information
				const errorMessage = error.response?.data?.error?.validation_result || 
								   error.response?.data?.error_description || 
								   error.response?.data?.message || 
								   error.message || 
								   'Unknown error';
				
				const errorDetails = {
					message: errorMessage,
					status: error.response?.status,
					statusText: error.response?.statusText,
					data: error.response?.data,
				};

				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: errorDetails }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				
				// Create a more informative error
				const nodeError = new NodeOperationError(this.getNode(), `Fatture in Cloud API Error: ${errorMessage}`, {
					itemIndex: i,
					description: `Status: ${error.response?.status || 'Unknown'}, Details: ${JSON.stringify(error.response?.data || {})}`,
				});
				throw nodeError;
			}
		}

		return [returnData];
	}
}