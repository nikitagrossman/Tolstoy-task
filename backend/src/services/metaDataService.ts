class MetaDataService {
  public processMetadata(data: any): any[] {
    return data.map((item: any) => ({
      url: item.url,
      title: item.title || 'No title available',
      description: item.description || 'No description available',
      ogImage: item.ogImage || 'No image available',
    }));
  }
}
export const metaDataService = new MetaDataService();
