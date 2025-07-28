import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FattureInCloudOAuth2Api implements ICredentialType {
	name = 'fattureInCloudOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Fatture in Cloud OAuth2 API';
	documentationUrl = 'https://developers.fattureincloud.it/docs/authentication/';
	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://api-v2.fattureincloud.it/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api-v2.fattureincloud.it/oauth/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'entity.clients:a entity.suppliers:a entity.products:a issued_documents.invoices:a issued_documents.credit_notes:a issued_documents.receipts:a issued_documents.orders:a issued_documents.quotes:a issued_documents.proformas:a issued_documents.delivery_notes:a issued_documents.work_reports:a issued_documents.supplier_orders:a issued_documents.self_invoices:a received_documents:a stock:a receipts:a taxes:a archive:a cashbook:a settings:a situation:a',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}