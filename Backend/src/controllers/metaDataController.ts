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
      const urls: string[] = request.body.urls;
      if (!urls || !Array.isArray(urls)) {
        response
          .status(StatusCode.BadRequest)
          .json({error: 'Invalid input. Expected an array of URLs.'});
        return;
      }

      const metadata = await Promise.all(
        urls.map(async (url) => {
          try {
            const {data, headers} = await axios.get(url);

            if (!headers['content-type']?.includes('text/html')) {
              throw new Error(
                `The URL does not return HTML content. Content-Type: ${headers['content-type']}`
              );
            }

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
                $('meta[property="og:image"]').attr('content') ||
                'No image available',
            };
          } catch (err) {
            console.error(`Error fetching metadata for URL ${url}:`, err);
            return {
              url,
              title: 'Error',
              description: 'Error',
              ogImage: 'Error',
            };
          }
        })
      );

      const processedMetadata = metaDataService.processMetadata(metadata);
      response.status(StatusCode.OK).json(processedMetadata);
    } catch (err: any) {
      next(err);
    }
  }
}

const metaDataController = new MetaDataController();
export const dataRouter = metaDataController.router;
