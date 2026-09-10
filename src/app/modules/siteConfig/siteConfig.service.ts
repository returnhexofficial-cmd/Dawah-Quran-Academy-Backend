import httpStatus from "http-status";
import ApiError from "../../utils/AppError";
import {
  SITE_CONFIG_DEFAULTS,
  SITE_CONFIG_FIELDS,
  SITE_CONFIG_KEY,
  TSiteConfigPayload,
} from "./siteConfig.interface";
import { SiteConfig } from "./siteConfig.model";

/**
 * Reads the single config document, creating it from the defaults the first
 * time it is requested. Upserting on read means the public site never has to
 * cope with a missing config.
 */
const getSiteConfigDB = async () => {
  const config = await SiteConfig.findOneAndUpdate(
    { key: SITE_CONFIG_KEY },
    { $setOnInsert: { key: SITE_CONFIG_KEY, ...SITE_CONFIG_DEFAULTS } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return config;
};

const updateSiteConfigDB = async (payload: Partial<TSiteConfigPayload>) => {
  // Only the five known fields are writable; `key` and anything else the
  // client sends is discarded rather than persisted.
  const updates: Partial<TSiteConfigPayload> = {};
  for (const field of SITE_CONFIG_FIELDS) {
    const value = payload[field];
    if (typeof value === "string" && value.trim()) {
      updates[field] = value.trim();
    }
  }

  if (!Object.keys(updates).length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Provide at least one of: " + SITE_CONFIG_FIELDS.join(", ")
    );
  }

  const config = await SiteConfig.findOneAndUpdate(
    { key: SITE_CONFIG_KEY },
    { $set: updates, $setOnInsert: { key: SITE_CONFIG_KEY } },
    { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
  );
  return config;
};

export const SiteConfigServices = {
  getSiteConfigDB,
  updateSiteConfigDB,
};
