import { IExecuteFunctions } from 'n8n-workflow';
import { UserApi, Configuration } from '@fattureincloud/fattureincloud-ts-sdk';
import { IFattureInCloudModule } from '../interfaces';
import { UserResource } from '../resources/UserResource';

export class UserModule implements IFattureInCloudModule {
	resource = UserResource;

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

		const userApi = new UserApi(config);

		let responseData;

		switch (operation) {
			case 'getInfo':
				const userInfoResponse = await userApi.getUserInfo();
				responseData = userInfoResponse.data;
				break;

			case 'listCompanies':
				const companiesResponse = await userApi.listUserCompanies();
				responseData = companiesResponse.data;
				break;

			default:
				throw new Error(`Unknown operation: ${operation}`);
		}

		return responseData;
	}
}