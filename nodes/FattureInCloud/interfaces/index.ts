import { INodeProperties } from 'n8n-workflow';

export interface IFattureInCloudResource {
	name: string;
	displayName: string;
	properties: INodeProperties[];
	operations: IFattureInCloudOperation[];
}

export interface IFattureInCloudOperation {
	name: string;
	value: string;
	displayName: string;
	description: string;
	action: string;
	properties?: INodeProperties[];
}

export interface IFattureInCloudModuleExecute {
	(context: any, operation: string, itemIndex: number): Promise<any>;
}

export interface IFattureInCloudModule {
	resource: IFattureInCloudResource;
	execute: IFattureInCloudModuleExecute;
}

export interface IFattureInCloudCredentials {
	oauthTokenData?: {
		access_token: string;
	};
	access_token?: string;
	accessToken?: string;
}

export interface IListOptions {
	returnAll: boolean;
	limit?: number;
	fields?: string;
	fieldset?: string;
	sort?: string;
	page?: number;
	per_page?: number;
	q?: string;
}

export interface IApiRequest {
	data: any;
}

export interface IApiResponse<T> {
	data: T;
}

export interface IEntity {
	id?: number;
	name: string;
	vat_number?: string;
	tax_code?: string;
	address_street?: string;
	address_postal_code?: string;
	address_city?: string;
	address_province?: string;
	address_extra?: string;
	country?: string;
	email?: string;
	certified_email?: string;
	phone?: string;
	fax?: string;
}

export interface IIssuedDocumentItem {
	id?: number;
	product_id?: number;
	code?: string;
	name: string;
	description?: string;
	measure?: string;
	net_price: number;
	gross_price?: number;
	qty: number;
	category?: string;
	discount?: number;
	discount_highlight?: boolean;
	in_dn?: boolean;
	apply_withholding_taxes?: boolean;
	stock?: boolean;
	not_taxable?: boolean;
	vat?: {
		id: number;
		value: number;
		description?: string;
	};
}

export interface IPayment {
	id?: number;
	amount: number;
	due_date: string;
	paid_date?: string;
	status: 'not_paid' | 'paid' | 'reversed';
	payment_terms?: {
		days: number;
		type: 'standard' | 'end_of_month';
	};
	payment_account?: {
		id: number;
		name: string;
		virtual?: boolean;
	};
}

export interface ICompanyInfo {
	id: number;
	name: string;
	email?: string;
	type?: string;
	access_token?: string;
	controlled_companies?: any[];
}

export interface IUserInfo {
	id: number;
	name: string;
	first_name?: string;
	last_name?: string;
	email: string;
	hash?: string;
	picture?: string;
}