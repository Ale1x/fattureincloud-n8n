import { INodeProperties } from 'n8n-workflow';
import { IFattureInCloudResource } from '../interfaces';

export const SuppliersResource: IFattureInCloudResource = {
	name: 'supplier',
	displayName: 'Supplier',
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
			displayName: 'Supplier ID',
			name: 'supplierId',
			type: 'number',
			required: true,
			displayOptions: {
				show: {
					operation: ['get', 'update', 'delete'],
				},
			},
			default: 0,
			description: 'The ID of the supplier',
		},
		{
			displayName: 'Supplier Name',
			name: 'supplierName',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					operation: ['create', 'update'],
				},
			},
			default: '',
			description: 'The name of the supplier',
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
					description: 'Supplier city',
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
					description: 'Supplier postal code',
				},
				{
					displayName: 'Address Province',
					name: 'address_province',
					type: 'string',
					default: '',
					description: 'Supplier province',
				},
				{
					displayName: 'Address Street',
					name: 'address_street',
					type: 'string',
					default: '',
					description: 'Supplier street address',
				},
				{
					displayName: 'Certified Email',
					name: 'certified_email',
					type: 'string',
					placeholder: 'name@pec.email.com',
					default: '',
					description: 'Supplier certified email (PEC)',
				},
				{
					displayName: 'Code',
					name: 'code',
					type: 'string',
					default: '',
					description: 'Supplier code',
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
					description: 'Supplier country',
				},
				{
					displayName: 'Email',
					name: 'email',
					type: 'string',
					placeholder: 'name@email.com',
					default: '',
					description: 'Supplier email',
				},
				{
					displayName: 'Fax',
					name: 'fax',
					type: 'string',
					default: '',
					description: 'Supplier fax number',
				},
				{
					displayName: 'First Name',
					name: 'first_name',
					type: 'string',
					default: '',
					description: 'Supplier first name (for person type)',
				},
				{
					displayName: 'Last Name',
					name: 'last_name',
					type: 'string',
					default: '',
					description: 'Supplier last name (for person type)',
				},
				{
					displayName: 'Notes',
					name: 'notes',
					type: 'string',
					default: '',
					description: 'Supplier notes',
				},
				{
					displayName: 'Phone',
					name: 'phone',
					type: 'string',
					default: '',
					description: 'Supplier phone number',
				},
				{
					displayName: 'Tax Code',
					name: 'tax_code',
					type: 'string',
					default: '',
					description: 'Supplier tax code',
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
					description: 'Supplier type',
				},
				{
					displayName: 'VAT Number',
					name: 'vat_number',
					type: 'string',
					default: '',
					description: 'Supplier VAT number',
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
			description: 'Create a new supplier',
			action: 'Create a supplier',
		},
		{
			name: 'Delete',
			value: 'delete',
			displayName: 'Delete',
			description: 'Delete a supplier',
			action: 'Delete a supplier',
		},
		{
			name: 'Get',
			value: 'get',
			displayName: 'Get',
			description: 'Get a supplier',
			action: 'Get a supplier',
		},
		{
			name: 'Get Many',
			value: 'getAll',
			displayName: 'Get Many',
			description: 'Get many suppliers',
			action: 'Get many suppliers',
		},
		{
			name: 'Update',
			value: 'update',
			displayName: 'Update',
			description: 'Update a supplier',
			action: 'Update a supplier',
		},
	],
};

export const SuppliersProperties: INodeProperties[] = [];