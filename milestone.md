📊 Current Implementation Status
✅ What's Already Implemented
Category	Feature	Backend	Frontend
Auth	Google OAuth Login	✅	✅
Auth	JWT Authentication	✅	✅
Auth	Local Login Strategy	✅	✅
Users	Create/Find User	✅	✅
Users	Profile (view/update)	✅	⚠️ (ProfileModal exists)
Users	User Search	✅	⚠️ (used in CreateChatModal)
Chat	WebSocket Connection	✅	✅
Chat	Send/Receive Messages	✅	✅
Chat	Join/Leave Room	✅	✅
Chat	Room List	✅	✅
Chat	Create Chat Room	✅	✅
Friends	Send Friend Request	✅	✅
Friends	Accept/Reject Request	✅	✅
Friends	Get Friends List	✅	✅
Friends	Remove Friend	✅	✅
Infra	Kafka Integration	✅	-
Infra	PostgreSQL	✅	-
Infra	K8s Manifests	✅	-
❌ Missing MVP Features
Priority	Feature	Description
🔴 High	Message Persistence Display	Messages aren't persisted/loaded when rejoining a room
🔴 High	1:1 Chat Room Creation	No way to start DM from friends list
🔴 High	Online/Offline Status	No real-time presence indicators
🔴 High	Test Coverage	README mentions "Have to modify tests"
🟡 Medium	Typing Indicators	Show when someone is typing
🟡 Medium	Read Receipts	Message seen status (sent ✓, delivered ✓✓, read ✓✓ blue)
🟡 Medium	Friends UI Panel	Dedicated UI for managing friend requests
🟡 Medium	Notification System	In-app notifications for new messages/requests
🟡 Medium	Group Chat Management	Add/remove members, rename group
🟢 Low	Media Messages	Send images, files, voice messages
🟢 Low	Message Reactions	Emoji reactions on messages
🟢 Low	Message Search	Search through chat history
🟢 Low	Message Edit/Delete	Edit or delete sent messages
🗺️ Suggested Milestones
Milestone 1: Core Chat Reliability (Est. 1-2 weeks)
 Load message history when joining a room (persist & fetch) OK
 Fix typo: PENGING → PENDING in friendsApi.ts:5 OK
 Fix/write unit tests for backend services
 Error handling improvements (network failures, reconnection)
Milestone 2: Friends & DM Enhancement (Est. 1 week)
 Create DM directly from friends list
 Friend requests UI panel (received/sent tabs)
 User online/offline presence via WebSocket
Milestone 3: Real-time UX (Est. 1-2 weeks)
 Typing indicators (isTyping websocket event)
 Read receipts (message status tracking)
 Push notifications / In-app notifications
 Unread message count badges
Milestone 4: Group Chat Features (Est. 1 week)
 Add/Remove participants
 Rename group chat
 Leave group functionality
 Group admin roles
Milestone 5: Rich Media & Polish (Est. 2 weeks)
 Image/File upload & sharing
 Message reactions (emoji)
 Message search
 Edit/Delete messages
