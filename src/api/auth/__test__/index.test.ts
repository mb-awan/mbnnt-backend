import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { app } from '@/server';

import {
  login_with_correct_credentials,
  login_with_correct_credentials_but_different_email,
  login_with_wrong_credentials,
  register_with_admin_role,
  register_with_correct_credentials,
  register_with_different_passwords,
  register_with_invalid_username,
  register_with_non_existing_role,
} from './payload';

describe('Auth API', () => {
  // register test
  describe('POST /auth/register', () => {
    it('should not register with invalid user name', async () => {
      const response = await request(app).post('/auth/register').send(register_with_invalid_username);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should not register with different password and confirm password', async () => {
      const response = await request(app).post('/auth/register').send(register_with_different_passwords);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should not register with admin role', async () => {
      const response = await request(app).post('/auth/register').send(register_with_admin_role);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should not register with non existing role role', async () => {
      const response = await request(app).post('/auth/register').send(register_with_non_existing_role);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should register with correct credentials', async () => {
      const response = await request(app).post('/auth/register').send(register_with_correct_credentials);
      expect(response.status).toBe(StatusCodes.OK);
    });

    it('should not register with existing credentials', async () => {
      const response = await request(app).post('/auth/register').send(register_with_correct_credentials);
      expect(response.status).toBe(StatusCodes.CONFLICT);
    });
  });

  // login test
  describe('POST /auth/login', () => {
    it('should not login with wrong credentials', async () => {
      const response = await request(app).post('/auth/login').send(login_with_wrong_credentials);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should not login with username and passord correct but email of different user that exists in db', async () => {
      const response = await request(app).post('/auth/login').send(login_with_correct_credentials_but_different_email);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should login with correct credentials', async () => {
      const response = await request(app).post('/auth/login').send(login_with_correct_credentials);
      expect(response.status).toBe(StatusCodes.OK);
    });
  });
});
