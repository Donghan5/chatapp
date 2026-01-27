import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LocalService } from './local.service';
import { GoogleService } from './google.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  const mockLocalService = {
    validateUser: jest.fn(),
  };

  const mockGoogleService = {
    validateUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUsersService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: LocalService, useValue: mockLocalService },
        { provide: GoogleService, useValue: mockGoogleService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // validateLocalUser
  // ============================================
  describe('validateLocalUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockLocalService.validateUser.mockResolvedValue(mockUser);

      const result = await service.validateLocalUser('test@example.com', 'password');

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      mockLocalService.validateUser.mockResolvedValue(null);

      await expect(
        service.validateLocalUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ============================================
  // login
  // ============================================
  describe('login', () => {
    it('should return access_token and user', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@example.com',
      });
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: mockUser,
      });
    });
  });

  // ============================================
  // validateGoogleUser
  // ============================================
  describe('validateGoogleUser', () => {
    it('should return user for valid Google credentials', async () => {
      const mockUser = { id: 1, email: 'google@example.com' };
      mockGoogleService.validateUser.mockResolvedValue(mockUser);

      const result = await service.validateGoogleUser(
        'google@example.com',
        'John',
        'Doe',
        'google-123',
      );

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for invalid Google user', async () => {
      mockGoogleService.validateUser.mockResolvedValue(null);

      await expect(
        service.validateGoogleUser('bad@example.com', 'John', 'Doe', 'bad-id'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});