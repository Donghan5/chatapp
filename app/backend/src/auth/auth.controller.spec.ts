import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  // Mock AuthService
  const mockAuthService = {
    login: jest.fn(),
    validateLocalUser: jest.fn(),
    validateGoogleUser: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ============================================
  // POST /auth/login
  // ============================================
  describe('login', () => {
    it('should return access token and user on successful login', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockResponse = {
        access_token: 'jwt-token-here',
        user: mockUser,
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      // Simulate request object with user attached by LocalAuthGuard
      const req = { user: mockUser };

      const result = await controller.login(req);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockResponse);
    });
  });

  // ============================================
  // GET /auth/me
  // ============================================
  describe('getProfile', () => {
    it('should return the authenticated user', () => {
      const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' };
      const req = { user: mockUser };

      const result = controller.getProfile(req);

      expect(result).toEqual(mockUser);
    });
  });

  // ============================================
  // GET /auth/google/callback
  // ============================================
  describe('googleAuthRedirect', () => {
    it('should redirect to frontend with token', async () => {
      const mockUser = { id: 1, email: 'google@example.com' };
      const mockToken = 'google-jwt-token';

      mockAuthService.login.mockResolvedValue({ access_token: mockToken });

      const req = { user: mockUser };
      const res = {
        redirect: jest.fn(),
      };

      // Set env for test
      process.env.FRONTEND_URL = 'http://localhost:5173';

      await controller.googleAuthRedirect(req, res as any);

      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(res.redirect).toHaveBeenCalledWith(
        `http://localhost:5173/login?token=${mockToken}`,
      );
    });
  });
});