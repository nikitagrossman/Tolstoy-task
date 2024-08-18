export class MetaDataModel {
  public title: string;
  public description: string;
  public ogImage: string;
  public constructor(metaData: MetaDataModel) {
    this.title = metaData.title;
    this.description = metaData.description;
    this.ogImage = metaData.ogImage;
  }
}
