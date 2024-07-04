import { Account,Avatars,Client,Databases,ID,Query,Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.tohb.aora',
    projectId: '66849aec0000b542f13f',
    databaseId: '66849c0f002f55d1fc3b',
    userCollectionId: '66849c32000f5f47c0e5',
    videoCollectionId: '66849c4b0012bacc31ba',
    storageId: '66849ebc001bf59a532e',
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(email, password, username) {
    // Register User
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// Sign In
export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

// Sign Out
export async function signOut() {
    try {
        const session = await account.deleteSession("current");
    
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Account
export async function getAccount() {
    try {
        const currentAccount = await account.get();
    
        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Current User
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;
    
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );
    
        if (!currentUser) throw Error;
    
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Get all video Posts
export async function getAllPosts() {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        );
  
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

// Get latest created video posts
export async function getLatestPosts() {
    try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videoCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(7)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }