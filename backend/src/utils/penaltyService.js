import Report from "../models/Report.js";
import Provider from "../models/Provider.js";

export const checkProviderPenalty = async (providerId) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Find all reports against this provider in the last 7 days
  const reports = await Report.find({
    provider: providerId,
    createdAt: { $gte: sevenDaysAgo },
  });

  // Count unique users who reported
  const uniqueUsers = new Set(reports.map(r => r.user.toString()));

  console.log(`Checking reports for Provider: ${providerId}. Total found in last 7 days: ${reports.length}`);

  // 3+ total complaints = flagged
  if (reports.length >= 3) {
    console.log(`THRESHOLD REACHED: Flagging provider ${providerId}...`);
    await Provider.findByIdAndUpdate(providerId, {
      status: 'flagged',
      complaintCount: reports.length
    });
    console.log(`Provider ${providerId} SUCCESSFULY FLAGGED.`);
    return true;
  }

  return false;
};