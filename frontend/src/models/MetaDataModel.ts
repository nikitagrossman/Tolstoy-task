export class MetaDataModel {
  title: string;
  description: string;
  ogImage: string;
  constructor(title: string, description: string, ogImage: string) {
    this.title = title;
    this.description = description;
    this.ogImage = ogImage;
  }
}
