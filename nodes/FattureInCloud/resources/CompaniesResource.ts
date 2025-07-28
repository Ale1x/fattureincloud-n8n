import { INodeProperties } from 'n8n-workflow';
import { IFattureInCloudResource } from '../interfaces';

export const CompaniesResource: IFattureInCloudResource = {
	name: 'company',
	displayName: 'Company',
	properties: [
		{
			displayName: 'Company ID',
			name: 'companyId',
			type: 'number',
			required: true,
			default: 0,
			description: 'The company ID for the operation',
		},
	],
	operations: [
		{
			name: 'Get Info',
			value: 'getInfo',
			displayName: 'Get Info',
			description: 'Get company information',
			action: 'Get company information',
		},
		{
			name: 'Get Plan Usage',
			value: 'getPlanUsage',
			displayName: 'Get Plan Usage',
			description: 'Get company plan usage',
			action: 'Get company plan usage',
			properties: [
				{
					displayName: 'Category',
					name: 'category',
					type: 'options',
					required: true,
					options: [
						{
							name: 'Clients',
							value: 'clients',
						},
						{
							name: 'Documents',
							value: 'documents',
						},
						{
							name: 'Products',
							value: 'products',
						},
						{
							name: 'Suppliers',
							value: 'suppliers',
						},
					],
					default: 'clients',
					description: 'The category to get usage information for',
				},
			],
		},
	],
};

export const CompaniesProperties: INodeProperties[] = [];