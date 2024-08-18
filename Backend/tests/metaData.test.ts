import {describe, it} from 'mocha';
import {expect} from 'chai';
import supertest from 'supertest';
import {app} from '../src/app';
import {metaDataService} from '../src/services/MetaDataService';

describe('Testing MetaDataController', () => {
  it('Should return metadata array', async () => {
    const response = await supertest(app.server)
      .post('/api/fetch-metadata')
      .send({
        urls: ['https://www.google.com', 'https://www.facebook.com'],
      });
    const metadata = response.body;
    expect(metadata.length).to.be.equal(2);
    expect(metadata[0]).to.contain.keys(
      'url',
      'title',
      'description',
      'ogImage'
    );
  });
  it('Should return error for invalid input', async () => {
    const response = await supertest(app.server)
      .post('/api/fetch-metadata')
      .send({
        urls: 'https://www.google.com',
      });
    expect(response.body).to.have.property('error');
  });
});
describe('Testing MetaDataService', () => {
  it('Should return metadata array', async () => {
    const metadata = metaDataService.processMetadata([
      {
        url: 'https://www.google.com',
        title: 'Google',
        description: 'Search engine',
        ogImage: 'google.png',
      },
    ]);
    expect(metadata.length).to.be.equal(1);
    expect(metadata[0]).to.contain.keys(
      'url',
      'title',
      'description',
      'ogImage'
    );
  });
  it('Should return default values for missing metadata', async () => {
    const metadata = metaDataService.processMetadata([
      {
        url: 'https://www.google.com',
      },
    ]);
    expect(metadata.length).to.be.equal(1);
    expect(metadata[0]).to.contain.keys(
      'url',
      'title',
      'description',
      'ogImage'
    );
    expect(metadata[0].title).to.be.equal('No title available');
    expect(metadata[0].description).to.be.equal('No description available');
    expect(metadata[0].ogImage).to.be.equal('No image available');
  });
});
