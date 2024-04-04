
const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {

    Mutation: {

        userLogin: async (_, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError("User not found");
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError("Incorrect password");
            }

            const token = signToken(user);

            return {
                token,
                user
            };
        },

        createUser: async (_, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {
                token,
                user
            };
        },

        addBook: async (_, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                );

                return updatedUser;

            }

            throw new AuthenticationError("Authentication required");
        },

        deleteBook: async (_, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                return updatedUser;

            }

            throw new AuthenticationError("Authentication required");
        }

    },

    Query: {

        getUser: async (_, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select("-__v -password");

                return userData;

            }

            throw new AuthenticationError("User not authenticated");
        }

    }

};

module.exports = resolvers;
