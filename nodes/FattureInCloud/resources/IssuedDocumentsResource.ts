import { INodeProperties } from 'n8n-workflow';
import { IFattureInCloudResource } from '../interfaces';

export const IssuedDocumentsResource: IFattureInCloudResource = {
	name: 'issuedDocument',
	displayName: 'Issued Document',
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
			displayName: 'Document ID',
			name: 'documentId',
			type: 'number',
			required: true,
			displayOptions: {
				show: {
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
					operation: ['create'],
				},
			},
			options: [
				{
					name: 'Credit Note',
					value: 'credit_note',
				},
				{
					name: 'Delivery Note',
					value: 'delivery_note',
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
				{
					name: 'Self Invoice',
					value: 'self_invoice',
				},
				{
					name: 'Supplier Order',
					value: 'supplier_order',
				},
				{
					name: 'Work Report',
					value: 'work_report',
				},
			],
			default: 'invoice',
			description: 'The type of document to create',
		},
		{
			displayName: 'Entity (Client)',
			name: 'entity',
			type: 'fixedCollection',
			required: true,
			typeOptions: {
				multipleValues: false,
			},
			displayOptions: {
				show: {
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
							displayName: 'Certified Email',
							name: 'certified_email',
							type: 'string',
							default: '',
							description: 'Entity certified email (PEC)',
						},
						{
							displayName: 'Country',
							name: 'country',
							type: 'string',
							default: 'Italia',
							description: 'Entity country',
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
							description: 'Entity email',
						},
						{
							displayName: 'ID',
							name: 'id',
							type: 'number',
							default: undefined,
							description: 'Entity ID (optional, for existing clients)',
						},
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
							required: true,
							description: 'Entity name (required)',
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
					operation: ['create', 'update'],
				},
			},
			default: 1,
		},
		{
			displayName: 'Subject',
			name: 'subject',
			type: 'string',
			displayOptions: {
				show: {
					operation: ['create', 'update'],
				},
			},
			default: '',
			description: 'Document subject',
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
							displayName: 'Category',
							name: 'category',
							type: 'string',
							default: '',
							description: 'Item category',
						},
						{
							displayName: 'Code',
							name: 'code',
							type: 'string',
							default: '',
							description: 'Item code',
						},
						{
							displayName: 'Description',
							name: 'description',
							type: 'string',
							default: '',
							description: 'Item description',
						},
						{
							displayName: 'Discount',
							name: 'discount',
							type: 'number',
							default: 0,
							description: 'Discount percentage',
						},
						{
							displayName: 'Gross Price',
							name: 'gross_price',
							type: 'number',
							default: undefined,
							description: 'Gross price per unit',
						},
						{
							displayName: 'Measure',
							name: 'measure',
							type: 'string',
							default: '',
							description: 'Unit of measure',
						},
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
							required: true,
							description: 'Product or service name',
						},
						{
							displayName: 'Net Price',
							name: 'net_price',
							type: 'number',
							default: 0,
							required: true,
							description: 'Net price per unit',
						},
						{
							displayName: 'Product ID',
							name: 'product_id',
							type: 'number',
							default: undefined,
							description: 'Product ID (optional)',
						},
						{
							displayName: 'Quantity',
							name: 'qty',
							type: 'number',
							default: 1,
							required: true,
						},
						{
							displayName: 'VAT',
							name: 'vat',
							type: 'fixedCollection',
							typeOptions: {
								multipleValues: false,
							},
							default: {},
							options: [
								{
									displayName: 'VAT Details',
									name: 'vatDetails',
									values: [
										{
											displayName: 'ID',
											name: 'id',
											type: 'number',
											default: 0,
											description: 'VAT type ID',
										},
										{
											displayName: 'Value',
											name: 'value',
											type: 'number',
											default: 22,
											description: 'VAT percentage',
										},
										{
											displayName: 'Description',
											name: 'description',
											type: 'string',
											default: '',
										},
									],
								},
							],
						},
					],
				},
			],
		},
		{
			displayName: 'Payments',
			name: 'paymentsList',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			displayOptions: {
				show: {
					operation: ['create', 'update'],
				},
			},
			default: {},
			options: [
				{
					displayName: 'Payment',
					name: 'payment',
					values: [
						{
							displayName: 'Amount',
							name: 'amount',
							type: 'number',
							default: 0,
							required: true,
							description: 'Payment amount',
						},
						{
							displayName: 'Due Date',
							name: 'due_date',
							type: 'dateTime',
							default: '',
							required: true,
							description: 'Payment due date',
						},
						{
							displayName: 'Status',
							name: 'status',
							type: 'options',
							options: [
								{
									name: 'Not Paid',
									value: 'not_paid',
								},
								{
									name: 'Paid',
									value: 'paid',
								},
								{
									name: 'Reversed',
									value: 'reversed',
								},
							],
							default: 'not_paid',
							description: 'Payment status',
						},
						{
							displayName: 'Payment Terms',
							name: 'payment_terms',
							type: 'fixedCollection',
							typeOptions: {
								multipleValues: false,
							},
							default: {},
							options: [
								{
									displayName: 'Terms Details',
									name: 'termsDetails',
									values: [
										{
											displayName: 'Days',
											name: 'days',
											type: 'number',
											default: 0,
											description: 'Payment terms in days',
										},
										{
											displayName: 'Type',
											name: 'type',
											type: 'options',
											options: [
												{
													name: 'Standard',
													value: 'standard',
												},
												{
													name: 'End of Month',
													value: 'end_of_month',
												},
											],
											default: 'standard',
											description: 'Payment terms type',
										},
									],
								},
							],
						},
					],
				},
			],
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
					displayName: 'E-Invoice',
					name: 'e_invoice',
					type: 'boolean',
					default: false,
					description: 'Whether this is an electronic invoice',
				},
				{
					displayName: 'Notes',
					name: 'notes',
					type: 'string',
					default: '',
					description: 'Document notes',
				},
				{
					displayName: 'Numeration',
					name: 'numeration',
					type: 'string',
					default: '',
					description: 'Document numeration',
				},
				{
					displayName: 'RC Center',
					name: 'rc_center',
					type: 'string',
					default: '',
					description: 'Revenue center',
				},
				{
					displayName: 'Use Gross Prices',
					name: 'use_gross_prices',
					type: 'boolean',
					default: false,
					description: 'Whether to use gross prices',
				},
				{
					displayName: 'Visible Subject',
					name: 'visible_subject',
					type: 'string',
					default: '',
					description: 'Visible subject on document',
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
			description: 'Create a new document',
			action: 'Create a document',
		},
		{
			name: 'Delete',
			value: 'delete',
			displayName: 'Delete',
			description: 'Delete a document',
			action: 'Delete a document',
		},
		{
			name: 'Get',
			value: 'get',
			displayName: 'Get',
			description: 'Get a document',
			action: 'Get a document',
		},
		{
			name: 'Get Many',
			value: 'getAll',
			displayName: 'Get Many',
			description: 'Get many documents',
			action: 'Get many documents',
		},
		{
			name: 'Update',
			value: 'update',
			displayName: 'Update',
			description: 'Update a document',
			action: 'Update a document',
		},
	],
};

export const IssuedDocumentsProperties: INodeProperties[] = [];