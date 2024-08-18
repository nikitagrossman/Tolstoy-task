import express, {NextFunction, Request, Response} from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import {metaDataService} from '../services/MetaDataService';
import {StatusCode} from '../models/enums';

class MetaDataController {
  public readonly router = express.Router();

  public constructor() {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.post('/fetch-metadata', this.getMetaData.bind(this));
  }

  private async getMetaData(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const urls = this.validateUrls(request.body.urls);
      const metadata = await this.fetchMetadata(urls);
      const processedMetadata = metaDataService.processMetadata(metadata);
      response.status(StatusCode.OK).json(processedMetadata);
    } catch (err: any) {
      next(err);
    }
  }

  private validateUrls(urls: any): string[] {
    if (!urls || !Array.isArray(urls)) {
      throw new Error('Invalid input. Expected an array of URLs.');
    }
    return urls;
  }

  private async fetchMetadata(urls: string[]): Promise<any[]> {
    //went here with simple solution could have used queue such as BullMQ or other async libraries for better performance and error handling
    return Promise.all(
      urls.map(async (url) => {
        try {
          const {data, headers} = await axios.get(url);
          this.validateContentType(headers['content-type']);
          const metadata = await this.extractMetadata(data, url);
          return metadata;
        } catch (err) {
          console.error(`Error fetching metadata for URL ${url}:`, err);
          return this.handleFetchError(url);
        }
      })
    );
  }

  private validateContentType(contentType: string | undefined): void {
    if (!contentType?.includes('text/html')) {
      throw new Error(
        `The URL does not return HTML content. Content-Type: ${contentType}`
      );
    }
  }

  private async extractMetadata(data: string, url: string): Promise<any> {
    const $ = cheerio.load(data);
    if (!$) {
      throw new Error('Failed to load HTML content');
    }

    return {
      url,
      title: $('head > title').text() || 'No title available',
      description:
        $('meta[name="description"]').attr('content') ||
        'No description available',
      ogImage:
        $('meta[property="og:image"]').attr('content') || 'No image available',
    };
  }

  private handleFetchError(url: string): any {
    return {
      url,
      title: 'Error',
      description: 'Error',
      ogImage: 'Error',
    };
  }
}

const metaDataController = new MetaDataController();
export const dataRouter = metaDataController.router;
