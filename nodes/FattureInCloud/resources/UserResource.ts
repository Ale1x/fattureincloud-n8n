import { INodeProperties } from 'n8n-workflow';
import { IFattureInCloudResource } from '../interfaces';

export const UserResource: IFattureInCloudResource = {
	name: 'user',
	displayName: 'User',
	properties: [],
	operations: [
		{
			name: 'Get Info',
			value: 'getInfo',
			displayName: 'Get Info',
			description: 'Get user information',
			action: 'Get user information',
		},
		{
			name: 'List Companies',
			value: 'listCompanies',
			displayName: 'List Companies',
			description: 'List user companies',
			action: 'List user companies',
		},
	],
};

export const UserProperties: INodeProperties[] = [];