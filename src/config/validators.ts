import Joi, { ObjectSchema } from "joi";

const projectCreateSchema: ObjectSchema = Joi.object().keys({
  sellerId: Joi.string().required().messages({
    "string.base": "Seller Id must be of type string",
    "string.empty": "Seller Id is required",
    "any.required": "Seller Id is required",
  }),
  profilePicture: Joi.string().required().messages({
    "string.base": "Please add a profile picture",
    "string.empty": "Profile picture is required",
    "any.required": "Profile picture is required",
  }),
  title: Joi.string().required().messages({
    "string.base": "Please add a project title",
    "string.empty": "Project title is required",
    "any.required": "Project title is required",
  }),
  description: Joi.string().required().messages({
    "string.base": "Please add a project description",
    "string.empty": "Project description is required",
    "any.required": "Project description is required",
  }),
  categories: Joi.string().required().messages({
    "string.base": "Please select a category",
    "string.empty": "Project category is required",
    "any.required": "Project category is required",
  }),
  subCategories: Joi.array().items(Joi.string()).required().min(1).messages({
    "string.base": "Please add at least one subcategory",
    "string.empty": "Project subcategories are required",
    "any.required": "Project subcategories are required",
    "array.min": "Please add at least one subcategory",
  }),
  tags: Joi.array().items(Joi.string()).required().min(1).messages({
    "string.base": "Please add at least one tag",
    "string.empty": "Project tags are required",
    "any.required": "Project tags are required",
    "array.min": "Please add at least one tag",
  }),
  price: Joi.number().required().greater(4.99).messages({
    "string.base": "Please add a project price",
    "string.empty": "Project price is required",
    "any.required": "Project price is required",
    "number.greater": "Project price must be greater than $4.99",
  }),
  coverImage: Joi.string().required().messages({
    "string.base": "Please add a cover image",
    "string.empty": "Project cover image is required",
    "any.required": "Project cover image is required",
    "array.min": "Please add a cover image",
  }),
  expectedDelivery: Joi.string().required().messages({
    "string.base": "Please add expected delivery",
    "string.empty": "Project expected delivery is required",
    "any.required": "Project expected delivery is required",
    "array.min": "Please add a expected delivery",
  }),
  basicTitle: Joi.string().required().messages({
    "string.base": "Please add basic title",
    "string.empty": "Project basic title is required",
    "any.required": "Project basic title is required",
    "array.min": "Please add a basic title",
  }),
  basicDescription: Joi.string().required().messages({
    "string.base": "Please add basic description",
    "string.empty": "Project basic description is required",
    "any.required": "Project basic description is required",
    "array.min": "Please add a basic description",
  }),
});

const projectUpdateSchema: ObjectSchema = Joi.object().keys({
  title: Joi.string().required().messages({
    "string.base": "Please add a project title",
    "string.empty": "Project title is required",
    "any.required": "Project title is required",
  }),
  description: Joi.string().required().messages({
    "string.base": "Please add a project description",
    "string.empty": "Project description is required",
    "any.required": "Project description is required",
  }),
  categories: Joi.string().required().messages({
    "string.base": "Please select a category",
    "string.empty": "Project category is required",
    "any.required": "Project category is required",
  }),
  subCategories: Joi.array().items(Joi.string()).required().min(1).messages({
    "string.base": "Please add at least one subcategory",
    "string.empty": "Project subcategories are required",
    "any.required": "Project subcategories are required",
    "array.min": "Please add at least one subcategory",
  }),
  tags: Joi.array().items(Joi.string()).required().min(1).messages({
    "string.base": "Please add at least one tag",
    "string.empty": "Project tags are required",
    "any.required": "Project tags are required",
    "array.min": "Please add at least one tag",
  }),
  price: Joi.number().required().greater(4.99).messages({
    "string.base": "Please add a project price",
    "string.empty": "Project price is required",
    "any.required": "Project price is required",
    "number.greater": "Project price must be greater than $4.99",
  }),
  coverImage: Joi.string().required().messages({
    "string.base": "Please add a cover image",
    "string.empty": "Project cover image is required",
    "any.required": "Project cover image is required",
    "array.min": "Please add a cover image",
  }),
  expectedDelivery: Joi.string().required().messages({
    "string.base": "Please add expected delivery",
    "string.empty": "Project expected delivery is required",
    "any.required": "Project expected delivery is required",
    "array.min": "Please add a expected delivery",
  }),
  basicTitle: Joi.string().required().messages({
    "string.base": "Please add basic title",
    "string.empty": "Project basic title is required",
    "any.required": "Project basic title is required",
    "array.min": "Please add a basic title",
  }),
  basicDescription: Joi.string().required().messages({
    "string.base": "Please add basic description",
    "string.empty": "Project basic description is required",
    "any.required": "Project basic description is required",
    "array.min": "Please add a basic description",
  }),
});

export { projectCreateSchema, projectUpdateSchema };
