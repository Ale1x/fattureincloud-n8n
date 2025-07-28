import { INodeProperties } from 'n8n-workflow';
import { IFattureInCloudResource } from '../interfaces';

export const ClientsResource: IFattureInCloudResource = {
	name: 'client',
	displayName: 'Client',
	properties: [
		{
			displayName: 'Company ID',
			name: 'companyId',
			type: 'number',
			required: true,
			default: 0,
			description: 'The company ID for the operation',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'number',
			required: true,
			displayOptions: {
				show: {
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
					operation: ['create', 'update'],
				},
			},
			default: '',
			description: 'The name of the client',
		},
		{
			displayName: 'Additional Fields',
			name: 'additionalFields',
			type: 'collection',
			placeholder: 'Add Field',
			displayOptions: {
				show: {
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
					displayName: 'Address Extra',
					name: 'address_extra',
					type: 'string',
					default: '',
					description: 'Additional address information',
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
					displayName: 'Certified Email',
					name: 'certified_email',
					type: 'string',
					placeholder: 'name@pec.email.com',
					default: '',
					description: 'Client certified email (PEC)',
				},
				{
					displayName: 'Code',
					name: 'code',
					type: 'string',
					default: '',
					description: 'Client code',
				},
				{
					displayName: 'Contact Person',
					name: 'contact_person',
					type: 'string',
					default: '',
					description: 'Contact person name',
				},
				{
					displayName: 'Country',
					name: 'country',
					type: 'string',
					default: 'Italia',
					description: 'Client country',
				},
				{
					displayName: 'E-Invoice',
					name: 'e_invoice',
					type: 'boolean',
					default: false,
					description: 'Whether the client uses e-invoice',
				},
				{
					displayName: 'EI Code',
					name: 'ei_code',
					type: 'string',
					default: '',
					description: 'Electronic invoice code',
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
					displayName: 'Fax',
					name: 'fax',
					type: 'string',
					default: '',
					description: 'Client fax number',
				},
				{
					displayName: 'First Name',
					name: 'first_name',
					type: 'string',
					default: '',
					description: 'Client first name (for person type)',
				},
				{
					displayName: 'Last Name',
					name: 'last_name',
					type: 'string',
					default: '',
					description: 'Client last name (for person type)',
				},
				{
					displayName: 'Notes',
					name: 'notes',
					type: 'string',
					default: '',
					description: 'Client notes',
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
					displayName: 'Type',
					name: 'type',
					type: 'options',
					options: [
						{
							name: 'Company',
							value: 'company',
						},
						{
							name: 'Person',
							value: 'person',
						},
					],
					default: 'company',
					description: 'Client type',
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
	operations: [
		{
			name: 'Create',
			value: 'create',
			displayName: 'Create',
			description: 'Create a new client',
			action: 'Create a client',
		},
		{
			name: 'Delete',
			value: 'delete',
			displayName: 'Delete',
			description: 'Delete a client',
			action: 'Delete a client',
		},
		{
			name: 'Get',
			value: 'get',
			displayName: 'Get',
			description: 'Get a client',
			action: 'Get a client',
		},
		{
			name: 'Get Info',
			value: 'getInfo',
			displayName: 'Get Info',
			description: 'Get client info for creating new clients',
			action: 'Get client info',
		},
		{
			name: 'Get Many',
			value: 'getAll',
			displayName: 'Get Many',
			description: 'Get many clients',
			action: 'Get many clients',
		},
		{
			name: 'Update',
			value: 'update',
			displayName: 'Update',
			description: 'Update a client',
			action: 'Update a client',
		},
	],
};

export const ClientsProperties: INodeProperties[] = [];