//for server-side validation which applied for mongoose schema
const Joi=require('joi');
module.exports.listingSchema=Joi.object({
    listing:Joi.object({
title :Joi.string().required(),
description : Joi.string().required(),
location :Joi.string().required(),
price :Joi.number().required().min(0),
image :Joi.object({
    url :Joi.string().required(),
    filename : Joi.string().required(),
}),
country :Joi.string().required(),
category :Joi.string().required(),
sustainabilityProject: Joi.object({
    name: Joi.string().allow('').optional(),
    description: Joi.string().allow('').optional(),
    startDate: Joi.date().allow('').optional(),
    endDate: Joi.date().allow('').optional(),
    startTime: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).allow('').optional(), 
    endTime: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).allow('').optional(),
  }).optional()
}).required(),
    

});
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
rating :Joi.number().required().min(1).max(5),
comment :Joi.string().required(),
    }).required()
});