import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // createUser
  // ============================================
  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto = { email: 'test@example.com', password: 'hashedpass', provider: 'local' };
      const mockUser = { id: 1, ...createUserDto };

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto as any);

      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when email already exists', async () => {
      mockUserRepository.create.mockReturnValue({});
      mockUserRepository.save.mockRejectedValue({ code: '23505' });

      await expect(
        service.createUser({ email: 'existing@example.com' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      mockUserRepository.create.mockReturnValue({});
      mockUserRepository.save.mockRejectedValue(new Error('DB error'));

      await expect(
        service.createUser({ email: 'test@example.com' } as any),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  // ============================================
  // findByEmail
  // ============================================
  describe('findByEmail', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  // ============================================
  // getMyProfile
  // ============================================
  describe('getMyProfile', () => {
    it('should return user without password hash', async () => {
      const mockUser = { id: 1, email: 'test@example.com', passwordHash: 'secret' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getMyProfile(1);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getMyProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ============================================
  // updateProfile
  // ============================================
  describe('updateProfile', () => {
    it('should update user profile', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 });

      await service.updateProfile(1, { username: 'newname' });

      expect(mockUserRepository.update).toHaveBeenCalledWith(1, { username: 'newname' });
    });
  });

  // ============================================
  // updateSettings
  // ============================================
  describe('updateSettings', () => {
    it('should merge and save settings', async () => {
      const mockUser = { 
        id: 1, 
        email: 'test@example.com',
        settings: { theme: 'light', isPushEnabled: true, isMarketingAgreed: false },
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user));

      const result = await service.updateSettings(1, { theme: 'dark' } as any);

      expect(result.settings.theme).toBe('dark');
      expect(result.settings.isPushEnabled).toBe(true); // preserved
    });
  });

  // ============================================
  // deleteMyProfile
  // ============================================
  describe('deleteMyProfile', () => {
    it('should delete user successfully', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.deleteMyProfile(1)).resolves.toBeUndefined();
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteMyProfile(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ============================================
  // findUserById
  // ============================================
  describe('findUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findUserById(1);

      expect(result).toEqual(mockUser);
    });

    it('should return null when not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findUserById(999);

      expect(result).toBeNull();
    });
  });

  // ============================================
  // searchUsers
  // ============================================
  describe('searchUsers', () => {
    it('should return users matching username', async () => {
      const mockUsers = [
        { id: 1, username: 'john', avatarUrl: null },
        { id: 2, username: 'johnny', avatarUrl: null },
      ];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.searchUsers('john');

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no matches', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const result = await service.searchUsers('nonexistent');

      expect(result).toEqual([]);
    });
  });
});