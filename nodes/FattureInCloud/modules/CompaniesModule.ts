import { IExecuteFunctions } from 'n8n-workflow';
import { CompaniesApi, Configuration } from '@fattureincloud/fattureincloud-ts-sdk';
import { IFattureInCloudModule } from '../interfaces';
import { CompaniesResource } from '../resources/CompaniesResource';

export class CompaniesModule implements IFattureInCloudModule {
	resource = CompaniesResource;

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
			throw new Error('Access token not found in credentials. Please re-authenticate your Fatture in Cloud connection.');
		}

		const config = new Configuration({
			accessToken,
		});

		const companiesApi = new CompaniesApi(config);

		const companyId = context.getNodeParameter('companyId', itemIndex) as number;
		let responseData;

		switch (operation) {
			case 'getInfo':
				const infoResponse = await companiesApi.getCompanyInfo(companyId);
				responseData = infoResponse.data;
				break;

			case 'getPlanUsage':
				const category = context.getNodeParameter('category', itemIndex) as string;
				const usageResponse = await companiesApi.getCompanyPlanUsage(companyId, category as any);
				responseData = usageResponse.data;
				break;

			default:
				throw new Error(`Unknown operation: ${operation}`);
		}

		return responseData;
	}
}