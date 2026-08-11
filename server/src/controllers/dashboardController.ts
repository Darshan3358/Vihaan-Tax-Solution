import { Request, Response } from 'express';
import { Lead } from '../models/Lead';
import { Service } from '../models/Service';
import { Testimonial } from '../models/Testimonial';
import { catchAsync } from '../utils/catchAsync';

export const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const [totalLeads, newLeads, inDiscussionLeads, convertedLeads, totalServices, publishedTestimonials] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'New' }),
    Lead.countDocuments({ status: 'In Discussion' }),
    Lead.countDocuments({ status: 'Converted' }),
    Service.countDocuments(),
    Testimonial.countDocuments({ published: true }),
  ]);

  const leadsByServiceRaw = await Lead.aggregate([
    { $group: { _id: '$serviceName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const leadsByService = leadsByServiceRaw.map((item) => ({
    name: item._id || 'General',
    count: item.count,
  }));

  const leadsByStatusRaw = await Lead.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const leadsByStatus = leadsByStatusRaw.map((item) => ({
    status: item._id,
    count: item.count,
  }));

  const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalLeads,
        newLeads,
        inDiscussionLeads,
        convertedLeads,
        totalServices,
        publishedTestimonials,
      },
      leadsByService,
      leadsByStatus,
      recentLeads,
    },
  });
});
