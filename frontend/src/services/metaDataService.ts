import axios from 'axios';
import {MetaDataModel} from '../models/MetaDataModel';

class MetaDataService {
  async getMetaData(urls: string[]): Promise<MetaDataModel[]> {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/fetch-metadata',
        {urls}
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  }
}

export const metaDataService = new MetaDataService();
