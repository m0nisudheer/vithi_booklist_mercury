import mercury from "@mercury-js/core";
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const resolvers = {
  Mutation: {
    // Signup mutation
    signUp: async (root, { signUpData }, ctx) => {
      try {
        const userSchema = mercury.db.User;
        const superAdminSchema = mercury.db.superAdmin;
    
        // Check for existing user by username
        const existingUserByUsername = await userSchema.mongoModel.findOne({ userName: signUpData.userName });
        if (existingUserByUsername) {
          console.warn(`Signup attempted with existing username: ${signUpData.userName}`);
          throw new GraphQLError("Username already taken. Please choose a different one.");
        }
    
        // Check for existing user by email
        const existingUserByEmail = await userSchema.mongoModel.findOne({ email: signUpData.email });
        if (existingUserByEmail) {
          console.warn(`Signup attempted with existing email: ${signUpData.email}`);
          throw new GraphQLError("Email already exists.");
        }
    
        // Check if the email is in the superAdmin list
        const superAdminEntry = await superAdminSchema.mongoModel.findOne({ email: signUpData.email });
        const assignedRole = superAdminEntry ? "ADMIN" : "USER";  
          
        // Create new user
        const newUser = await userSchema.mongoModel.create({
          userName: signUpData.userName,
          email: signUpData.email,
          password: signUpData.password,
          role: assignedRole,
        });
    
        return {
          id: newUser.id,
          msg: "User Registered Successfully",
          role: newUser.role,
        };
      } catch (error) {
        console.error("Sign up error:", error);
        throw new GraphQLError(error.message); 
      }
    },

    // Login mutation
    login: async (root, { email, password }) => {
      try {
        const userSchema = mercury.db.User;
        const user = await userSchema.mongoModel.findOne({ email });

        if (!user) {
          throw new GraphQLError("Invalid email or password");
        }

        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
          throw new GraphQLError("Invalid email or password");
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || "vithi",  
          { expiresIn: "30d" }
        );

        return {
          msg: "User successfully logged in",
          user: user.id,
          userName: user.userName,  
          token: token,
          role: user.role,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw new GraphQLError(error.message);
      }
    },

    // Mutation to add an email to the superAdmin collection
    addSuperAdminEmail: async (root, { email }, ctx) => {
      try {
        const superAdminSchema = mercury.db.superAdmin;

        // Check if the email is already in the superAdmin collection
        const existingSuperAdmin = await superAdminSchema.mongoModel.findOne({ email });

        if (existingSuperAdmin) {
          throw new GraphQLError("This email is already registered as an Admin");
        }

        // Add the new email to the superAdmin collection
        const newSuperAdmin = await superAdminSchema.mongoModel.create({ email });

        return {
          msg: "Admin added successfully",
          email: newSuperAdmin.email,
        };
      } catch (error) {
        console.error("Error adding super admin email:", error);
        throw new GraphQLError(error.message);
      }
    },
  },
};

module.exports = resolvers;
