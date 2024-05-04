import {
  Account,
  ID,
  Client,
  Avatars,
  Databases,
  Query,
  Storage
} from 'react-native-appwrite';

import {Config} from 'react-native-config';

export const appwriteConfig = {
  endpoint: Config.ENDPOINT,
  platform: Config.PLATFORM,
  projectId: Config.PROJECT_ID,
  databaseId: Config.DATABASE_ID,
  usersCollectionId: Config.USERS_COLLECTION_ID,
  videosCollectionId: Config.VIDEOS_COLLECTION_ID,
  storageId: Config.STORAGE_ID
}

// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  // Register User
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(), {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    )
    return newUser;
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password)
    return session
  } catch (err) {
    throw new Error(err)
  }
}

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
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
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

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const {
    mimeType,
    ...rest
  } = file;
  const asset = {
    type: mimeType,
    ...rest
  };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      ID.unique(), {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId
    );

    // Map the documents to include the document ID
    const postsWithIds = posts.documents.map((post) => ({
      ...post,
      id: post.$id,
    }));

    return postsWithIds;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts created by user
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.equal("users", userId)]
    );

    // Map the documents to include the document ID
    const postsWithIds = posts.documents.map((post) => ({
      ...post,
      id: post.$id,
    }));

    return postsWithIds;
  } catch (error) {
    throw new Error(error);
  }
}

// Get video posts that matches search query
export async function searchPosts(query) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    // Map the documents to include the document ID
    const postsWithIds = posts.documents.map((post) => ({
      ...post,
      id: post.$id,
    }));

    return postsWithIds;
  } catch (error) {
    throw new Error(error);
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    // Map the documents to include the document ID
    const postsWithIds = posts.documents.map((post) => ({
      ...post,
      id: post.$id,
    }));

    return postsWithIds;
  } catch (error) {
    throw new Error(error);
  }
}


// Function to get bookmarked videos for a user

// export async function getBookmarkedVideosForUser(userId) {
//   try {
//     // Query the database to find documents where the user's ID is in the boomarkedby array
//     const queries = [
//       // Query.search('boomarkedby', [userId]),
//       Query.equal('bookmarked', true),
//     ];

//     const response = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.videosCollectionId,
//       queries
//     );

//     // Extract and return the documents (bookmarked videos)
//     // Map the documents to include the document ID
//     const postsWithIds = response.documents.map((post) => ({
//       ...post,
//       id: post.$id,
//     }));

//     return postsWithIds;
//   } catch (error) {
//     throw new Error(error);
//   }
// }


export async function getBookmarkedVideosForUser(userId) {
  try {
    // Get all video posts
    const allPosts = await getAllPosts();

    // Filter the posts where the current user's ID is in the bookmarkedby array
    const bookmarkedPosts = allPosts.filter((post) => {
      // Check if the bookmarkedby array exists
      if (post.bookmarked) {
        if (post.boomarkedby) {

          // Iterate over the bookmarkedby array
          for (let i = 0; i < post.boomarkedby.length; i++) {
            // Check if the current element in the bookmarkedby array matches the userId
            if (post.boomarkedby[i].$id === userId) {
              return true; // Return true if userId is found in the bookmarkedby array
            }
          }
        }
      }
      return false; // Return false if userId is not found in the bookmarkedby array
    });

    return bookmarkedPosts;
  } catch (error) {
    throw new Error(error);
  }
}



export async function addBookmarkToVideo(documentId, userId, state) {
  try {
    // Fetch the video document
    const video = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      documentId
    );

    // Remove internal properties from the video object
    const {
      $databaseId,
      $collectionId,
      $permissions,
      ...cleanedVideo
    } = video;

    // Update the document to mark it as bookmarked
    const updatedVideo = {
      ...cleanedVideo, 
      bookmarked: state,
      boomarkedby: [
        ...(cleanedVideo.boomarkedby || []),
        userId // Add the new userId to the boomarkedby array
      ]
    };

    // Update the document in the database
    const result = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videosCollectionId,
      documentId,
      updatedVideo
    );

  } catch (error) {
    throw new Error(error);
  }
}
