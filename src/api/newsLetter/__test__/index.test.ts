import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { login_with_admin_credentials } from '@/api/auth/__test__/payload';
import { app } from '@/server';

import {
  create_news_letter_payload,
  news_letter_with_invalid_subscriber_payload,
  update_news_letter_payload,
} from './payload';

describe('NewsLetter API', () => {
  let newsLetterId: string;
  let token: string;

  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send(login_with_admin_credentials);
    token = response.body.token;
  });

  // get all test
  describe('GET /newsLetter/all', () => {
    it('should get all newsLetters', async () => {
      const response = await request(app).get('/newsLetter/all').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(StatusCodes.OK);
    });
  });

  // create test
  describe('POST /newsLetter/create', () => {
    it('should create a new newsLetter', async () => {
      const response = await request(app)
        .post('/newsLetter/create')
        .set('Authorization', `Bearer ${token}`)
        .send(create_news_letter_payload);
      expect(response.status).toBe(StatusCodes.CREATED);
      newsLetterId = response.body.newsletter._id;
    });

    it('should not create newsLetter with invalid subscriber ID', async () => {
      const response = await request(app)
        .post('/newsLetter/create')
        .set('Authorization', `Bearer ${token}`)
        .send(news_letter_with_invalid_subscriber_payload);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  // get single test
  describe('GET /newsLetter/get-single', () => {
    it('should get a single newsLetter', async () => {
      const response = await request(app)
        .get('/newsLetter/get-single')
        .set('authorization', `Bearer ${token}`)
        .query({ id: newsLetterId });
      expect(response.status).toBe(StatusCodes.OK);
    });

    it('should not get a single newsLetter with invalid news Letter Id', async () => {
      const response = await request(app)
        .get('/newsLetter/get-single')
        .set('authorization', `Bearer ${token}`)
        .query({ id: '668fb93fc188ab6add675365' });
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  // update test
  describe('PUT /newsLetter/edit', () => {
    it('should update a newsLetter', async () => {
      const response = await request(app)
        .put('/newsLetter/edit')
        .set('Authorization', `Bearer ${token}`)
        .query({ id: newsLetterId })
        .send(update_news_letter_payload);
      expect(response.status).toBe(StatusCodes.OK);
    });

    it('should not update newsLetter with invalid subscriber ID', async () => {
      const response = await request(app)
        .put('/newsLetter/edit')
        .set('Authorization', `Bearer ${token}`)
        .query({ id: newsLetterId })
        .send(news_letter_with_invalid_subscriber_payload);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  //   subscribe
  describe('PATCH /newsLetter/subscribe', () => {
    it('should subscribe to a newsLetter', async () => {
      const response = await request(app)
        .patch('/newsLetter/subscribe')
        .set('authorization', `Bearer ${token}`)
        .query({ id: newsLetterId });
      expect(response.status).toBe(StatusCodes.OK);
    });
  });

  //   unsubscribe
  describe('PATCH /newsLetter/unSubscribe', () => {
    it('should unsubscribe to a newsLetter', async () => {
      const response = await request(app)
        .patch('/newsLetter/unSubscribe')
        .set('authorization', `Bearer ${token}`)
        .query({ id: newsLetterId });
      expect(response.status).toBe(StatusCodes.OK);
    });
  });

  // delete test
  describe('DELETE /newsLetter/delete', () => {
    it('should delete a newsLetter', async () => {
      const response = await request(app)
        .delete('/newsLetter/delete')
        .set('authorization', `Bearer ${token}`)
        .query({ id: newsLetterId });
      expect(response.status).toBe(StatusCodes.OK);
    });

    it('should not delete newsLetter with invalid News Letter Id', async () => {
      const response = await request(app)
        .delete('/newsLetter/delete')
        .set('authorization', `Bearer ${token}`)
        .query({ id: '668fb93fc188ab6add675365' });
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
