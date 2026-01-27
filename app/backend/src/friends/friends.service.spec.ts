import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Friend, FriendStatus } from './entities/friend.entity';
import { UsersService } from '../users/users.service';


describe('FriendsService', () => {
  let service: FriendsService;

  // Mock repository
  const mockFriendRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  // Mock UsersService
  const mockUsersService = {
    findUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        {
          provide: getRepositoryToken(Friend),
          useValue: mockFriendRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test for sendFriendRequest
  describe('sendFriendRequest', () => {
    it('should throw error when sending request to self', async () => {
      await expect(
        service.sendFriendRequest(1, { recipientId: 1 }),
      ).rejects.toThrow('You cannot send a friend request to yourself');
    });

    it('should throw NotFoundException when recipient not found', async () => {
      mockUsersService.findUserById.mockResolvedValue(null);
      
      await expect(
        service.sendFriendRequest(1, { recipientId: 2 }),
      ).rejects.toThrow('Recipient not found');
    });

    it('should create friend request successfully', async () => {
      mockUsersService.findUserById.mockResolvedValue({ id: 2 });
      mockFriendRepository.findOne.mockResolvedValue(null);
      mockFriendRepository.create.mockReturnValue({ id: 1 });
      mockFriendRepository.save.mockResolvedValue({ id: 1 });

      const result = await service.sendFriendRequest(1, { recipientId: 2 });
      
      expect(mockFriendRepository.create).toHaveBeenCalled();
      expect(mockFriendRepository.save).toHaveBeenCalled();
    });
  });
  
  // Test for receiving friend requests
  describe('getReceivedFriendRequests', () => {
    it('should return pending friend requests received by user', async () => {
      const mockRequestes = [
        { id: 1, status: 'PENDING', requester: { id: 2, username: 'user2'} },
        { id: 2, status: 'PENDING', requester: { id: 3, username: 'user3'} },
      ];
      
      mockFriendRepository.find.mockResolvedValue(mockRequestes);
      const result = await service.getReceivedFriendRequests(1);
      
      expect(mockFriendRepository.find).toHaveBeenCalledWith({
        where: { recipient: { id: 1 }, status: 'PENDING'},
        relations: ['requester']
      });
      expect(result).toEqual(mockRequestes);
    });

    it('should return empty array when no pending requests', async() => {
      mockFriendRepository.find.mockResolvedValue([]);
      const result = await service.getReceivedFriendRequests(1);
      expect(result).toEqual([]);
    });
  }); 

  describe('getSentRequests', () => {
    it('should return pending friend requests sent by user', async () => {
      const mockRequests = [
        { id: 1, status: 'PENDING', recipient: { id: 2, username: 'user2'}},
      ];

      mockFriendRepository.find.mockResolvedValue(mockRequests);

      const result = await service.getSentRequests(1);
      
      expect(mockFriendRepository.find).toHaveBeenCalledWith({
        where: { requester: { id: 1 }, status: 'PENDING'},
        relations: ['recipient']
      });
      expect(result).toEqual(1);
    });
  });

  describe('getMyFriends', () => {
    it('should return accepted friends (user is requester)', async () => {
      const mockFriends = [
        { id: 1, status: 'ACCEPTED', requester: { id: 2, username: 'friend1'}},
        { id: 2, status: 'ACCEPTED', requester: { id: 3, username: 'friend2'}}
      ];

      mockFriendRepository.find.mockResolvedValue(mockFriends);

      const result = await service.getMyFriends(1);

      expect(result).toEqual([{ id: 2, username: 'friend1'}]);
    });

    it('should return accepted friends (user is recipient', async () => {
      const mockFriends = [
        { id: 1, status: 'ACCEPTED', requster: { id: 2, username: 'friend1'}, recipient: { id: 1 }}
      ];

      mockFriendRepository.find.mockResolvedValue(mockFriends);

      const result = await service.getMyFriends(1);

      expect(result).toEqual([{ id: 2, username: 'friend1'}]);
    });

    it('should return empty array when no friends', async() => {
      mockFriendRepository.find.mockResolvedValue([]);
      const result = await service.getMyFriends(1);
      expect(result).toEqual([]);
    });
  });


  describe('updateStatus', () => {
    it('should update friend request successfully', async () => {
      const mockRequest = {
        id: 1,
        status: 'PENDING',
        recipient: { id: 1 },
      };
      
      mockFriendRepository.findOne.mockResolvedValue(mockRequest);
      mockFriendRepository.save.mockResolvedValue({ ...mockRequest, status: 'ACCEPTED' });
    
      const result = await service.updateStatus(1, 1, { status: 'REJECTED' as any });

      expect(result.status).toBe('REJECTED');
    });

    it('should throw NotFoundExecption when request not found', async() => {
      mockFriendRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus(999, 1, { status: 'ACCEPTED' as any }),
      ).rejects.toThrow('Friend request not found');
    });

    it('should throw error when trying to accept request not sent to you', async() => {
      const mockRequest = {
        id: 1,
        status: 'PENDING',
        recipient: { id: 2 },
      };
      mockFriendRepository.findOne.mockResolvedValue(mockRequest);

      await expect(
        service.updateStatus(1, 1, { status: 'ACCEPTED' as any }),
      ).rejects.toThrow('You can only accept request to you');
    });
  });


  describe('remove', () => {
    it('should remove friend succesfully (as requester)', async () => {
      const mockFriend = {
        id: 1,
        requester: { id: 1 },
        recipient: { id: 2 },
      };
      mockFriendRepository.findOne.mockResolvedValue(mockFriend);
      mockFriendRepository.remove.mockResolvedValue(mockFriend);

      const result = await service.remove(1, 1);
      expect(mockFriendRepository.remove).toHaveBeenCalledWith(mockFriend);
    });

    it('should throw NotFoundException when friend not found', async () => {
      mockFriendRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(999, 1)).rejects.toThrow('Friend not found');
    });
    it('should throw error when user has no permission to delete', async () => {
      const mockFriend = { 
        id: 1, 
        requester: { id: 2 }, 
        recipient: { id: 3 },  // userId 1 is neither requester nor recipient
      };
      mockFriendRepository.findOne.mockResolvedValue(mockFriend);
      await expect(service.remove(1, 1)).rejects.toThrow(
        'You do not have permission to delete this friend',
      );
    });
  })
});
