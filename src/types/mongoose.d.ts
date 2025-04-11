declare module "mongoose" {
  interface MongooseOptions {
    bufferCommands?: boolean;
  }
  
  // Add these type augmentations to fix the method compatibility issues
  interface Model<T> {
    find: any;
    findOne: any;
    findById: any;
    findByIdAndUpdate: any;
    findByIdAndDelete: any;
    create: any;
    insertMany: any;
  }
}
